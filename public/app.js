// Quad Founders front end. Plain JS modules, hash routing, no build step.

const $ = (id) => document.getElementById(id);
const view = $("view");
const SECTIONS = [
  { id: "customer", name: "Idea and customer", short: "Customer" },
  { id: "pricing", name: "Pricing and costs", short: "Pricing" },
  { id: "marketing", name: "Marketing", short: "Marketing" },
  { id: "legal", name: "Legal and registration", short: "Legal" },
];
const NOVELTY = { new: "Brand-new idea", twist: "New twist", common: "Proven model" };
const qc = (i) => `--c:var(--q${i})`; // quadrant color as an inline CSS var
const EXAMPLES = [
  "Airport ride matching for students leaving on the same day",
  "Rent-a-fridge for dorms, delivered on move-in day",
  "Lacrosse gear swap between club teams",
  "Custom study playlists made from your syllabus",
];
const BUILD_LINES = ["Reading your answers", "Matching your idea to official guidance", "Drafting your four quadrants", "Writing small tasks that fit between classes", "Listing what has to be true"];
let SOURCES = {};
let project = null; // currently open project

// ---------- utilities ----------
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || "");
const MOD = isMac ? "⌘" : "Ctrl";

const icons = {
  circle: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/></svg>',
  done: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/><path d="M5.5 8.2l1.7 1.7 3.3-3.6"/></svg>',
  check: '<svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg>',
  chev: '<svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4"/></svg>',
  globe: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c1.8 1.7 2.6 3.7 2.6 6S9.8 12.3 8 14M8 2C6.2 3.7 5.4 5.7 5.4 8S6.2 12.3 8 14"/></svg>',
  grid: '<svg viewBox="0 0 16 16"><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/></svg>',
  doc: '<svg viewBox="0 0 16 16"><path d="M4 2.5h5l3 3v8H4z"/><path d="M9 2.5v3h3"/></svg>',
  spark: '<svg viewBox="0 0 16 16"><path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2"/></svg>',
  download: '<svg viewBox="0 0 16 16"><path d="M8 2.5v8M4.5 7L8 10.5 11.5 7M3 13.5h10"/></svg>',
  arrow: '<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
  plus: '<svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg>',
  clock: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1.5"/></svg>',
  edit: '<svg viewBox="0 0 16 16"><path d="M10.5 3l2.5 2.5L6 12.5H3.5V10z"/></svg>',
  redo: '<svg viewBox="0 0 16 16"><path d="M12.5 6.5A5 5 0 103 8.5"/><path d="M12.5 3v3.5H9"/></svg>',
  shieldok: '<svg viewBox="0 0 16 16"><path d="M8 2l5 2v4c0 3-2.2 5.2-5 6-2.8-.8-5-3-5-6V4z"/><path d="M5.8 8l1.6 1.6L10.5 6.5"/></svg>',
  // one icon per quadrant: customer, pricing, marketing, legal
  q: [
    '<svg viewBox="0 0 16 16"><circle cx="6" cy="5.5" r="2.5"/><path d="M1.5 13.5c.5-2.5 2.3-4 4.5-4s4 1.5 4.5 4M10.5 3.2a2.5 2.5 0 010 4.6M12.5 9.8c1.1.6 1.8 1.9 2 3.7"/></svg>',
    '<svg viewBox="0 0 16 16"><path d="M2.5 8.5V3a.5.5 0 01.5-.5h5.5l5 5-6 6z"/><circle cx="5.5" cy="5.5" r="1"/></svg>',
    '<svg viewBox="0 0 16 16"><path d="M2.5 6.5v3h2l5 3v-9l-5 3zM12 5.5a3.5 3.5 0 010 5"/></svg>',
    '<svg viewBox="0 0 16 16"><path d="M8 2l5 2v4c0 3-2.2 5.2-5 6-2.8-.8-5-3-5-6V4z"/></svg>',
  ],
  mark: '<svg class="mark" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7.5" fill="none" stroke-width="3.6" stroke-dasharray="9.78 2" stroke-dashoffset="1"/><path d="M16.5 16.5 21.5 21.5" stroke-width="3.6" stroke-linecap="round"/></svg>',
  quad: (n) => `<svg viewBox="0 0 16 16" style="stroke:none">${["M7 7V1A6 6 0 0 0 1 7Z", "M9 7h6A6 6 0 0 0 9 1Z", "M7 9H1A6 6 0 0 0 7 15Z", "M9 9v6A6 6 0 0 0 15 9Z"].map((d, i) => `<path d="${d}" fill="${i === n ? "var(--accent)" : "currentColor"}" opacity="${i === n ? 1 : .3}"/>`).join("")}</svg>`,
};

const store = {
  list() { try { return JSON.parse(localStorage.getItem("qf.projects") || "[]"); } catch { return []; } },
  add(id, title) {
    try {
      const l = store.list().filter((p) => p.id !== id);
      l.unshift({ id, title });
      localStorage.setItem("qf.projects", JSON.stringify(l.slice(0, 20)));
    } catch { /* storage unavailable: still works this visit */ }
  },
};

async function api(path, opts = {}) {
  const res = await fetch(`/api/${path}`, {
    method: opts.method || "GET",
    headers: opts.body ? { "content-type": "application/json" } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
  return data;
}

function toast(msg, kind = "") {
  const t = document.createElement("div");
  t.className = `toast ${kind}`;
  t.innerHTML = `${kind === "error" ? "" : icons.check}<span>${esc(msg)}</span>`;
  $("toasts").append(t);
  setTimeout(() => t.remove(), kind === "error" ? 5000 : 2600);
}

function render(html, { crumbs = [], actions = "" } = {}) {
  view.innerHTML = html;
  view.firstElementChild?.classList.add("enter");
  $("crumbs").innerHTML = crumbs
    .map((c, i) => (i === crumbs.length - 1 ? `<span class="cur">${esc(c.label)}</span>` : `<a href="${c.href}">${esc(c.label)}</a><span class="sep">/</span>`))
    .join("");
  $("topActions").innerHTML = actions;
  view.scrollTop = 0;
  view.focus({ preventScroll: true });
}

function skeleton(crumbs) {
  render(`<div class="page"><div class="skel"><i class="box"></i><i class="h"></i><i></i><i class="s"></i><i></i><i class="s"></i></div></div>`, { crumbs });
}

function working(text) {
  return `<div class="working"><span class="spinner" aria-hidden="true"></span>${esc(text)}</div>`;
}

function submitOnModEnter(textarea, form) {
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); form.requestSubmit(); }
  });
}

function srcTag(id) {
  const s = SOURCES[id];
  return s ? `<a class="tag src" href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.title)}">${esc(s.org)}</a>` : "";
}

// Safe mini-markdown for co-pilot replies: **bold**, "- " bullets, paragraphs, [source:id] tags.
function md(text) {
  return esc(text).split(/\n{2,}/).map((block) => {
    const lines = block.split("\n");
    const fmt = (s) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\[source:([a-z0-9_]+)\]/gi, (m, id) => " " + srcTag(id));
    if (lines.every((l) => /^\s*[-*] /.test(l))) return `<ul>${lines.map((l) => `<li>${fmt(l.replace(/^\s*[-*] /, ""))}</li>`).join("")}</ul>`;
    return `<p>${lines.map(fmt).join("<br>")}</p>`;
  }).join("");
}

// ---------- sidebar ----------
function sidebar(active) {
  const plans = store.list();
  let html = "";
  if (project?.plan) {
    const t = project.plan.tasks;
    html += `<div class="sb-label">${esc(project.title || "Current plan")}</div>
      <a class="sb-item" href="#/p/${project.id}" ${active === "overview" ? 'aria-current="page"' : ""}>${icons.grid}<span class="grow">Overview</span></a>
      ${SECTIONS.map((s, i) => {
        const all = t.filter((x) => x.quadrant === s.id);
        const done = all.filter((x) => x.done).length;
        const pct = Math.round((done / Math.max(all.length, 1)) * 100);
        return `<a class="sb-item" href="#/p/${project.id}/s/${s.id}" ${active === s.id ? 'aria-current="page"' : ""}><span class="dot" style="background:var(--q${i})"></span><span class="grow">${s.name}</span><span class="mini" title="${done} of ${all.length} done"><i style="width:${pct}%;background:var(--q${i})"></i></span></a>`;
      }).join("")}
      <a class="sb-item" href="#/p/${project.id}/site" ${active === "site" ? 'aria-current="page"' : ""}>${icons.globe}<span class="grow">Website</span>${project.site ? "" : '<span class="count">New</span>'}</a>`;
  }
  const others = plans.filter((p) => p.id !== project?.id);
  if (others.length) {
    html += `<div class="sb-label">Your plans</div>${others.map((p) => `<a class="sb-item" href="#/p/${esc(p.id)}">${icons.doc}<span class="grow">${esc(p.title)}</span></a>`).join("")}`;
  }
  $("sbNav").innerHTML = html;
}

// ---------- screens ----------
function startScreen(mode = "idea") {
  project = null;
  sidebar();
  const tabs = `<div class="seg" role="tablist">
      <button role="tab" aria-selected="${mode === "idea"}" data-mode="idea">I have an idea</button>
      <button role="tab" aria-selected="${mode === "find"}" data-mode="find">Help me find one</button>
    </div>`;

  if (mode === "idea") {
    render(`<section class="start">
      <div class="start-hero">
        <div class="orb">${icons.mark}</div>
        <h1>What do you want to <span class="grad-text">build?</span></h1>
        <p class="sub">Describe your idea, even if nothing like it exists yet. You'll get a plan built around it, a co-pilot for every step, and a website you own.</p>
      </div>
      ${tabs}
      <div style="display:grid;gap:12px">
        <form id="ideaForm" class="composer-box">
          <label class="sr" for="idea">Your idea</label>
          <textarea id="idea" maxlength="2000" required placeholder="Describe it in a sentence or two. What is it, and who is it for?"></textarea>
          <div class="bar"><p class="help">A sentence is enough. You'll add details next.</p>
            <button class="btn primary lg" type="submit">Build my plan <kbd>${MOD}↵</kbd></button></div>
        </form>
        <p class="err" id="ideaErr" hidden></p>
        <div class="chips" aria-label="Example ideas">${EXAMPLES.map((e, i) => `<button class="chip" type="button" data-ex="${i}"><i style="background:var(--q${i})"></i>${esc(e)}</button>`).join("")}</div>
      </div>
      <div class="feature-row">
        <div class="feature"><span class="ic" style="background:var(--q0)">${icons.spark}</span><b>Built for new ideas</b><span>Plans for ideas nobody has tried, starting with what has to be true.</span></div>
        <div class="feature"><span class="ic" style="background:var(--q1)">${icons.shieldok}</span><b>Sources you can check</b><span>Every legal step links to the official government page.</span></div>
        <div class="feature"><span class="ic" style="background:var(--q2)">${icons.clock}</span><b>Fits between classes</b><span>Tasks take 15 to 60 minutes. AI drafts are labeled and editable.</span></div>
      </div>
    </section>`, { crumbs: [{ label: "New idea" }] });
    const form = $("ideaForm");
    const ta = $("idea");
    ta.focus();
    submitOnModEnter(ta, form);
    view.querySelectorAll("[data-ex]").forEach((b) => b.addEventListener("click", () => { ta.value = EXAMPLES[Number(b.dataset.ex)]; ta.focus(); }));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await createProject(ta.value, form.querySelector("button[type=submit]"), $("ideaErr"));
    });
  } else {
    render(`<section class="start">
      <div class="start-hero">
        <div class="orb">${icons.spark}</div>
        <h1>Find an idea <span class="grad-text">worth building</span></h1>
        <p class="sub">The best ideas start with a problem you've actually run into. Tell us about yours and we'll suggest original directions to test.</p>
      </div>
      ${tabs}
      <form id="findForm" class="form-grid panel">
        <div><label class="label" for="problems">Problems you've noticed</label>
          <textarea id="problems" class="field" rows="3" maxlength="800" placeholder="Things that annoy you, your friends, or people in your major, club, or job."></textarea></div>
        <div><label class="label" for="skills">Skills and interests</label>
          <textarea id="skills" class="field" rows="2" maxlength="500" placeholder="What you're good at or could talk about for hours."></textarea></div>
        <div class="form-row">
          <div><label class="label" for="major">Major</label><input id="major" class="field" maxlength="120" placeholder="Example: Marketing"></div>
          <div><label class="label" for="hours">Hours per week</label>
            <select id="hours" class="field"><option value="">Not sure</option><option>Under 3 hours</option><option>3 to 6 hours</option><option>6 to 10 hours</option><option>10+ hours</option></select></div>
        </div>
        <div><label class="label" for="budget">Money to start</label>
          <select id="budget" class="field"><option value="">Not sure</option><option>$0</option><option>Under $50</option><option>$50 to $200</option><option>$200 to $500</option><option>$500+</option></select></div>
        <div><button class="btn primary lg" type="submit">${icons.spark}Suggest ideas</button></div>
        <p class="err" id="findErr" hidden></p>
      </form>
      <div id="ideaResults"></div>
    </section>`, { crumbs: [{ label: "Find an idea" }] });
    $("findForm").addEventListener("submit", findIdeas);
  }
  view.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
    location.hash = b.dataset.mode === "find" ? "#/find" : "#/";
  }));
}

async function createProject(text, btn, errEl) {
  errEl.hidden = true;
  btn.disabled = true;
  const label = btn.innerHTML;
  btn.innerHTML = `<span class="spinner"></span> Reading your idea`;
  try {
    const data = await api("projects", { method: "POST", body: { idea: text } });
    store.add(data.id, data.title || "My idea");
    location.hash = `#/p/${data.id}/questions`;
  } catch (ex) {
    errEl.textContent = ex.message;
    errEl.hidden = false;
    btn.disabled = false;
    btn.innerHTML = label;
  }
}

async function findIdeas(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button[type=submit]");
  const err = $("findErr");
  const out = $("ideaResults");
  err.hidden = true;
  btn.disabled = true;
  out.innerHTML = `<div class="working"><span class="spinner"></span>Thinking through your problems and skills. About 20 seconds.</div>`;
  try {
    const { ideas } = await api("ideas", { method: "POST", body: {
      problems: $("problems").value, skills: $("skills").value, major: $("major").value, hours: $("hours").value, budget: $("budget").value,
    } });
    out.innerHTML = `<div class="ideas">${ideas.map((i, n) => `
      <article class="idea" style="${qc(n % 4)};animation-delay:${n * 0.07}s">
        <div class="hd"><span class="n">IDEA ${String(n + 1).padStart(2, "0")}</span><h3>${esc(i.title)}</h3><p>${esc(i.oneLiner)}</p></div>
        <dl>
          <div><dt>Problem</dt><dd>${esc(i.problem)}</dd></div>
          <div><dt>Who has it</dt><dd>${esc(i.customer)}</dd></div>
          <div><dt>What's new</dt><dd>${esc(i.whatsNew)}</dd></div>
          <div><dt>Test this week</dt><dd>${esc(i.firstTest)}</dd></div>
          <div><dt>Why it fits you</dt><dd>${esc(i.fit)}</dd></div>
          ${i.watchOut ? `<div><dt>Watch out</dt><dd><span class="tag warn">Check first</span> ${esc(i.watchOut)}</dd></div>` : ""}
        </dl>
        <div class="foot"><button class="btn primary" data-idea="${n}">Build a plan for this ${icons.arrow}</button></div>
      </article>`).join("")}</div>
      <p class="help" style="margin-top:14px">AI suggestions. Nothing here is checked against existing businesses, so look for similar ideas before you commit.</p>`;
    out.querySelectorAll("[data-idea]").forEach((b) => b.addEventListener("click", () => {
      const i = ideas[Number(b.dataset.idea)];
      createProject(`${i.title}: ${i.oneLiner} Problem: ${i.problem} Customer: ${i.customer}. What's new: ${i.whatsNew}`, b, err);
    }));
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (ex) {
    out.innerHTML = "";
    err.textContent = ex.message;
    err.hidden = false;
  } finally {
    btn.disabled = false;
  }
}

async function load(id) {
  if (project?.id === id && project.fresh) return project;
  project = await api(`projects/${id}`);
  project.fresh = true;
  store.add(id, project.title || "My idea");
  return project;
}
const refresh = (p) => { project = { ...p, fresh: true }; return project; };

async function questionsScreen(id) {
  skeleton([{ label: "New idea", href: "#/" }, { label: "Questions" }]);
  try { await load(id); } catch (e) { return errorScreen(e.message); }
  if (project.plan) { location.hash = `#/p/${id}`; return; }
  sidebar();
  const qs = project.questions || [];
  const answers = {};
  let i = 0;

  const step = () => {
    if (i >= qs.length) return build();
    const q = qs[i];
    render(`<section class="q-step">
      <div class="steps" aria-hidden="true">${qs.map((_, n) => `<span class="${n <= i ? "on" : ""}"></span>`).join("")}</div>
      <p class="k">QUESTION ${i + 1} OF ${qs.length}</p>
      <form id="qForm" style="display:grid;gap:18px">
        <h1 id="qLabel">${esc(q.text)}</h1>
        <div class="composer-box">
          <textarea id="ans" aria-labelledby="qLabel" maxlength="500" placeholder="${esc(q.hint ? "Example: " + q.hint : "")}">${esc(answers[q.id] || "")}</textarea>
          <div class="bar">
            <div style="display:flex;gap:4px">${i > 0 ? `<button class="btn ghost" type="button" id="prev">Back</button>` : ""}<button class="btn ghost" type="button" id="skip">Skip</button></div>
            <button class="btn primary lg" type="submit">${i === qs.length - 1 ? "Build my plan" : "Next"} <kbd>${MOD}↵</kbd></button>
          </div>
        </div>
      </form>
    </section>`, { crumbs: [{ label: project.title || "New idea", href: "#/" }, { label: "Questions" }] });
    const ta = $("ans");
    const form = $("qForm");
    ta.focus();
    submitOnModEnter(ta, form);
    form.addEventListener("submit", (e) => { e.preventDefault(); answers[q.id] = ta.value; i++; step(); });
    $("skip").addEventListener("click", () => { answers[q.id] = ""; i++; step(); });
    $("prev")?.addEventListener("click", () => { answers[q.id] = ta.value; i--; step(); });
  };

  const build = async () => {
    render(buildingView("Building your plan"), { crumbs: [{ label: project.title || "New idea" }, { label: "Building plan" }] });
    const stop = cycleLines();
    try {
      refresh(await api(`projects/${id}/plan`, { method: "POST", body: { answers } }));
      stop();
      location.hash = `#/p/${id}`;
    } catch (e) {
      stop();
      render(`<section class="q-step"><p class="err">${esc(e.message)}</p><div><button class="btn primary" id="retry">Try again</button></div></section>`);
      $("retry").addEventListener("click", build);
    }
  };
  step();
}

const arcPath = (cx, r, a0, a1) => {
  const pt = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cx + r * Math.sin((a * Math.PI) / 180)].map((n) => n.toFixed(2)).join(" ");
  return `M${pt(a0)}A${r} ${r} 0 0 1 ${pt(a1)}`;
};
const QUARTERS = [0, 1, 2, 3].map((i) => arcPath(60, 46, -90 + i * 90 + 4, -90 + i * 90 + 86));
function buildingView(title) {
  return `<section class="building">
    <div class="ring"><svg viewBox="0 0 120 120" aria-hidden="true">${QUARTERS.map((d, i) => `<path d="${d}" stroke="var(--q${i})"/>`).join("")}</svg></div>
    <div style="display:grid;gap:6px"><h2>${esc(title)}</h2><p class="line" id="buildLine">${BUILD_LINES[0]}</p></div>
    <p class="help">Usually about 20 seconds.</p>
  </section>`;
}
function cycleLines() {
  let n = 0;
  const t = setInterval(() => {
    const el = $("buildLine");
    if (!el) return clearInterval(t);
    n = (n + 1) % BUILD_LINES.length;
    el.textContent = BUILD_LINES[n];
    el.style.animation = "none"; void el.offsetWidth; el.style.animation = "";
  }, 3200);
  return () => clearInterval(t);
}

// Progress ring: one colored arc per quadrant.
function qring(tasks) {
  const R = 70, C = 2 * Math.PI * R, GAP = 7, SEG = C / 4 - GAP;
  const arcs = SECTIONS.map((s, i) => {
    const all = tasks.filter((t) => t.quadrant === s.id);
    const frac = all.filter((t) => t.done).length / Math.max(all.length, 1);
    const rot = -90 + i * 90 + (GAP / C) * 180;
    return `<circle class="track" cx="84" cy="84" r="${R}" fill="none" stroke-dasharray="${SEG} ${C}" transform="rotate(${rot} 84 84)"/>
      <circle class="arc" cx="84" cy="84" r="${R}" fill="none" stroke="var(--q${i})" stroke-dasharray="${SEG} ${C}" stroke-dashoffset="${SEG}" data-to="${SEG * (1 - frac)}" transform="rotate(${rot} 84 84)"/>`;
  }).join("");
  const done = tasks.filter((t) => t.done).length;
  return `<div class="qring"><svg viewBox="0 0 168 168" role="img" aria-label="${done} of ${tasks.length} tasks done">${arcs}</svg>
    <div class="center"><b class="num">${Math.round((done / Math.max(tasks.length, 1)) * 100)}%</b><span class="num">${done} of ${tasks.length} tasks</span></div></div>`;
}
function animateRing() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    view.querySelectorAll(".qring .arc").forEach((a) => a.setAttribute("stroke-dashoffset", a.dataset.to));
  }));
}

// One plan section: summary card + task rows.
function sectionBlock(s, idx, { showHeader = true } = {}) {
  const tasks = project.plan.tasks.filter((t) => t.quadrant === s.id);
  const done = tasks.filter((t) => t.done).length;
  return `<section class="section" id="sec-${s.id}" style="${qc(idx)}">
    ${showHeader ? `<div class="section-head"><span class="ic">${icons.q[idx]}</span><h2><a href="#/p/${project.id}/s/${s.id}">${s.name}</a></h2><span class="count">${done}/${tasks.length}</span><span class="spacer"></span></div>` : ""}
    <div class="summary" id="sum-${s.id}">
      <div class="sum-text">${md(project.plan.quadrants[s.id].summary)}</div>
      <div class="row"><span class="tag ai">AI draft</span>
        <div class="acts"><button class="btn ghost" data-edit="${s.id}">${icons.edit}Edit</button><button class="btn ghost" data-redo="${s.id}">${icons.redo}Redo with feedback</button></div></div>
    </div>
    ${s.id === "legal" ? `<p class="state-note">${icons.shieldok}<span>These steps are written for <b>North Carolina</b>. Federal steps (IRS, FTC, USPTO) apply everywhere. In another state, use your state's official business and tax offices instead of the NC links.</span></p>` : ""}
    <div class="list">${tasks.map(taskRow).join("")}</div>
  </section>`;
}

const SHORT_ORG = { "U.S. Small Business Administration": "SBA", "Internal Revenue Service": "IRS", "Federal Trade Commission": "FTC", "U.S. Patent and Trademark Office": "USPTO", "North Carolina Department of the Secretary of State": "NC Sec. of State", "North Carolina Department of Revenue": "NC Revenue", "North Carolina General Assembly": "NC law", "University of Alaska Fairbanks Center ICE": "NSF I-Corps Hub" };
function taskRow(t) {
  const org = t.sources?.[0] && SOURCES[t.sources[0]]?.org;
  return `<div class="rowi ${t.done ? "done" : ""}">
    <button class="status ${t.done ? "on" : ""}" data-toggle="${esc(t.id)}" aria-pressed="${t.done}" aria-label="${t.done ? "Mark not done" : "Mark done"}: ${esc(t.title)}">${t.done ? icons.done : icons.circle}</button>
    <a class="title" href="#/p/${project.id}/t/${esc(t.id)}" style="text-decoration:none">${esc(t.title)}</a>
    ${org ? `<span class="tag">${esc(SHORT_ORG[org] || org)}</span>` : ""}
    <span class="mins">${t.minutes} min</span>
    <span class="chev" aria-hidden="true">${icons.chev}</span>
  </div>`;
}

function wirePlan(rerender) {
  view.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", async () => {
    const task = project.plan.tasks.find((t) => t.id === b.dataset.toggle);
    const next = !task.done;
    task.done = next; // optimistic
    rerender(true);
    try {
      refresh(await api(`projects/${project.id}/tasks/${task.id}`, { method: "PATCH", body: { done: next } }));
      sidebar(currentActive);
      if (next) toast("Task done. Nice work.");
    } catch (e) { task.done = !next; rerender(true); toast(e.message, "error"); }
  }));
  view.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => inlineEdit(b.dataset.edit, "edit", rerender)));
  view.querySelectorAll("[data-redo]").forEach((b) => b.addEventListener("click", () => inlineEdit(b.dataset.redo, "redo", rerender)));
}

// Re-render without the entrance animation or scroll jump (used after small updates).
function quietRender(html, opts) {
  const top = view.scrollTop;
  render(html, opts);
  view.firstElementChild?.classList.remove("enter");
  view.scrollTop = top;
}

function inlineEdit(sec, mode, rerender) {
  const box = $(`sum-${sec}`);
  const val = mode === "edit" ? project.plan.quadrants[sec].summary : "";
  box.innerHTML = `<form style="display:grid;gap:10px">
    <label class="label" for="ed-${sec}" style="margin:0">${mode === "edit" ? "Edit summary" : "What should change?"}</label>
    <textarea id="ed-${sec}" class="field" maxlength="1200" placeholder="${mode === "redo" ? "Example: Focus on graduate students instead of undergrads." : ""}">${esc(val)}</textarea>
    <div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn ghost" type="button">Cancel</button><button class="btn primary" type="submit">${mode === "edit" ? "Save" : "Redo"} <kbd>${MOD}↵</kbd></button></div>
  </form>`;
  const form = box.querySelector("form");
  const ta = box.querySelector("textarea");
  ta.focus();
  submitOnModEnter(ta, form);
  form.querySelector(".ghost").addEventListener("click", () => rerender(true));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector(".primary");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> ${mode === "edit" ? "Saving" : "Rewriting"}`;
    try {
      refresh(mode === "edit"
        ? await api(`projects/${project.id}/quadrants/${sec}`, { method: "PATCH", body: { summary: ta.value } })
        : await api(`projects/${project.id}/quadrants/${sec}/regenerate`, { method: "POST", body: { feedback: ta.value } }));
      rerender(true);
      toast(mode === "edit" ? "Summary saved" : "Summary rewritten");
    } catch (ex) { btn.disabled = false; btn.textContent = "Try again"; toast(ex.message, "error"); }
  });
}

let currentActive = "";

async function overviewScreen(id) {
  skeleton([{ label: "Plan" }]);
  try { await load(id); } catch (e) { return errorScreen(e.message); }
  if (!project.plan) { location.hash = `#/p/${id}/questions`; return; }
  currentActive = "overview";
  const draw = (quiet) => {
    sidebar("overview");
    const t = project.plan.tasks;
    const assumptions = project.plan.assumptions || [];
    const confirmed = assumptions.filter((a) => a.status === "holds").length;
    const html = `<div class="page">
      <header class="hero-card">
        <div class="info">
          <div class="meta"><span class="tag novelty" title="Based on how you described it. Not checked against existing businesses.">${esc(NOVELTY[project.novelty] || "Plan")}</span>${(project.types || []).map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</div>
          <h1>${esc(project.title || "Your plan")}</h1>
          <p class="sub">${esc(project.idea)}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
            ${nextTaskLink(t)}
            <a class="btn" href="#/p/${id}/site">${icons.globe}${project.site ? "Your website" : "Build website"}</a>
          </div>
        </div>
        ${qring(t)}
      </header>
      <div class="quad-grid">${SECTIONS.map((s, i) => {
        const all = t.filter((x) => x.quadrant === s.id);
        const done = all.filter((x) => x.done).length;
        const next = all.find((x) => !x.done);
        return `<a class="qtile" href="#sec-${s.id}" data-jump="${s.id}" style="${qc(i)}">
          <div class="top"><span class="ic">${icons.q[i]}</span><h3>${s.name}</h3><span class="cnt">${done}/${all.length}</span></div>
          <div class="bar"><i style="width:${Math.round((done / Math.max(all.length, 1)) * 100)}%"></i></div>
          <p class="next">${next ? `<b>Next:</b> ${esc(next.title)}` : "All done here"}</p>
        </a>`;
      }).join("")}</div>
      ${assumptions.length ? `<section class="assume-card">
        <div class="hd"><span class="ic">${icons.spark}</span><div class="grow"><h2>What has to be true</h2><p>Test these before you spend money. Update each one as you learn.</p></div><span class="count">${confirmed}/${assumptions.length} confirmed</span></div>
        ${assumptions.map((a) => `<div class="assume"><div class="t">${md(a.text)}</div>
          <select class="field" data-assume="${a.id}" data-s="${a.status}" aria-label="Status of: ${esc(a.text)}">
            <option value="untested" ${a.status === "untested" ? "selected" : ""}>Untested</option>
            <option value="holds" ${a.status === "holds" ? "selected" : ""}>Confirmed</option>
            <option value="wrong" ${a.status === "wrong" ? "selected" : ""}>Proven wrong</option>
          </select><div class="how"><b>Test</b><span>${md(a.test)}</span></div></div>`).join("")}
      </section>` : ""}
      ${SECTIONS.map((s, i) => sectionBlock(s, i)).join("")}
    </div>`;
    const opts = { crumbs: [{ label: project.title || "Plan" }] };
    quiet ? quietRender(html, opts) : render(html, opts);
    animateRing();
    wirePlan(draw);
    view.querySelectorAll("[data-jump]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); $(`sec-${a.dataset.jump}`).scrollIntoView({ behavior: "smooth" }); }));
    view.querySelectorAll("[data-assume]").forEach((sel) => sel.addEventListener("change", async () => {
      sel.dataset.s = sel.value;
      try {
        refresh(await api(`projects/${id}/assumptions/${sel.dataset.assume}`, { method: "PATCH", body: { status: sel.value } }));
        toast(sel.value === "wrong" ? "Marked wrong. Ask the co-pilot how to adjust." : "Updated");
        draw(true);
      } catch (e) { toast(e.message, "error"); }
    }));
  };
  draw();
}

function nextTaskLink(tasks) {
  const next = tasks.find((x) => !x.done);
  return next ? `<a class="btn primary" href="#/p/${project.id}/t/${esc(next.id)}">Start next task ${icons.arrow}</a>` : `<span class="pill">${icons.check} Every task done</span>`;
}

async function sectionScreen(id, sec) {
  skeleton([{ label: "Plan" }]);
  try { await load(id); } catch (e) { return errorScreen(e.message); }
  const idx = SECTIONS.findIndex((s) => s.id === sec);
  if (!project.plan || idx < 0) { location.hash = `#/p/${id}`; return; }
  currentActive = sec;
  const draw = (quiet) => {
    sidebar(sec);
    const all = project.plan.tasks.filter((x) => x.quadrant === sec);
    const done = all.filter((x) => x.done).length;
    const html = `<div class="page" style="${qc(idx)}">
      <header class="page-head">
        <span class="eyebrow">Quadrant ${idx + 1} of 4 · ${done}/${all.length} done</span>
        <h1>${SECTIONS[idx].name}</h1>
      </header>
      ${sectionBlock(SECTIONS[idx], idx, { showHeader: false })}
    </div>`;
    const opts = { crumbs: [{ label: project.title || "Plan", href: `#/p/${id}` }, { label: SECTIONS[idx].name }] };
    quiet ? quietRender(html, opts) : render(html, opts);
    wirePlan(draw);
  };
  draw();
}

const CHAT_STARTERS = ["Break this into steps for me", "What should I do first?", "What could go wrong?"];
async function taskScreen(id, taskId) {
  skeleton([{ label: "Plan" }]);
  let msgs;
  try {
    await load(id);
    msgs = (await api(`projects/${id}/tasks/${taskId}/messages`)).messages;
  } catch (e) { return errorScreen(e.message); }
  const task = project.plan?.tasks.find((t) => t.id === taskId);
  if (!task) return errorScreen("That task doesn't exist.");
  const idx = SECTIONS.findIndex((s) => s.id === task.quadrant);
  const sec = SECTIONS[idx];
  currentActive = task.quadrant;
  sidebar(task.quadrant);
  const aiAvatar = `<span class="avatar ai">${icons.mark}</span>`;

  const draw = (quiet) => {
    const html = `<div class="page" style="${qc(idx)}">
      <header class="task-head">
        <div class="meta"><span class="qchip">${sec.short}</span><span class="tag num">${icons.clock}About ${task.minutes} min</span>${(task.sources || []).map(srcTag).join("")}${task.basis ? `<span class="tag">Based on: ${esc(task.basis)}</span>` : ""}</div>
        <h1>${esc(task.title)}</h1>
        <div class="why">${md(task.why)}</div>
      </header>
      <div class="thread" id="thread">
        ${msgs.length ? msgs.map((m) => m.role === "user"
          ? `<div class="msg"><span class="avatar">You</span><div><p class="who"><b>You</b></p><div class="bubble">${esc(m.content).replace(/\n/g, "<br>")}</div></div></div>`
          : `<div class="msg ai">${aiAvatar}<div><p class="who"><b>Co-pilot</b><span class="tag ai">AI</span></p><div class="bubble">${md(m.content)}</div></div></div>`).join("")
          : `<div class="empty-chat">${aiAvatar}<h3>Your co-pilot for this task</h3><p>It breaks the task into small steps, cites official sources for any rule, and asks before it assumes.</p>
              <div class="chips">${CHAT_STARTERS.map((c) => `<button class="chip" type="button" data-start="${esc(c)}">${esc(c)}</button>`).join("")}</div></div>`}
      </div>
      <form class="reply" id="chatForm">
        <div class="composer-box">
          <label for="msg" class="sr">Message the co-pilot</label>
          <textarea id="msg" maxlength="1500" placeholder="Ask anything about this task."></textarea>
          <div class="bar"><p class="help">Educational guidance, not legal or tax advice.</p><button class="btn primary" type="submit">Send <kbd>${MOD}↵</kbd></button></div>
        </div>
      </form>
    </div>`;
    const opts = {
      crumbs: [{ label: project.title || "Plan", href: `#/p/${id}` }, { label: sec.name, href: `#/p/${id}/s/${sec.id}` }, { label: task.title }],
      actions: `<button class="btn ${task.done ? "" : "primary"}" id="doneBtn">${task.done ? icons.done + "Done" : icons.check + "Mark done"}</button>`,
    };
    quiet ? quietRender(html, opts) : render(html, opts);
    const form = $("chatForm");
    const ta = $("msg");
    submitOnModEnter(ta, form);
    view.querySelectorAll("[data-start]").forEach((b) => b.addEventListener("click", () => { ta.value = b.dataset.start; form.requestSubmit(); }));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = ta.value.trim() || "Break this into steps for me.";
      const btn = form.querySelector(".primary");
      btn.disabled = true;
      ta.disabled = true;
      view.querySelector(".empty-chat")?.remove();
      $("thread").insertAdjacentHTML("beforeend", `<div class="msg"><span class="avatar">You</span><div><p class="who"><b>You</b></p><div class="bubble">${esc(text)}</div></div></div><div class="msg ai" id="pending">${aiAvatar}<div><p class="who"><b>Co-pilot</b></p><div class="typing" aria-label="Co-pilot is typing"><i></i><i></i><i></i></div></div></div>`);
      view.scrollTop = view.scrollHeight;
      try {
        msgs = (await api(`projects/${id}/tasks/${taskId}/messages`, { method: "POST", body: { message: text } })).messages;
        draw(true);
        view.scrollTop = view.scrollHeight;
        $("msg").focus();
      } catch (ex) { $("pending")?.remove(); btn.disabled = false; ta.disabled = false; toast(ex.message, "error"); }
    });
    $("doneBtn").addEventListener("click", async () => {
      try {
        refresh(await api(`projects/${id}/tasks/${taskId}`, { method: "PATCH", body: { done: !task.done } }));
        task.done = !task.done;
        sidebar(task.quadrant);
        draw(true);
        toast(task.done ? "Task done. Nice work." : "Marked not done");
      } catch (e) { toast(e.message, "error"); }
    });
  };
  draw();
}

async function siteScreen(id) {
  skeleton([{ label: "Website" }]);
  try { await load(id); } catch (e) { return errorScreen(e.message); }
  if (!project.plan) { location.hash = `#/p/${id}/questions`; return; }
  currentActive = "site";
  sidebar("site");
  let page = "home";
  let device = "desktop";
  let confirmReset = false;
  const crumbs = [{ label: project.title || "Plan", href: `#/p/${id}` }, { label: "Website" }];

  const generate = async () => {
    render(buildingView("Designing your website"), { crumbs });
    const stop = cycleLines();
    try { refresh(await api(`projects/${id}/site`, { method: "POST" })); stop(); sidebar("site"); draw(); toast("Website ready"); }
    catch (e) { stop(); render(`<div class="page"><p class="err">${esc(e.message)}</p><button class="btn primary" id="retry">Try again</button></div>`, { crumbs }); $("retry").addEventListener("click", generate); }
  };

  const draw = (quiet) => {
    if (!project.site) {
      render(`<div class="page wide" style="max-width:1040px"><section class="site-empty">
        <div>
          <span class="eyebrow">Website</span>
          <h1 style="margin-top:8px">A real website for <span class="grad-text">${esc(project.title || "your business")}</span></h1>
          <p class="sub">Four pages written from your plan. Preview it, change anything by asking, then download it and publish it to your own account.</p>
          <ul>
            <li>${icons.check}Home, About, Services, and Contact pages</li>
            <li>${icons.check}No made-up reviews, licenses, emails, or phone numbers</li>
            <li>${icons.check}You own the files and the account it lives on</li>
          </ul>
          <button class="btn primary xl" id="gen">${icons.spark}Create my website</button>
        </div>
        <div class="mini-site" aria-hidden="true"><div class="bar"><i></i><i></i><i></i></div>
          <div class="body"><div class="l" style="width:30%"></div><div class="h"></div><div class="l" style="width:85%"></div><div class="l" style="width:65%"></div><div class="b"></div><div class="cards"><i></i><i></i><i></i></div></div></div>
      </section></div>`, { crumbs });
      $("gen").addEventListener("click", generate);
      return;
    }
    const c = project.site.pages.contact;
    const slug = (project.site.businessName || "your-site").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const html = `<div class="page wide">
      <div class="site-grid">
        <div>
          <div class="toolbar">
            <div class="seg" role="tablist" aria-label="Page">${["home", "about", "services", "contact"].map((p) => `<button role="tab" aria-selected="${p === page}" data-page="${p}">${p[0].toUpperCase() + p.slice(1)}</button>`).join("")}</div>
            <div class="seg" aria-label="Device">${["desktop", "phone"].map((d) => `<button aria-pressed="${d === device}" data-device="${d}">${d[0].toUpperCase() + d.slice(1)}</button>`).join("")}</div>
          </div>
          <div class="frame ${device}"><div class="chrome"><i></i><i></i><i></i><span>${esc(slug)}${page === "home" ? "" : "/" + page}</span></div>
            <iframe title="Website preview" sandbox src="/preview/${id}/${page}?v=${Date.now()}"></iframe></div>
        </div>
        <aside class="inspector">
          <form class="card" id="editForm">
            <h3>${icons.spark}Change something</h3>
            <textarea id="instr" class="field" rows="3" maxlength="500" placeholder="Shorten the home headline and add a team discount service."></textarea>
            <div style="display:flex;justify-content:flex-end"><button class="btn primary" type="submit">Update site <kbd>${MOD}↵</kbd></button></div>
          </form>
          <form class="card" id="contactForm">
            <h3>${icons.q[0]}Contact info</h3>
            <p class="help">Only what you enter here appears on your site.</p>
            <div><label class="label" for="cEmail">Email</label><input id="cEmail" class="field" type="email" maxlength="120" value="${esc(c.email)}" placeholder="hello@yourbusiness.com"></div>
            <div><label class="label" for="cIg">Instagram</label><input id="cIg" class="field" maxlength="40" value="${esc(c.instagram)}" placeholder="yourbusiness"></div>
            <div><label class="label" for="cLoc">Location</label><input id="cLoc" class="field" maxlength="120" value="${esc(c.location)}" placeholder="Elon University campus"></div>
            <div style="display:flex;justify-content:flex-end"><button class="btn" type="submit">Save</button></div>
          </form>
          <div class="card">
            <h3>${icons.download}Publish</h3>
            <p class="help">Download your 4 pages. One-click publishing to your own Cloudflare account is coming next.</p>
            <div style="display:flex;gap:6px;flex-wrap:wrap"><a class="btn dark" href="/api/projects/${id}/site.zip">${icons.download}Download .zip</a>
            <button class="btn ghost" id="reset">${confirmReset ? "Click again to start over" : "Start over"}</button></div>
          </div>
        </aside>
      </div>
    </div>`;
    const opts = { crumbs, actions: `<a class="btn" href="/preview/${id}/home" target="_blank" rel="noopener">Open preview ${icons.arrow}</a>` };
    quiet ? quietRender(html, opts) : render(html, opts);

    view.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => { page = b.dataset.page; draw(true); }));
    view.querySelectorAll("[data-device]").forEach((b) => b.addEventListener("click", () => { device = b.dataset.device; draw(true); }));
    $("reset").addEventListener("click", () => { if (confirmReset) { confirmReset = false; generate(); } else { confirmReset = true; draw(true); } });
    const ef = $("editForm");
    submitOnModEnter($("instr"), ef);
    ef.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = ef.querySelector(".primary");
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> Updating`;
      try { refresh(await api(`projects/${id}/site/edit`, { method: "POST", body: { instruction: $("instr").value } })); draw(true); toast("Site updated"); }
      catch (ex) { btn.disabled = false; btn.textContent = "Update site"; toast(ex.message, "error"); }
    });
    $("contactForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        refresh(await api(`projects/${id}/site/contact`, { method: "PATCH", body: { email: $("cEmail").value, instagram: $("cIg").value, location: $("cLoc").value } }));
        page = "contact"; draw(true); toast("Contact info saved");
      } catch (ex) { toast(ex.message, "error"); }
    });
  };
  draw();
}

function errorScreen(msg) {
  render(`<div class="page"><header class="page-head"><h1>Couldn't open that</h1><p class="sub">${esc(msg)}</p></header><a class="btn primary" href="#/">Start a new idea</a></div>`, { crumbs: [{ label: "Error" }] });
}

// ---------- router + chrome ----------
function closeNav() {
  $("shell").classList.remove("nav-open");
  $("menuBtn").setAttribute("aria-expanded", "false");
}
$("menuBtn").addEventListener("click", () => {
  const open = !$("shell").classList.contains("nav-open");
  $("shell").classList.toggle("nav-open", open);
  $("menuBtn").setAttribute("aria-expanded", String(open));
});
$("scrim").addEventListener("click", closeNav);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });

function route() {
  closeNav();
  const h = location.hash.replace(/^#/, "") || "/";
  const U = "([0-9a-f-]{36})";
  let m;
  if ((m = h.match(new RegExp(`^/p/${U}/questions$`)))) return questionsScreen(m[1]);
  if ((m = h.match(new RegExp(`^/p/${U}/s/([a-z]+)$`)))) return sectionScreen(m[1], m[2]);
  if ((m = h.match(new RegExp(`^/p/${U}/t/([a-z0-9-]+)$`)))) return taskScreen(m[1], m[2]);
  if ((m = h.match(new RegExp(`^/p/${U}/site$`)))) return siteScreen(m[1]);
  if ((m = h.match(new RegExp(`^/p/${U}$`)))) return overviewScreen(m[1]);
  if (h === "/find") return startScreen("find");
  return startScreen("idea");
}

(async () => {
  try {
    const [status, src] = await Promise.all([api("status"), api("sources")]);
    SOURCES = src.sources || {};
    $("modeBadge").hidden = !status.testMode;
  } catch { /* still usable */ }
  window.addEventListener("hashchange", route);
  route();
})();
