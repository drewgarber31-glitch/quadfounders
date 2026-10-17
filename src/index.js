// Quad Founders Worker: API + static app + website previews.
import { callAI, callAIJson, isTestMode, AIError } from "./ai.js";
import {
  followUpPrompt,
  ideaFinderPrompt,
  planPrompt,
  regenerateQuadrantPrompt,
  taskChatSystem,
  sitePrompt,
  siteEditPrompt,
} from "./prompts.js";
import { SOURCES, legalStepsFor } from "./sources.js";
import { cleanTypes, KNOWLEDGE } from "./knowledge.js";
import { renderPage, siteFiles, makeZip, PAGES } from "./site.js";

const QUADRANTS = ["customer", "pricing", "marketing", "legal"];
const LIMITS = { idea: 2000, answer: 500, message: 1500, instruction: 500, summary: 1200, history: 20 };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith("/api/")) return await api(request, env, url);
      if (url.pathname.startsWith("/preview/")) return await preview(env, url);
      return env.ASSETS.fetch(request);
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.message }, err.status);
      if (err instanceof AIError) return json({ error: err.message }, 502);
      console.error(err);
      return json({ error: "Something went wrong on our side. Try again." }, 500);
    }
  },
};

// ---------------- API ----------------

async function api(request, env, url) {
  const parts = url.pathname.split("/").filter(Boolean).slice(1); // drop "api"
  const method = request.method;

  if (parts[0] === "status" && method === "GET") {
    return json({ testMode: isTestMode(env) });
  }
  if (parts[0] === "sources" && method === "GET") {
    return json({ sources: SOURCES });
  }
  // POST /api/ideas  -> original idea suggestions from the student's own inputs
  if (parts[0] === "ideas" && parts.length === 1 && method === "POST") {
    const b = await body(request);
    const input = {
      problems: clean(b.problems, 800),
      skills: clean(b.skills, 500),
      major: clean(b.major, 120),
      hours: clean(b.hours, 40),
      budget: clean(b.budget, 40),
    };
    if ((input.problems + input.skills + input.major).length < 10) {
      throw new HttpError(400, "Tell us at least one problem you've noticed or something you're good at.");
    }
    await useQuota(request, env);
    const out = await callAIJson(env, { kind: "ideas", build: true, maxTokens: 4000, ...ideaFinderPrompt(input) });
    const ideas = (out.ideas || []).slice(0, 4).map((i) => ({
      title: clean(i.title, 60),
      oneLiner: clean(i.oneLiner, 240),
      problem: clean(i.problem, 300),
      customer: clean(i.customer, 200),
      whatsNew: clean(i.whatsNew, 300),
      firstTest: clean(i.firstTest, 300),
      fit: clean(i.fit, 300),
      watchOut: clean(i.watchOut, 300),
    }));
    return json({ ideas });
  }

  if (parts[0] !== "projects") throw new HttpError(404, "Not found.");

  // POST /api/projects  -> new project + follow-up questions
  if (parts.length === 1 && method === "POST") {
    const { idea } = await body(request);
    const text = clean(idea, LIMITS.idea);
    if (text.length < 10) throw new HttpError(400, "Tell us a little more about your idea (at least a sentence).");
    await useQuota(request, env);
    const out = await callAIJson(env, { kind: "followup", ...followUpPrompt(text), maxTokens: 1500 });
    const questions = (out.questions || []).slice(0, 5).map((q, i) => ({
      id: `q${i + 1}`,
      text: clean(q.text, 200),
      hint: clean(q.hint, 120),
    }));
    const types = cleanTypes(out.types);
    const novelty = ["common", "twist", "new"].includes(out.novelty) ? out.novelty : "common";
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO projects (id, created_at, updated_at, idea, questions) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, now, now, JSON.stringify({ text, title: clean(out.title, 60), types, novelty }), JSON.stringify(questions)).run();
    return json({ id, title: clean(out.title, 60), types, novelty, questions }, 201);
  }

  const id = parts[1];
  if (!/^[0-9a-f-]{36}$/.test(id || "")) throw new HttpError(404, "Project not found.");
  const project = await loadProject(env, id);

  // GET /api/projects/:id
  if (parts.length === 2 && method === "GET") return json(publicProject(project));

  // POST /api/projects/:id/plan  (answers -> plan)
  if (parts[2] === "plan" && parts.length === 3 && method === "POST") {
    const { answers = {} } = await body(request);
    const cleanAnswers = {};
    for (const q of project.questions || []) cleanAnswers[q.id] = clean(answers[q.id], LIMITS.answer);
    await useQuota(request, env);
    const out = await callAIJson(env, {
      kind: "plan",
      build: true,
      maxTokens: 6000,
      ...planPrompt(project.idea, project.types, project.questions, cleanAnswers, project.novelty),
    });
    const plan = normalizePlan(out, project.types);
    await save(env, id, { answers: cleanAnswers, plan });
    return json(publicProject({ ...project, answers: cleanAnswers, plan }));
  }

  // /api/projects/:id/quadrants/:q[/regenerate]
  if (parts[2] === "quadrants") {
    const q = parts[3];
    if (!QUADRANTS.includes(q) || !project.plan) throw new HttpError(404, "That part of the plan doesn't exist yet.");
    if (parts[4] === "regenerate" && method === "POST") {
      const { feedback } = await body(request);
      await useQuota(request, env);
      const out = await callAIJson(env, {
        kind: "quadrant",
        maxTokens: 1000,
        ...regenerateQuadrantPrompt(project, q, clean(feedback, LIMITS.instruction)),
      });
      project.plan.quadrants[q].summary = sanitizeSources(clean(out.summary, LIMITS.summary));
    } else if (parts.length === 4 && method === "PATCH") {
      const { summary } = await body(request);
      const s = clean(summary, LIMITS.summary);
      if (!s) throw new HttpError(400, "The summary can't be empty.");
      project.plan.quadrants[q].summary = s;
    } else throw new HttpError(405, "Not allowed.");
    await save(env, id, { plan: project.plan });
    return json(publicProject(project));
  }

  // PATCH /api/projects/:id/assumptions/:aid  {status: untested|holds|wrong}
  if (parts[2] === "assumptions" && parts.length === 4 && method === "PATCH") {
    const a = project.plan?.assumptions?.find((x) => x.id === parts[3]);
    if (!a) throw new HttpError(404, "Assumption not found.");
    const { status } = await body(request);
    if (!["untested", "holds", "wrong"].includes(status)) throw new HttpError(400, "Pick untested, confirmed, or proven wrong.");
    a.status = status;
    await save(env, id, { plan: project.plan });
    return json(publicProject(project));
  }

  // /api/projects/:id/tasks/:taskId[/messages]
  if (parts[2] === "tasks") {
    const task = project.plan?.tasks.find((t) => t.id === parts[3]);
    if (!task) throw new HttpError(404, "Task not found.");

    if (parts.length === 4 && method === "PATCH") {
      const { done } = await body(request);
      task.done = Boolean(done);
      await save(env, id, { plan: project.plan });
      return json(publicProject(project));
    }
    if (parts[4] === "messages" && method === "GET") {
      return json({ messages: await history(env, id, task.id) });
    }
    if (parts[4] === "messages" && method === "POST") {
      const { message } = await body(request);
      const text = clean(message, LIMITS.message);
      if (!text) throw new HttpError(400, "Type a message first.");
      await useQuota(request, env);
      const past = await history(env, id, task.id);
      const messages = [...past.slice(-LIMITS.history), { role: "user", content: text }].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const reply = sanitizeSources(
        await callAI(env, { kind: "chat", system: taskChatSystem(project, task), messages, maxTokens: 1000 })
      );
      const now = new Date().toISOString();
      await env.DB.batch([
        env.DB.prepare("INSERT INTO messages (project_id, task_id, role, content, created_at) VALUES (?, ?, 'user', ?, ?)").bind(id, task.id, text, now),
        env.DB.prepare("INSERT INTO messages (project_id, task_id, role, content, created_at) VALUES (?, ?, 'assistant', ?, ?)").bind(id, task.id, reply, now),
      ]);
      return json({ messages: await history(env, id, task.id) });
    }
    throw new HttpError(405, "Not allowed.");
  }

  // /api/projects/:id/site...
  if (parts[2] === "site" || parts[2] === "site.zip") {
    if (parts[2] === "site.zip" && method === "GET") {
      if (!project.site) throw new HttpError(404, "Build your site first.");
      const zip = makeZip(siteFiles(project.site));
      const slug = (project.site.businessName || "my-site").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-site";
      return new Response(zip, {
        headers: {
          "content-type": "application/zip",
          "content-disposition": `attachment; filename="${slug}-website.zip"`,
        },
      });
    }
    if (!project.plan) throw new HttpError(400, "Finish your plan before building your site.");

    if (parts.length === 3 && method === "POST") {
      await useQuota(request, env);
      const out = await callAIJson(env, { kind: "site", build: true, maxTokens: 5000, ...sitePrompt(project) });
      const site = normalizeSite(out, project.site);
      await save(env, id, { site });
      return json(publicProject({ ...project, site }));
    }
    if (parts[3] === "edit" && method === "POST") {
      if (!project.site) throw new HttpError(400, "Build your site first.");
      const { instruction } = await body(request);
      const text = clean(instruction, LIMITS.instruction);
      if (!text) throw new HttpError(400, "Describe the change you want.");
      await useQuota(request, env);
      const out = await callAIJson(env, { kind: "siteEdit", build: true, maxTokens: 5000, ...siteEditPrompt(project, text) });
      const site = normalizeSite(out, project.site);
      await save(env, id, { site });
      return json(publicProject({ ...project, site }));
    }
    if (parts[3] === "contact" && method === "PATCH") {
      if (!project.site) throw new HttpError(400, "Build your site first.");
      const { email, instagram, location } = await body(request);
      const contact = project.site.pages.contact;
      const em = clean(email, 120);
      const ig = clean(instagram, 40).replace(/^@/, "");
      if (em && !/^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(em)) {
        throw new HttpError(400, "That email doesn't look right. Check it and try again.");
      }
      if (ig && !/^[A-Za-z0-9._]{1,30}$/.test(ig)) {
        throw new HttpError(400, "Instagram handles can only use letters, numbers, periods, and underscores.");
      }
      contact.email = em;
      contact.instagram = ig;
      contact.location = clean(location, 120);
      await save(env, id, { site: project.site });
      return json(publicProject(project));
    }
    throw new HttpError(405, "Not allowed.");
  }

  throw new HttpError(404, "Not found.");
}

// ---------------- Website preview ----------------

async function preview(env, url) {
  const [, id, pageRaw] = url.pathname.split("/").filter(Boolean);
  if (!/^[0-9a-f-]{36}$/.test(id || "")) return new Response("Not found", { status: 404 });
  const project = await loadProject(env, id);
  if (!project.site) return new Response("No site yet", { status: 404 });
  const page = PAGES.includes(pageRaw) ? pageRaw : "home";
  const html = renderPage(project.site, page, (pg) => `/preview/${id}/${pg}`);
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Student sites never run scripts.
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data: https:; frame-ancestors 'self'",
      "x-content-type-options": "nosniff",
    },
  });
}

// ---------------- Helpers ----------------

function normalizePlan(out, types = []) {
  const quadrants = {};
  for (const q of QUADRANTS) {
    quadrants[q] = { summary: sanitizeSources(clean(out?.quadrants?.[q]?.summary, LIMITS.summary)) || "Ask the co-pilot to fill this in." };
  }
  const tasks = [];
  const counts = {};
  for (const t of out?.tasks || []) {
    if (!["customer", "pricing", "marketing"].includes(t.quadrant)) continue;
    counts[t.quadrant] = (counts[t.quadrant] || 0) + 1;
    if (counts[t.quadrant] > 5) continue;
    tasks.push({
      id: `${t.quadrant}-${counts[t.quadrant]}`,
      quadrant: t.quadrant,
      title: clean(t.title, 120),
      why: sanitizeSources(clean(t.why, 240)),
      basis: clean(t.basis, 80),
      minutes: clampMinutes(t.minutes),
      sources: basisSources(t.basis),
      done: false,
    });
  }
  const legalAI = new Map((out?.legal || []).map((l) => [l.id, l]));
  for (const step of legalStepsFor(types)) {
    const ai = legalAI.get(step.id);
    if (ai && ai.applies === false) continue;
    tasks.push({
      id: step.id,
      quadrant: "legal",
      title: step.title,
      why: sanitizeSources(clean(ai?.why, 240)) || "Read the official source to see if this applies to you.",
      minutes: step.minutes,
      sources: step.sources,
      done: false,
    });
  }
  const assumptions = (Array.isArray(out?.assumptions) ? out.assumptions : []).slice(0, 5).map((a, i) => ({
    id: `a${i + 1}`,
    text: sanitizeSources(clean(a?.text, 240)),
    test: sanitizeSources(clean(a?.test, 240)),
    status: "untested",
  })).filter((a) => a.text);
  return { quadrants, tasks, assumptions };
}

function normalizeSite(out, previous) {
  const p = out?.pages || {};
  const prevContact = previous?.pages?.contact || {};
  const list = (arr, n, map) => (Array.isArray(arr) ? arr.slice(0, n).map(map) : []);
  return {
    businessName: clean(out?.businessName, 60) || "My Business",
    tagline: clean(out?.tagline, 120),
    palette: ["lawn", "ink", "brick", "sky", "plum", "sun"].includes(out?.palette) ? out.palette : "lawn",
    pages: {
      home: {
        headline: clean(p.home?.headline, 120),
        intro: clean(p.home?.intro, 500),
        cta: clean(p.home?.cta, 40),
        highlights: list(p.home?.highlights, 4, (h) => ({ title: clean(h?.title, 60), text: clean(h?.text, 240) })),
      },
      about: {
        headline: clean(p.about?.headline, 120),
        story: clean(p.about?.story, 1200),
        values: list(p.about?.values, 6, (v) => clean(v, 120)),
      },
      services: {
        headline: clean(p.services?.headline, 120),
        items: list(p.services?.items, 8, (i) => ({
          name: clean(i?.name, 80),
          description: clean(i?.description, 300),
          price: clean(i?.price, 40),
        })),
      },
      contact: {
        headline: clean(p.contact?.headline, 120),
        text: clean(p.contact?.text, 400),
        // Contact details only ever come from the student, never the AI.
        email: prevContact.email || "",
        instagram: prevContact.instagram || "",
        location: prevContact.location || "",
      },
    },
  };
}

function sanitizeSources(text) {
  return String(text).replace(/\[source:([a-z0-9_]+)\]/gi, (m, sid) => (SOURCES[sid] ? `[source:${sid}]` : ""));
}

function basisSources(basis) {
  const b = String(basis || "").toLowerCase().trim();
  if (!b) return [];
  const card = KNOWLEDGE.find((k) => k.title.toLowerCase() === b) ||
    KNOWLEDGE.find((k) => b.includes(k.title.toLowerCase()) || k.title.toLowerCase().includes(b));
  return card ? [card.source] : [];
}

function clampMinutes(m) {
  const n = Math.round(Number(m) || 30);
  return Math.min(90, Math.max(10, n));
}

function clean(v, max) {
  return String(v ?? "").replace(/\u0000/g, "").trim().slice(0, max);
}

async function loadProject(env, id) {
  const row = await env.DB.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first();
  if (!row) throw new HttpError(404, "Project not found. It may have been started on another device.");
  const idea = JSON.parse(row.idea);
  return {
    id: row.id,
    idea: idea.text,
    title: idea.title,
    types: idea.types || [],
    novelty: idea.novelty || "common",
    questions: row.questions ? JSON.parse(row.questions) : [],
    answers: row.answers ? JSON.parse(row.answers) : null,
    plan: row.plan ? JSON.parse(row.plan) : null,
    site: row.site ? JSON.parse(row.site) : null,
    createdAt: row.created_at,
  };
}

function publicProject(p) {
  return { id: p.id, idea: p.idea, title: p.title, types: p.types || [], novelty: p.novelty || "common", questions: p.questions, answers: p.answers, plan: p.plan, site: p.site };
}

async function save(env, id, fields) {
  const sets = [];
  const vals = [];
  for (const [k, v] of Object.entries(fields)) {
    sets.push(`${k} = ?`);
    vals.push(JSON.stringify(v));
  }
  sets.push("updated_at = ?");
  vals.push(new Date().toISOString(), id);
  await env.DB.prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
}

async function history(env, projectId, taskId) {
  const { results } = await env.DB.prepare(
    "SELECT role, content, created_at FROM messages WHERE project_id = ? AND task_id = ? ORDER BY id"
  ).bind(projectId, taskId).all();
  return results || [];
}

// Cost protection: daily caps per visitor and overall.
async function useQuota(request, env) {
  const day = new Date().toISOString().slice(0, 10);
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`qf:${ip}`));
  const visitor = [...new Uint8Array(hash)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
  const perVisitor = Number(env.DAILY_AI_LIMIT_PER_VISITOR || 60);
  const total = Number(env.DAILY_AI_LIMIT_TOTAL || 2000);

  const [v, t] = await env.DB.batch([
    env.DB.prepare("SELECT count FROM usage WHERE key = ? AND day = ?").bind(visitor, day),
    env.DB.prepare("SELECT count FROM usage WHERE key = 'total' AND day = ?").bind(day),
  ]);
  if ((v.results[0]?.count || 0) >= perVisitor) {
    throw new HttpError(429, "You've hit today's limit for AI help. It resets tomorrow.");
  }
  if ((t.results[0]?.count || 0) >= total) {
    throw new HttpError(429, "Quad Founders has hit today's AI limit. Try again tomorrow.");
  }
  const upsert = "INSERT INTO usage (key, day, count) VALUES (?, ?, 1) ON CONFLICT(key, day) DO UPDATE SET count = count + 1";
  await env.DB.batch([env.DB.prepare(upsert).bind(visitor, day), env.DB.prepare(upsert).bind("total", day)]);
}

async function body(request) {
  try {
    const data = await request.json();
    return data && typeof data === "object" ? data : {};
  } catch {
    throw new HttpError(400, "That request wasn't valid. Refresh and try again.");
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
