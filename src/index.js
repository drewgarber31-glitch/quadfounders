// Quad Founders Worker: API + static app + website previews.
import { callAI, callAIJson, isTestMode, AIError } from "./ai.js";
import {
  followUpPrompt,
  ideaFinderPrompt,
  planPrompt,
  regenerateQuadrantPrompt,
  taskChatSystem,
  guidePrompt,
  sitePrompt,
  siteEditPrompt,
} from "./prompts.js";
import { SOURCES, legalStepsFor, LEGAL_STEPS } from "./sources.js";
import { cleanTypes, KNOWLEDGE } from "./knowledge.js";
import { renderPage, siteFiles, makeZip, PAGES, waitlistReady } from "./site.js";
import { STATES, stateName, stateSources } from "./states.js";

const QUADRANTS = ["customer", "pricing", "marketing", "legal"];
const LIMITS = { idea: 2000, answer: 500, message: 1500, instruction: 500, summary: 1200, history: 20 };
// Sign-up form limits: per site, and per visitor network per site per day (dorms share networks).
const SIGNUPS = { perSite: 2000, perVisitorDay: 30 };
// Safety net for legal topics: drop any sentence where the AI tells a student whether a rule
// applies to them or what they must do. Legal topics are only ever flagged to look into.
const LEGAL_CONCLUSION = /\b(you (do not|don't|won't|will not) (need|have)( to)?|(is|are)n't (required|needed)|(is|are) not (required|needed)|not (required|needed) for you|you('re| are) (exempt|fine|good to go|in the clear|all set|covered|legal)|(doesn't|does not|don't|do not|won't|will not) apply to you|(this|that|it|they) (applies|apply) to you|you('re| are) required to|you (must|have to|need to) (register|file|get|obtain|apply|pay|collect|form|buy|incorporate)|you should (register|file|form|incorporate|choose|pick|get an? (llc|license|permit|ein|insurance)))\b/i;
// Chat replies keep their line breaks (bullets), so filter line by line, then sentence by sentence.
function legalSafeChat(text) {
  const out = String(text || "").split("\n").map((line) => legalSafe(line, "")).filter((line, i, all) => line || (all[i - 1] ?? "") !== "").join("\n").trim();
  return out || "I can't tell you whether this applies to you. I can show you what the official source says and help you write down questions for the office or a licensed professional.";
}
function legalSafe(text, fallback = "") {
  const out = String(text || "").split(/(?<=[.!?])\s+/).filter((x) => !LEGAL_CONCLUSION.test(x)).join(" ").trim();
  return out || fallback;
}
const LOOK_DEFAULT = "Look into the official source to see what it says about this for your idea.";

// Sign-up questions may never ask for sensitive information.
const SENSITIVE_Q = /\b(ssn|social security|password|passcode|bank|card number|credit card|debit|routing|account number|birth|birthday|age|address|phone|health|medical|diagnos|religio|immigra|citizen|license number|id number|income|salary)\b/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith("/api/")) return await api(request, env, url);
      if (url.pathname.startsWith("/preview/")) return await preview(env, url);
      if (url.pathname.startsWith("/s/")) return await liveSite(env, url);
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
  if (parts[0] === "states" && method === "GET") {
    return json({ states: Object.fromEntries(Object.entries(STATES).map(([k, v]) => [k, v.name])) });
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

  // POST /api/w/:publicId  -> a visitor joins a student's sign-up list (plain HTML form post)
  if (parts[0] === "w" && parts.length === 2 && method === "POST") return await signup(request, env, url, parts[1]);

  if (parts[0] !== "projects") throw new HttpError(404, "Not found.");

  // POST /api/projects  -> new project + follow-up questions
  if (parts.length === 1 && method === "POST") {
    const { idea, state: stateIn } = await body(request);
    const text = clean(idea, LIMITS.idea);
    if (text.length < 10) throw new HttpError(400, "Tell us a little more about your idea (at least a sentence).");
    const state = String(stateIn || "").toUpperCase();
    if (!STATES[state]) throw new HttpError(400, "Pick the state or territory where you'll run your business.");
    await useQuota(request, env);
    const out = await callAIJson(env, { kind: "followup", ...followUpPrompt(text, state), maxTokens: 1500 });
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
    ).bind(id, now, now, JSON.stringify({ text, title: clean(out.title, 60), types, novelty, state }), JSON.stringify(questions)).run();
    return json({ id, title: clean(out.title, 60), types, novelty, state, questions }, 201);
  }

  const id = parts[1];
  if (!/^[0-9a-f-]{36}$/.test(id || "")) throw new HttpError(404, "Project not found.");
  const project = await loadProject(env, id);

  // GET /api/projects/:id
  if (parts.length === 2 && method === "GET") return json(publicProject(project));

  // DELETE /api/projects/:id  -> deletes the plan, its chats, and its sign-ups for good
  if (parts.length === 2 && method === "DELETE") {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM signups WHERE project_id = ?").bind(id),
      env.DB.prepare("DELETE FROM messages WHERE project_id = ?").bind(id),
      env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(id),
    ]);
    return json({ deleted: true });
  }

  // PATCH /api/projects/:id/app  {on}  -> mark whether the idea needs a real app (adds or removes the launch path)
  if (parts[2] === "app" && parts.length === 3 && method === "PATCH") {
    if (!project.plan) throw new HttpError(400, "Finish your plan first.");
    const { on } = await body(request);
    const types = (project.types || []).filter((t) => t !== "app");
    if (on) types.push("app");
    const steps = legalStepsFor(types, project.state, stateSources(project.state));
    const allowed = new Set(steps.map((st) => st.id));
    const fixedIds = new Set(LEGAL_STEPS.map((st) => st.id));
    const tasks = project.plan.tasks.filter((t) => !fixedIds.has(t.id) || allowed.has(t.id));
    for (const st of steps) {
      if (tasks.some((t) => t.id === st.id)) continue;
      tasks.push({ id: st.id, quadrant: st.quadrant || "legal", title: st.title, why: st.legal ? LOOK_DEFAULT : "Read the official source to learn more.", minutes: st.minutes, sources: st.sources, ...(st.launch ? { launch: st.launch } : {}), ...(st.legal ? { legal: true } : {}), done: false });
    }
    tasks.sort((a, b) => QUADRANTS.indexOf(a.quadrant) - QUADRANTS.indexOf(b.quadrant));
    project.plan.tasks = tasks;
    project.types = types;
    await env.DB.prepare("UPDATE projects SET idea = ?, plan = ?, updated_at = ? WHERE id = ?")
      .bind(JSON.stringify({ text: project.idea, title: project.title, types, novelty: project.novelty, state: project.state }), JSON.stringify(project.plan), new Date().toISOString(), id).run();
    return json(publicProject(project));
  }

  // /api/projects/:id/signups[.csv][/:signupId]  -> the student's sign-up list (private to the plan owner)
  if (parts[2] === "signups" || parts[2] === "signups.csv") {
    if (parts[2] === "signups.csv" && method === "GET") {
      const rows = await signupList(env, id);
      const cell = (v) => {
        let t = String(v ?? "");
        if (/^[=+\-@\t\r]/.test(t)) t = "'" + t; // stop spreadsheet formulas
        return `"${t.replace(/"/g, '""')}"`;
      };
      const csv = ["Name,Email,Answer,Signed up (UTC)", ...rows.map((r) => [r.name, r.email, r.answer, r.created_at].map(cell).join(","))].join("\r\n");
      return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="sign-ups.csv"', "cache-control": "no-store" } });
    }
    if (parts.length === 3 && method === "GET") return json({ signups: await signupList(env, id) });
    if (parts.length === 3 && method === "DELETE") {
      await env.DB.prepare("DELETE FROM signups WHERE project_id = ?").bind(id).run();
      return json({ signups: [] });
    }
    if (parts.length === 4 && method === "DELETE") {
      await env.DB.prepare("DELETE FROM signups WHERE project_id = ? AND id = ?").bind(id, Number(parts[3]) || 0).run();
      return json({ signups: await signupList(env, id) });
    }
    throw new HttpError(405, "Not allowed.");
  }

  // POST /api/projects/:id/plan  (answers -> plan)
  if (parts[2] === "plan" && parts.length === 3 && method === "POST") {
    const { answers = {} } = await body(request);
    const cleanAnswers = {};
    for (const q of project.questions || []) cleanAnswers[q.id] = clean(answers[q.id], LIMITS.answer);
    await useQuota(request, env);
    const out = await callAIJson(env, {
      kind: "plan",
      build: true,
      maxTokens: 8000,
      ...planPrompt(project.idea, project.types, project.questions, cleanAnswers, project.novelty, project.state),
    });
    const plan = normalizePlan(out, project.types, project.state);
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
      const sum = sanitizeSources(clean(out.summary, LIMITS.summary), project.state);
      project.plan.quadrants[q].summary = q === "legal" ? legalSafe(sum, project.plan.quadrants[q].summary) : sum;
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
    // POST /api/projects/:id/tasks/:taskId/guide  -> build the walkthrough once and start the chat
    if (parts[4] === "guide" && parts.length === 5 && method === "POST") {
      if (!task.guide) {
        await useQuota(request, env);
        const out = await callAIJson(env, { kind: "guide", maxTokens: 1500, ...guidePrompt(project, task) });
        const steps = (Array.isArray(out.steps) ? out.steps : []).slice(0, 5).map((st, i) => ({
          id: `s${i + 1}`,
          title: clean(st?.title, 100),
          how: task.legal ? legalSafe(sanitizeSources(clean(st?.how, 400), project.state), "Open the official source for this step and write down the questions it raises for your idea.") : sanitizeSources(clean(st?.how, 400), project.state),
          done: false,
        })).filter((st) => st.title);
        if (!steps.length) throw new AIError("The co-pilot couldn't set up this step. Try again.");
        task.guide = { steps };
        const opening0 = sanitizeSources(clean(out.opening, 800), project.state);
        const opening = task.legal ? legalSafe(opening0, "Let's find what to look into for this step. I can point you to what the official source says, but I can't tell you what applies to you.") : opening0;
        const already = await history(env, id, task.id);
        const stmts = [env.DB.prepare("UPDATE projects SET plan = ?, updated_at = ? WHERE id = ?").bind(JSON.stringify(project.plan), new Date().toISOString(), id)];
        if (opening && !already.length) {
          stmts.push(env.DB.prepare("INSERT INTO messages (project_id, task_id, role, content, created_at) VALUES (?, ?, 'assistant', ?, ?)").bind(id, task.id, opening, new Date().toISOString()));
        }
        await env.DB.batch(stmts);
      }
      return json({ project: publicProject(project), messages: await history(env, id, task.id) });
    }
    // PATCH /api/projects/:id/tasks/:taskId/guide/:stepId  {done}
    if (parts[4] === "guide" && parts.length === 6 && method === "PATCH") {
      const st = task.guide?.steps?.find((x) => x.id === parts[5]);
      if (!st) throw new HttpError(404, "Step not found.");
      const { done } = await body(request);
      st.done = Boolean(done);
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
      // The co-pilot speaks first in a walkthrough, but the API needs the first turn to be the student's.
      if (messages[0].role !== "user") messages.unshift({ role: "user", content: "Walk me through this task." });
      const reply0 = sanitizeSources(
        await callAI(env, { kind: "chat", system: taskChatSystem(project, task), messages, maxTokens: 1000 }),
        project.state
      );
      // On legal topics, strip any sentence that tells the student what applies to them.
      const reply = task.legal ? legalSafeChat(reply0) : reply0;
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
      const zip = makeZip(siteFiles(project.site, { formAction: `${url.origin}/api/w/${project.site.publicId}`, origin: url.origin }));
      const slug = (project.site.businessName || "my-site").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-site";
      return new Response(zip, {
        headers: {
          "content-type": "application/zip",
          "content-disposition": `attachment; filename="${slug}-test-site.zip"`,
        },
      });
    }
    if (!project.plan) throw new HttpError(400, "Finish your plan before building your site.");

    if (parts.length === 3 && method === "POST") {
      await useQuota(request, env);
      const out = await callAIJson(env, { kind: "site", build: true, maxTokens: 5000, ...sitePrompt(project) });
      const site = normalizeSite(out, project.site);
      await saveSite(env, id, site);
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
      await saveSite(env, id, site);
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
    // PATCH /api/projects/:id/site/waitlist  {on, headline, text, question, button}
    if (parts[3] === "waitlist" && method === "PATCH") {
      if (!project.site) throw new HttpError(400, "Build your site first.");
      const b = await body(request);
      const wl = project.site.waitlist || {};
      if ("on" in b) project.site.waitlistOn = Boolean(b.on);
      if ("headline" in b) wl.headline = clean(b.headline, 100);
      if ("text" in b) wl.text = clean(b.text, 300);
      if ("button" in b) wl.button = clean(b.button, 30);
      if ("question" in b) {
        const q = clean(b.question, 120);
        if (q && SENSITIVE_Q.test(q)) throw new HttpError(400, "Pick a question that doesn't ask for personal details like age, address, phone, money, or health.");
        wl.question = q;
      }
      project.site.waitlist = wl;
      if (project.site.waitlistOn !== false && !project.site.pages.contact.email) {
        await save(env, id, { site: project.site });
        throw new HttpError(400, "Saved. Add your contact email above to turn the form on, so visitors can ask to be removed.");
      }
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
  const html = renderPage(project.site, page, (pg) => `/preview/${id}/${pg}`, { preview: true, origin: url.origin });
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

function normalizePlan(out, types = [], state = "NC") {
  // Outside NC, drop any plan sentence that names NC rules: the library only checked NC's.
  const noNC = (t) => (state === "NC" ? t : String(t).split(/(?<=[.!?])\s+/).filter((x) => !/\b(NC|North Carolina)\b/.test(x)).join(" "));
  const sanitize = (t) => noNC(sanitizeSources(t, state));
  const stSources = stateSources(state);
  const quadrants = {};
  for (const q of QUADRANTS) {
    const sum = sanitize(clean(out?.quadrants?.[q]?.summary, LIMITS.summary));
    quadrants[q] = { summary: (q === "legal" ? legalSafe(sum) : sum) || (q === "legal" ? "These are the legal and registration topics to look into for your idea. Each step links to its official source." : "Ask the co-pilot to fill this in.") };
  }
  const tasks = [];
  const counts = {};
  for (const t of out?.tasks || []) {
    if (!["customer", "pricing", "marketing"].includes(t.quadrant)) continue;
    counts[t.quadrant] = (counts[t.quadrant] || 0) + 1;
    if (counts[t.quadrant] > 7) continue;
    tasks.push({
      id: `${t.quadrant}-${counts[t.quadrant]}`,
      quadrant: t.quadrant,
      title: clean(t.title, 120),
      why: sanitize(clean(t.why, 240)),
      basis: clean(t.basis, 80),
      minutes: clampMinutes(t.minutes),
      sources: basisSources(t.basis),
      done: false,
    });
  }
  const legalAI = new Map((out?.legal || []).map((l) => [l.id, l]));
  for (const step of legalStepsFor(types, state, stSources)) {
    const ai = legalAI.get(step.id);
    // Legal topics are always shown: the AI never decides that a legal step doesn't apply.
    if (!step.legal && ai && ai.applies === false) continue;
    const why = sanitize(clean(ai?.why, 240));
    tasks.push({
      id: step.id,
      quadrant: step.quadrant || "legal",
      title: step.title,
      why: step.legal ? legalSafe(why, LOOK_DEFAULT) : why || "Read the official source to learn more.",
      minutes: step.minutes,
      sources: step.sources,
      ...(step.launch ? { launch: step.launch } : {}),
      ...(step.legal ? { legal: true } : {}),
      done: false,
    });
  }
  tasks.sort((a, b) => QUADRANTS.indexOf(a.quadrant) - QUADRANTS.indexOf(b.quadrant));
  const assumptions = (Array.isArray(out?.assumptions) ? out.assumptions : []).slice(0, 5).map((a, i) => ({
    id: `a${i + 1}`,
    text: sanitize(clean(a?.text, 240)),
    test: sanitize(clean(a?.test, 240)),
    status: "untested",
  })).filter((a) => a.text);
  return { quadrants, tasks, assumptions };
}

function normalizeSite(out, previous) {
  const p = out?.pages || {};
  const clean = (v, max) => String(v ?? "").replace(/\u0000/g, "").replace(/\s*\[source:[^\]]*\]/gi, "").trim().slice(0, max);
  const prevContact = previous?.pages?.contact || {};
  const list = (arr, n, map) => (Array.isArray(arr) ? arr.slice(0, n).map(map) : []);
  const w = out?.waitlist || {};
  const prevW = previous?.waitlist || {};
  const q = clean(w.question, 120);
  return {
    publicId: previous?.publicId || crypto.randomUUID().replace(/-/g, "").slice(0, 16),
    waitlistOn: previous ? previous.waitlistOn !== false : true,
    waitlist: {
      headline: clean(w.headline, 100) || prevW.headline || "",
      text: clean(w.text, 300) || prevW.text || "",
      question: q && !SENSITIVE_Q.test(q) ? q : (prevW.question || ""),
      button: clean(w.button, 30) || prevW.button || "Join the waitlist",
    },
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

// Keeps only citations to sources that exist for this project (federal, NC for NC, or this state's offices).
function sanitizeSources(text, state = "NC") {
  const st = stateSources(state);
  return String(text).replace(/\[source:([a-z0-9_]+)\]/gi, (m, sid) => {
    const id = sid.toLowerCase();
    if (st[id]) return `[source:${id}]`;
    if (!SOURCES[id]) return "";
    if (state !== "NC" && /^(nc_|ncdor_|ncsu_|edpnc_)/.test(id)) return "";
    return `[source:${id}]`;
  });
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
  const p = {
    id: row.id,
    idea: idea.text,
    title: idea.title,
    types: idea.types || [],
    novelty: idea.novelty || "common",
    state: STATES[idea.state] ? idea.state : "NC", // plans made before state support were NC-only
    questions: row.questions ? JSON.parse(row.questions) : [],
    answers: row.answers ? JSON.parse(row.answers) : null,
    plan: row.plan ? JSON.parse(row.plan) : null,
    site: row.site ? JSON.parse(row.site) : null,
    createdAt: row.created_at,
  };
  // Plans made earlier get the current fixed-step titles and legal-topic flags (wording only; progress is kept).
  if (p.plan?.tasks) {
    const current = new Map(legalStepsFor(p.types, p.state, stateSources(p.state)).map((st) => [st.id, st]));
    for (const t of p.plan.tasks) {
      const st = current.get(t.id);
      if (!st) continue;
      t.title = st.title;
      if (st.legal) { t.legal = true; t.why = legalSafe(t.why, LOOK_DEFAULT); } else delete t.legal;
    }
    if (p.plan.quadrants?.legal) p.plan.quadrants.legal.summary = legalSafe(p.plan.quadrants.legal.summary, "These are the legal and registration topics to look into for your idea. Each step links to its official source.");
  }
  // Sites made before live links existed get a public id the first time they're opened.
  if (p.site && !p.site.publicId) {
    p.site.publicId = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await saveSite(env, id, p.site);
  }
  return p;
}

function publicProject(p) {
  return { id: p.id, idea: p.idea, title: p.title, types: p.types || [], novelty: p.novelty || "common", state: p.state || "NC", stateName: stateName(p.state || "NC"), stateSources: stateSources(p.state || "NC"), questions: p.questions, answers: p.answers, plan: p.plan, site: p.site };
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

async function saveSite(env, id, site) {
  await env.DB.prepare("UPDATE projects SET site = ?, public_id = ?, updated_at = ? WHERE id = ?")
    .bind(JSON.stringify(site), site.publicId, new Date().toISOString(), id).run();
}

async function signupList(env, projectId) {
  const { results } = await env.DB.prepare("SELECT id, name, email, answer, created_at FROM signups WHERE project_id = ? ORDER BY id DESC").bind(projectId).all();
  return results || [];
}

async function projectByPublicId(env, publicId) {
  if (!/^[0-9a-f]{16}$/.test(publicId || "")) return null;
  const row = await env.DB.prepare("SELECT id FROM projects WHERE public_id = ?").bind(publicId).first();
  return row ? loadProject(env, row.id) : null;
}

// Headers for any student page we serve. Pages never run scripts; forms may only post back to us.
function pageHeaders(extra = {}) {
  return {
    "content-type": "text/html; charset=utf-8",
    "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data: https:; form-action 'self'; frame-ancestors 'self'",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    ...extra,
  };
}

// A visitor submits the sign-up form. Always answers with a page (it's a plain HTML form).
async function signup(request, env, url, publicId) {
  const project = await projectByPublicId(env, publicId);
  if (!project?.site) return new Response("Not found", { status: 404 });
  const site = project.site;
  const href = (pg) => `/s/${publicId}/${pg === "home" ? "" : pg}`;
  // "Back" goes to the page they came from when it's a real web page (the hosted link or their own domain).
  let back = "";
  try {
    const ref = new URL(request.headers.get("referer") || "");
    if (ref.protocol === "https:" || ref.protocol === "http:") back = ref.href;
  } catch { /* no referrer, e.g. a file opened on a computer */ }
  const page = (status, code = 200) => new Response(renderPage(site, "joined", href, { origin: url.origin, joined: { status, back } }), { status: code, headers: pageHeaders({ "cache-control": "no-store" }) });

  if (!waitlistReady(site)) return page("off", 403);
  let form;
  try { form = await request.formData(); } catch { return page("invalid", 400); }
  if (String(form.get("website") || "")) return page("ok"); // honeypot: bots fill hidden fields
  const name = clean(form.get("name"), 80);
  const email = clean(form.get("email"), 120).toLowerCase();
  const answer = site.waitlist?.question ? clean(form.get("answer"), 300) : "";
  if (!name || !/^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(email)) return page("invalid", 400);

  const day = new Date().toISOString().slice(0, 10);
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`qf-w:${ip}:${publicId}`));
  const key = "w:" + [...new Uint8Array(hash)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
  const [v, total] = await env.DB.batch([
    env.DB.prepare("SELECT count FROM usage WHERE key = ? AND day = ?").bind(key, day),
    env.DB.prepare("SELECT COUNT(*) AS n FROM signups WHERE project_id = ?").bind(project.id),
  ]);
  if ((v.results[0]?.count || 0) >= SIGNUPS.perVisitorDay) return page("limit", 429);
  if ((total.results[0]?.n || 0) >= SIGNUPS.perSite) return page("full", 403);
  await env.DB.batch([
    env.DB.prepare("INSERT INTO usage (key, day, count) VALUES (?, ?, 1) ON CONFLICT(key, day) DO UPDATE SET count = count + 1").bind(key, day),
    env.DB.prepare("INSERT INTO signups (project_id, name, email, answer, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(project_id, email) DO UPDATE SET name = excluded.name, answer = excluded.answer")
      .bind(project.id, name, email, answer, new Date().toISOString()),
  ]);
  return page("ok");
}

// The student's live test site at /s/:publicId/:page (safe to share; it never reveals the plan).
async function liveSite(env, url) {
  const [, publicId, pageRaw] = url.pathname.split("/").filter(Boolean);
  const project = await projectByPublicId(env, publicId);
  if (!project?.site) return new Response("Not found", { status: 404, headers: { "content-type": "text/plain" } });
  if (!pageRaw && !url.pathname.endsWith("/")) return Response.redirect(`${url.origin}/s/${publicId}/`, 301);
  const page = PAGES.includes(pageRaw) ? pageRaw : "home";
  const href = (pg) => `/s/${publicId}/${pg === "home" ? "" : pg}`;
  const html = renderPage(project.site, page, href, { formAction: `/api/w/${publicId}`, origin: url.origin });
  return new Response(html, { headers: pageHeaders() });
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
