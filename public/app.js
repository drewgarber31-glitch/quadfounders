// Quad Founders front end. Plain JS modules, hash routing, no build step.

const $ = (id) => document.getElementById(id);
const view = $("view");
const SECTIONS = [
  { id: "customer", name: "Idea and customer", short: "Customer" },
  { id: "pricing", name: "Pricing and costs", short: "Pricing" },
  { id: "marketing", name: "Marketing", short: "Marketing" },
  { id: "legal", name: "Legal topics to look into", short: "Legal" },
];
const NOVELTY = { new: "Brand-new idea", twist: "New twist", common: "Proven model" };
const TYPE_LABEL = { service: "Service", product: "Product", online: "Online store", food: "Home food", digital: "Digital", beauty: "Beauty", invention: "Invention", app: "Needs an app" };
const qc = (i) => `--c:var(--q${i})`; // quadrant color as an inline CSS var
const EXAMPLES = [
  "Airport ride matching for students leaving on the same day",
  "Rent-a-fridge for dorms, delivered on move-in day",
  "Lacrosse gear swap between club teams",
  "Custom study playlists made from your syllabus",
];
const BUILD_LINES = ["Reading your answers", "Matching your idea to official guidance", "Drafting your four quadrants", "Writing small tasks that fit between classes", "Listing what has to be true"];
let SOURCES = {};
let STATE_NAMES = {}; // code -> name, from /api/states
const TERRITORIES = ["DC", "PR", "VI", "GU", "AS", "MP"];
// Library sources plus the open project's state office links (st_reg, st_tax, ...).
const srcOf = (id) => SOURCES[id] || project?.stateSources?.[id];
const lastState = () => { try { return localStorage.getItem("qf.state") || ""; } catch { return ""; } };
function stateSelect(id, required = true) {
  const pick = lastState();
  const opt = (c) => `<option value="${c}" ${c === pick ? "selected" : ""}>${esc(STATE_NAMES[c])}</option>`;
  const codes = Object.keys(STATE_NAMES).sort((a, b) => STATE_NAMES[a].localeCompare(STATE_NAMES[b]));
  return `<select id="${id}" class="field state-select" ${required ? "required" : ""} aria-label="State or territory where you'll run your business">
    <option value="" ${pick ? "" : "selected"} disabled>Where will you run it?</option>
    <optgroup label="States">${codes.filter((c) => !TERRITORIES.includes(c)).map(opt).join("")}</optgroup>
    <optgroup label="DC and U.S. territories">${codes.filter((c) => TERRITORIES.includes(c)).map(opt).join("")}</optgroup>
  </select>`;
}
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
  remove(id) {
    try { localStorage.setItem("qf.projects", JSON.stringify(store.list().filter((p) => p.id !== id))); } catch { /* fine */ }
  },
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

// Sources are shown as plain citations (the web address), never as agency names, logos, or badges.
const domainOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "source"; } };
// "SBA: Choose a business structure" -> "Choose a business structure" (the topic, without the agency name)
const topicOf = (s) => String(s.title || "").replace(/^[^:]{1,60}:\s*/, "");
function srcTag(id) {
  const s = srcOf(id);
  return s ? `<a class="cite" href="${esc(s.url)}" target="_blank" rel="noopener" title="Opens ${esc(domainOf(s.url))} in a new tab">${esc(domainOf(s.url))}<span aria-hidden="true"> ↗</span></a>` : "";
}
const INDEPENDENT = "Quad Founders is an independent student project, not a government service. It isn't affiliated with or endorsed by any agency or organization it links to.";
// The list of sources for one task: topic + web address, plus the independence statement in normal text.
function sourceList(ids = []) {
  const items = ids.map((id) => srcOf(id)).filter(Boolean);
  if (!items.length) return "";
  return `<section class="sources-box"><h3>Sources to read</h3>
    <ul>${items.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(topicOf(s))}</a><span>${esc(domainOf(s.url))}</span></li>`).join("")}</ul>
    <p>${INDEPENDENT}</p></section>`;
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

// ---------- time estimates ----------
// Estimates start as a labeled first guess. When a student marks a step done, we ask how long it
// really took. After 2 answers, every estimate in the plan is scaled to their own pace (median ratio).
const fmtMin = (m) => {
  if (m < 60) return `${Math.max(5, Math.round(m / 5) * 5)} min`;
  const h = Math.round((m / 60) * 2) / 2;
  return `${h} hr${h === 1 ? "" : "s"}`;
};
function pace() {
  const timed = (project?.plan?.tasks || []).filter((t) => t.actual && t.minutes);
  if (timed.length < 2) return null;
  const r = timed.map((t) => t.actual / t.minutes).sort((a, b) => a - b);
  const mid = Math.floor(r.length / 2);
  return { factor: r.length % 2 ? r[mid] : (r[mid - 1] + r[mid]) / 2, n: timed.length };
}
function timeLabel(t, long = false) {
  if (t.done && t.actual) return long ? `Took you ${fmtMin(t.actual)}` : fmtMin(t.actual);
  const p = pace();
  if (p) return long ? `About ${fmtMin(t.minutes * p.factor)} at your pace` : `~${fmtMin(t.minutes * p.factor)}`;
  const lo = fmtMin(t.minutes), hi = fmtMin(t.minutes * 2);
  if (long) return `First guess: ${lo} to ${hi}`;
  return lo.endsWith(" min") && hi.endsWith(" min") ? `${lo.replace(" min", "")}–${hi}` : `${lo}–${hi}`;
}
const timeTitle = () => { const p = pace(); return p ? `Based on how long your last ${p.n} steps took` : "A first guess. Tell us how long steps take and estimates adjust to your pace."; };

// Asks how long a finished step took. Resolves to minutes, or null if skipped.
function askTime(task) {
  return new Promise((resolve) => {
    const opts = [[15, "15 min"], [30, "30 min"], [45, "45 min"], [60, "1 hr"], [90, "1.5 hrs"], [120, "2 hrs"], [180, "3 hrs"], [240, "4+ hrs"]];
    const wrap = document.createElement("div");
    wrap.className = "modal-wrap";
    wrap.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="tq">
      <h2 id="tq">About how long did that take?</h2>
      <p class="help">${esc(task.title)}. Your answers make every time estimate in this plan fit your pace.</p>
      <div class="time-opts">${opts.map(([m, l]) => `<button class="btn" data-m="${m}">${l}</button>`).join("")}</div>
      <div style="display:flex;justify-content:flex-end"><button class="btn ghost" data-m="">Skip</button></div>
    </div>`;
    const done = (v) => { wrap.remove(); document.removeEventListener("keydown", onKey); resolve(v); };
    const onKey = (e) => { if (e.key === "Escape") done(null); };
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-m]");
      if (b) done(b.dataset.m ? Number(b.dataset.m) : null);
      else if (e.target === wrap) done(null);
    });
    document.addEventListener("keydown", onKey);
    document.body.append(wrap);
    wrap.querySelector("[data-m]").focus();
  });
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
      <a class="sb-item" href="#/p/${project.id}/site" ${active === "site" ? 'aria-current="page"' : ""}>${icons.globe}<span class="grow">Test site</span>${project.site ? "" : '<span class="count">New</span>'}</a>`;
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
        <p class="sub">Describe your idea, even if nothing like it exists yet. You'll get a plan built around it, a co-pilot for every step, and a test site that collects sign-ups.</p>
      </div>
      ${tabs}
      <div style="display:grid;gap:12px">
        <form id="ideaForm" class="composer-box">
          <label class="sr" for="idea">Your idea</label>
          <textarea id="idea" maxlength="2000" required placeholder="Describe it in a sentence or two. What is it, and who is it for?"></textarea>
          <div class="bar">${stateSelect("ideaState")}
            <button class="btn primary lg" type="submit">Build my plan <kbd>${MOD}↵</kbd></button></div>
        </form>
        <p class="err" id="ideaErr" hidden></p>
        <div class="chips" aria-label="Example ideas">${EXAMPLES.map((e, i) => `<button class="chip" type="button" data-ex="${i}"><i style="background:var(--q${i})"></i>${esc(e)}</button>`).join("")}</div>
      </div>
      <div class="feature-row">
        <div class="feature"><span class="ic" style="background:var(--q0)">${icons.spark}</span><b>Built for new ideas</b><span>Plans for ideas nobody has tried, starting with what has to be true.</span></div>
        <div class="feature"><span class="ic" style="background:var(--q1)">${icons.shieldok}</span><b>Sources you can check</b><span>Every legal step links to its official source.</span></div>
        <div class="feature"><span class="ic" style="background:var(--q2)">${icons.clock}</span><b>Estimates that learn</b><span>Tell it how long steps really take and time estimates adjust to your pace.</span></div>
      </div>
    </section>`, { crumbs: [{ label: "New idea" }] });
    const form = $("ideaForm");
    const ta = $("idea");
    ta.focus();
    submitOnModEnter(ta, form);
    view.querySelectorAll("[data-ex]").forEach((b) => b.addEventListener("click", () => { ta.value = EXAMPLES[Number(b.dataset.ex)]; ta.focus(); }));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await createProject(ta.value, $("ideaState").value, form.querySelector("button[type=submit]"), $("ideaErr"));
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
        <div class="form-row">
          <div><label class="label" for="budget">Money to start</label>
            <select id="budget" class="field"><option value="">Not sure</option><option>$0</option><option>Under $50</option><option>$50 to $200</option><option>$200 to $500</option><option>$500+</option></select></div>
          <div><label class="label" for="findState">State or territory</label>${stateSelect("findState", false)}</div>
        </div>
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

async function createProject(text, state, btn, errEl) {
  errEl.hidden = true;
  if (!state) { errEl.textContent = "Pick the state or territory where you'll run your business."; errEl.hidden = false; return; }
  try { localStorage.setItem("qf.state", state); } catch { /* fine */ }
  btn.disabled = true;
  const label = btn.innerHTML;
  btn.innerHTML = `<span class="spinner"></span> Reading your idea`;
  try {
    const data = await api("projects", { method: "POST", body: { idea: text, state } });
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
      createProject(`${i.title}: ${i.oneLiner} Problem: ${i.problem} Customer: ${i.customer}. What's new: ${i.whatsNew}`, $("findState").value, b, err);
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

// Legal topics are shown as one fixed list, grouped under plain headings (same for every student).
const LEGAL_GROUPS = ["Every business", "If anyone will help you", "If you're an international student", "If you sell food made at home", "If you offer hair, nail, or beauty services", "If you make or sell products", "If you sell online", "If you build an app or website", "Free help"];
function legalList(tasks) {
  const groups = new Map(LEGAL_GROUPS.map((g) => [g, []]));
  for (const t of tasks) (groups.get(t.group) || groups.get("Free help")).push(t);
  return [...groups].filter(([, list]) => list.length).map(([g, list]) => `<h3 class="lg-h">${esc(g)}</h3><div class="list">${list.map(taskRow).join("")}</div>`).join("");
}

// One plan section: summary card + task rows.
function sectionBlock(s, idx, { showHeader = true } = {}) {
  const tasks = project.plan.tasks.filter((t) => t.quadrant === s.id);
  const done = tasks.filter((t) => t.done).length;
  if (s.id === "legal") {
    return `<section class="section" id="sec-${s.id}" style="${qc(idx)}">
    ${showHeader ? `<div class="section-head"><span class="ic">${icons.q[idx]}</span><h2><a href="#/p/${project.id}/s/${s.id}">${s.name}</a></h2><span class="count">${done}/${tasks.length}</span><span class="spacer"></span></div>` : ""}
    ${stateNote()}
    ${legalList(tasks)}
  </section>`;
  }
  return `<section class="section" id="sec-${s.id}" style="${qc(idx)}">
    ${showHeader ? `<div class="section-head"><span class="ic">${icons.q[idx]}</span><h2><a href="#/p/${project.id}/s/${s.id}">${s.name}</a></h2><span class="count">${done}/${tasks.length}</span><span class="spacer"></span></div>` : ""}
    <div class="summary" id="sum-${s.id}">
      <div class="sum-text">${md(project.plan.quadrants[s.id].summary)}</div>
      <div class="row"><span class="tag ai">AI draft</span>
        <div class="acts"><button class="btn ghost" data-edit="${s.id}">${icons.edit}Edit</button><button class="btn ghost" data-redo="${s.id}">${icons.redo}Redo with feedback</button></div></div>
    </div>
    ${s.id === "legal" ? stateNote() : ""}
    <div class="list">${tasks.map(taskRow).join("")}</div>
  </section>`;
}

// Legal section banner: NC has detailed rules; everywhere else links to the state's official offices.
function stateNote() {
  const code = project.state || "NC";
  const name = project.stateName || code;
  const KIND = { st_reg: "Business registration", st_tax: "State taxes", st_lic: "Licenses and permits", st_help: "Free business help", st_sba: "Small business district office", st_irs: "Federal list of your state's business sites" };
  const links = code === "NC" ? [] : Object.entries(project.stateSources || {});
  return `<div class="state-note">${icons.shieldok}<div><span><b>A fixed list, the same for every student.</b> Quad Founders doesn't pick which topics apply to you or explain the rules, and the co-pilot doesn't cover legal topics. Read each official page, and take questions about your situation to the office listed there or a licensed professional. Your city, county, and campus may have their own rules too. ${INDEPENDENT}</span>
    ${links.length ? `<p class="st-h">Official office directory for ${esc(name)}</p><ul class="st-links">${links.map(([k, l]) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(KIND[k] || topicOf(l))}</a><span>${esc(domainOf(l.url))}</span></li>`).join("")}</ul>` : ""}</div></div>`;
}

function taskRow(t) {
  const n = (t.sources || []).filter((id) => srcOf(id)).length;
  return `<div class="rowi ${t.done ? "done" : ""}">
    <button class="status ${t.done ? "on" : ""}" data-toggle="${esc(t.id)}" aria-pressed="${t.done}" aria-label="${t.done ? "Mark not done" : "Mark done"}: ${esc(t.title)}">${t.done ? icons.done : icons.circle}</button>
    <a class="title" href="#/p/${project.id}/t/${esc(t.id)}" style="text-decoration:none">${esc(t.title)}</a>
    ${n ? `<span class="srcs-n">${n} source${n > 1 ? "s" : ""}</span>` : ""}
    <span class="mins" title="${esc(timeTitle())}">${esc(timeLabel(t))}</span>
    <span class="chev" aria-hidden="true">${icons.chev}</span>
  </div>`;
}

function wirePlan(rerender) {
  view.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", async () => {
    const task = project.plan.tasks.find((t) => t.id === b.dataset.toggle);
    const next = !task.done;
    const actual = next ? await askTime(task) : undefined;
    task.done = next; // optimistic
    rerender(true);
    try {
      refresh(await api(`projects/${project.id}/tasks/${task.id}`, { method: "PATCH", body: { done: next, ...(actual ? { actual } : {}) } }));
      rerender(true); // estimates may now reflect the student's pace
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
  let confirmDelete = false;
  const draw = (quiet) => {
    sidebar("overview");
    const t = project.plan.tasks;
    const assumptions = project.plan.assumptions || [];
    const confirmed = assumptions.filter((a) => a.status === "holds").length;
    const html = `<div class="page">
      <header class="hero-card">
        <div class="info">
          <div class="meta"><span class="tag novelty" title="Based on how you described it. Not checked against existing businesses.">${esc(NOVELTY[project.novelty] || "Plan")}</span>${(project.types || []).map((x) => `<span class="tag">${esc(TYPE_LABEL[x] || x)}</span>`).join("")}</div>
          <h1>${esc(project.title || "Your plan")}</h1>
          <p class="sub">${esc(project.idea)}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
            ${nextTaskLink(t)}
            <a class="btn" href="#/p/${id}/site">${icons.globe}${project.site ? "Your test site" : "Build test site"}</a>
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
      ${launchCard()}
      ${SECTIONS.map((s, i) => sectionBlock(s, i)).join("")}
      <section class="danger">
        <div><h3>Delete this plan</h3><p>Permanently deletes this plan, its co-pilot chats, its test site, and every sign-up. This can't be undone.</p></div>
        <button class="btn danger-btn" id="delPlan">${confirmDelete ? "Click again to delete for good" : "Delete plan"}</button>
      </section>
    </div>`;
    const opts = { crumbs: [{ label: project.title || "Plan" }] };
    quiet ? quietRender(html, opts) : render(html, opts);
    animateRing();
    wirePlan(draw);
    wireLaunch(() => draw(true));
    $("delPlan").addEventListener("click", async () => {
      if (!confirmDelete) { confirmDelete = true; draw(true); return; }
      try {
        await api(`projects/${id}`, { method: "DELETE" });
        store.remove(id);
        project = null;
        toast("Plan deleted");
        location.hash = "#/";
      } catch (e) { toast(e.message, "error"); }
    });
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

// The launch path: for ideas that need a real app, the order to go from test site to a working first version.
function launchCard() {
  const isApp = (project.types || []).includes("app");
  if (!isApp) {
    return `<section class="launch off">
      <div class="hd"><span class="ic">${icons.spark}</span><div class="grow"><h2>Does your idea need a real app?</h2>
        <p>Your test site shows your idea and collects sign-ups. It can't run logins, match people, or take payments. If your idea needs those, add the launch path: business steps to go from test site to a first version.</p></div>
        <button class="btn" data-app="on">${icons.plus}Add launch path</button></div>
    </section>`;
  }
  const t = project.plan.tasks;
  const wait = t.find((x) => x.id === "fixed-waitlist");
  const steps = [...(wait ? [wait] : []), ...t.filter((x) => x.launch).sort((a, b) => a.launch - b.launch)];
  const done = steps.filter((x) => x.done).length;
  return `<section class="launch">
    <div class="hd"><span class="ic">${icons.spark}</span><div class="grow"><h2>Launch path</h2>
      <p>Your idea needs a real app, and Quad Founders doesn't build apps. Your test site proves people want it first. Then follow these steps in order.</p></div>
      <span class="count">${done}/${steps.length} done</span></div>
    <ol class="lp">${steps.map((x, i) => `<li class="${x.done ? "done" : ""}"><span class="n">${x.done ? icons.check : i + 1}</span><a href="#/p/${project.id}/t/${esc(x.id)}">${esc(x.title)}</a><span class="mins" title="${esc(timeTitle())}">${esc(timeLabel(x))}</span></li>`).join("")}</ol>
    <p class="lp-note">Payments, privacy, user accounts, code ownership, and insurance are legal topics, so they're in your <a href="#/p/${project.id}/s/legal">legal topics list</a> under "If you build an app or website".</p>
    <div class="ft"><a class="btn" href="#/p/${project.id}/site">${icons.globe}${project.site ? "Your test site" : "Build your test site"}</a><button class="btn ghost" data-app="off">My idea doesn't need an app</button></div>
  </section>`;
}
function wireLaunch(rerender) {
  view.querySelectorAll("[data-app]").forEach((b) => b.addEventListener("click", async () => {
    b.disabled = true;
    try {
      refresh(await api(`projects/${project.id}/app`, { method: "PATCH", body: { on: b.dataset.app === "on" } }));
      sidebar(currentActive);
      rerender();
      toast(b.dataset.app === "on" ? "Launch path added to your plan" : "Launch path removed");
    } catch (e) { b.disabled = false; toast(e.message, "error"); }
  }));
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

const CHAT_STARTERS = ["I'm stuck", "Explain it more simply", "Give me an example"];
async function taskScreen(id, taskId) {
  skeleton([{ label: "Plan" }]);
  let msgs;
  try {
    await load(id);
    const t0 = project.plan?.tasks.find((t) => t.id === taskId);
    // Legal topics never use the co-pilot, so there are no messages to load.
    msgs = t0?.legal ? [] : (await api(`projects/${id}/tasks/${taskId}/messages`)).messages;
  } catch (e) { return errorScreen(e.message); }
  let task = project.plan?.tasks.find((t) => t.id === taskId);
  if (!task) return errorScreen("That task doesn't exist.");
  const idx = SECTIONS.findIndex((s) => s.id === task.quadrant);
  const sec = SECTIONS[idx];
  currentActive = task.quadrant;
  sidebar(task.quadrant);
  const aiAvatar = `<span class="avatar ai">${icons.mark}</span>`;
  const crumbs = [{ label: project.title || "Plan", href: `#/p/${id}` }, { label: sec.name, href: `#/p/${id}/s/${sec.id}` }, { label: task.title }];
  let guideError = "";

  const head = () => `<header class="task-head">
      <div class="meta"><span class="qchip">${sec.short}</span><span class="tag num" title="${esc(timeTitle())}">${icons.clock}${esc(timeLabel(task, true))}</span>${task.basis ? `<span class="tag">Based on: ${esc(task.basis)}</span>` : ""}</div>
      <h1>${esc(task.title)}</h1>
      <div class="why">${md(task.why)}</div>
      ${sourceList(task.sources)}
      ${task.legal ? `<p class="state-note legal-note">${icons.shieldok}<span><b>Legal topic: something to look into, not advice.</b> This topic and its description are the same for every student. Quad Founders doesn't decide whether it applies to you, and the co-pilot doesn't cover legal topics. Read the official pages above, and take questions about your situation to the office listed there or a licensed professional.</span></p>` : ""}
    </header>`;

  const walkthrough = () => {
    const steps = task.guide?.steps || [];
    if (!steps.length) {
      return guideError
        ? `<section class="guide"><p class="err">${esc(guideError)}</p><button class="btn primary" id="retryGuide">Try again</button></section>`
        : `<section class="guide loading"><div class="g-hd"><span class="avatar ai">${icons.mark}</span><div><b>Setting up your walkthrough</b><p class="help" style="margin:0">Your co-pilot is breaking this step into small pieces for your idea.</p></div></div>
            <div class="skel"><i></i><i class="s"></i><i></i></div></section>`;
    }
    const done = steps.filter((s) => s.done).length;
    const next = steps.findIndex((s) => !s.done);
    return `<section class="guide">
      <div class="g-hd"><div class="grow"><span class="eyebrow">Walkthrough</span><h2>${done === steps.length ? "All sub-steps done" : `Step ${next + 1} of ${steps.length}`}</h2></div>
        <span class="count num">${done}/${steps.length}</span></div>
      <div class="g-bar"><i style="width:${Math.round((done / steps.length) * 100)}%"></i></div>
      <ol class="g-steps">${steps.map((st, i) => `<li class="g-step ${st.done ? "done" : ""} ${i === next ? "cur" : ""}">
          <button class="status ${st.done ? "on" : ""}" data-sub="${st.id}" aria-pressed="${st.done}" aria-label="${st.done ? "Mark not done" : "Mark done"}: ${esc(st.title)}">${st.done ? icons.done : icons.circle}</button>
          <div class="g-body"><p class="g-t"><span class="num">${i + 1}.</span> ${esc(st.title)}${i === next ? ' <span class="tag up">Up next</span>' : ""}</p>
            <div class="g-how">${md(st.how)}</div>
            ${st.done ? "" : `<button class="btn ghost sm" data-help="${i}">${icons.spark}Help me with this</button>`}</div>
        </li>`).join("")}</ol>
      ${done === steps.length && !task.done ? `<div class="g-finish"><span>${icons.check}You finished every sub-step.</span><button class="btn primary" id="finishTask">Mark this task done</button></div>` : ""}
    </section>`;
  };

  const thread = () => msgs.length ? msgs.map((m) => m.role === "user"
      ? `<div class="msg"><span class="avatar">You</span><div><p class="who"><b>You</b></p><div class="bubble">${esc(m.content).replace(/\n/g, "<br>")}</div></div></div>`
      : `<div class="msg ai">${aiAvatar}<div><p class="who"><b>Co-pilot</b><span class="tag ai">AI</span></p><div class="bubble">${md(m.content)}</div></div></div>`).join("")
    : "";

  const legalSteps = () => `<section class="guide">
      <div class="g-hd"><div class="grow"><span class="eyebrow">How to look into it</span><h2>The same three steps for every legal topic</h2></div></div>
      <ol class="g-steps">
        <li class="g-step"><span class="num lnum">1</span><div class="g-body"><p class="g-t">Open each official page above and read it.</p></div></li>
        <li class="g-step"><span class="num lnum">2</span><div class="g-body"><p class="g-t">Write down any questions it raises about your business.</p></div></li>
        <li class="g-step"><span class="num lnum">3</span><div class="g-body"><p class="g-t">Ask the office listed on that page, or a licensed professional, before you decide anything.</p></div></li>
      </ol>
      <p class="help" style="margin:0">When you've looked into it, mark this step done.</p>
    </section>`;

  const draw = (quiet) => {
    if (task.legal) {
      const html = `<div class="page" style="${qc(idx)}">${head()}${legalSteps()}</div>`;
      const opts = { crumbs, actions: `<button class="btn ${task.done ? "" : "primary"}" id="doneBtn">${task.done ? icons.done + "Done" : icons.check + "Mark done"}</button>` };
      quiet ? quietRender(html, opts) : render(html, opts);
      $("doneBtn").addEventListener("click", () => setTaskDone(!task.done));
      return;
    }
    const html = `<div class="page" style="${qc(idx)}">
      ${head()}
      ${walkthrough()}
      <div class="thread" id="thread">${thread()}</div>
      <form class="reply" id="chatForm">
        ${task.guide ? `<div class="chips" style="margin-bottom:10px">${CHAT_STARTERS.map((c) => `<button class="chip" type="button" data-start="${esc(c)}">${esc(c)}</button>`).join("")}</div>` : ""}
        <div class="composer-box">
          <label for="msg" class="sr">Message the co-pilot</label>
          <textarea id="msg" maxlength="1500" placeholder="Answer the co-pilot or ask anything about this step."></textarea>
          <div class="bar"><p class="help">Educational guidance, not legal or tax advice.</p><button class="btn primary" type="submit">Send <kbd>${MOD}↵</kbd></button></div>
        </div>
      </form>
    </div>`;
    const opts = { crumbs, actions: `<button class="btn ${task.done ? "" : "primary"}" id="doneBtn">${task.done ? icons.done + "Done" : icons.check + "Mark done"}</button>` };
    quiet ? quietRender(html, opts) : render(html, opts);
    wire();
  };

  const send = async (text) => {
    const form = $("chatForm");
    const ta = $("msg");
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    ta.disabled = true;
    $("thread").insertAdjacentHTML("beforeend", `<div class="msg"><span class="avatar">You</span><div><p class="who"><b>You</b></p><div class="bubble">${esc(text)}</div></div></div><div class="msg ai" id="pending">${aiAvatar}<div><p class="who"><b>Co-pilot</b></p><div class="typing" aria-label="Co-pilot is typing"><i></i><i></i><i></i></div></div></div>`);
    $("pending").scrollIntoView({ behavior: "smooth", block: "end" });
    try {
      msgs = (await api(`projects/${id}/tasks/${taskId}/messages`, { method: "POST", body: { message: text } })).messages;
      draw(true);
      view.querySelector("#thread .msg:last-child")?.scrollIntoView({ behavior: "smooth", block: "start" });
      $("msg").focus();
    } catch (ex) { $("pending")?.remove(); btn.disabled = false; ta.disabled = false; toast(ex.message, "error"); }
  };

  const setTaskDone = async (val) => {
    const actual = val ? await askTime(task) : undefined;
    try {
      refresh(await api(`projects/${id}/tasks/${taskId}`, { method: "PATCH", body: { done: val, ...(actual ? { actual } : {}) } }));
      task = project.plan.tasks.find((t) => t.id === taskId);
      sidebar(task.quadrant);
      draw(true);
      toast(task.done ? "Task done. Nice work." : "Marked not done");
    } catch (e) { toast(e.message, "error"); }
  };

  function wire() {
    const form = $("chatForm");
    const ta = $("msg");
    submitOnModEnter(ta, form);
    form.addEventListener("submit", (e) => { e.preventDefault(); const t = ta.value.trim(); if (!t) { ta.focus(); return; } send(t); });
    view.querySelectorAll("[data-start]").forEach((b) => b.addEventListener("click", () => send(b.dataset.start)));
    view.querySelectorAll("[data-help]").forEach((b) => b.addEventListener("click", () => {
      const st = task.guide.steps[Number(b.dataset.help)];
      send(`Help me with step ${Number(b.dataset.help) + 1}: ${st.title}`);
    }));
    view.querySelectorAll("[data-sub]").forEach((b) => b.addEventListener("click", async () => {
      const st = task.guide.steps.find((x) => x.id === b.dataset.sub);
      st.done = !st.done; // optimistic
      draw(true);
      try {
        refresh(await api(`projects/${id}/tasks/${taskId}/guide/${st.id}`, { method: "PATCH", body: { done: st.done } }));
        task = project.plan.tasks.find((t) => t.id === taskId);
      } catch (e) { st.done = !st.done; draw(true); toast(e.message, "error"); }
    }));
    $("finishTask")?.addEventListener("click", () => setTaskDone(true));
    $("retryGuide")?.addEventListener("click", startGuide);
    $("doneBtn").addEventListener("click", () => setTaskDone(!task.done));
  }

  // Build the walkthrough the first time this task is opened. The co-pilot speaks first.
  async function startGuide() {
    guideError = "";
    draw(true);
    try {
      const out = await api(`projects/${id}/tasks/${taskId}/guide`, { method: "POST" });
      refresh(out.project);
      task = project.plan.tasks.find((t) => t.id === taskId);
      msgs = out.messages;
      draw(true);
    } catch (e) { guideError = e.message; draw(true); }
  }

  draw();
  if (!task.guide && !task.legal) startGuide();
}

async function siteScreen(id) {
  skeleton([{ label: "Test site" }]);
  try { await load(id); } catch (e) { return errorScreen(e.message); }
  if (!project.plan) { location.hash = `#/p/${id}/questions`; return; }
  currentActive = "site";
  sidebar("site");
  let page = "home";
  let device = "desktop";
  let confirmReset = false;
  const crumbs = [{ label: project.title || "Plan", href: `#/p/${id}` }, { label: "Test site" }];

  const generate = async () => {
    render(buildingView("Designing your test site"), { crumbs });
    const stop = cycleLines();
    try { refresh(await api(`projects/${id}/site`, { method: "POST" })); stop(); sidebar("site"); draw(); loadSignups(); toast("Test site ready"); }
    catch (e) { stop(); render(`<div class="page"><p class="err">${esc(e.message)}</p><button class="btn primary" id="retry">Try again</button></div>`, { crumbs }); $("retry").addEventListener("click", generate); }
  };

  let confirmClear = false;
  let signups = null; // loaded after the page draws

  const liveUrl = () => `${location.origin}/s/${project.site.publicId}/`;
  const formState = () => {
    if (project.site.waitlistOn === false) return ["off", "Off"];
    if (!project.site.pages.contact.email) return ["warn", "Needs your email"];
    return ["on", "On"];
  };

  const drawSignups = () => {
    const box = $("signupBox");
    if (!box) return;
    if (!signups) { box.innerHTML = working("Loading sign-ups"); return; }
    $("signupCount").textContent = String(signups.length);
    box.innerHTML = signups.length ? `
      <div class="su-table" role="table" aria-label="Sign-ups">
        <div class="su-row head" role="row"><span role="columnheader">Name</span><span role="columnheader">Email</span><span role="columnheader">${esc(project.site.waitlist?.question || "Answer")}</span><span role="columnheader">Date</span><span></span></div>
        ${signups.map((r) => `<div class="su-row" role="row"><span role="cell">${esc(r.name)}</span><span role="cell"><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></span><span role="cell">${esc(r.answer || "")}</span><span role="cell" class="mono">${esc(String(r.created_at).slice(0, 10))}</span><span role="cell"><button class="btn ghost sm" data-del="${r.id}" aria-label="Delete ${esc(r.email)}">Delete</button></span></div>`).join("")}
      </div>
      <div class="su-actions"><a class="btn" href="/api/projects/${id}/signups.csv">${icons.download}Download CSV</a><button class="btn ghost" id="clearAll">${confirmClear ? "Click again to delete all" : "Delete all"}</button></div>`
      : `<p class="help">No sign-ups yet. Share your live link in group chats, on Instagram, or on a flyer with a QR code.</p>`;
    box.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", async () => {
      try { signups = (await api(`projects/${id}/signups/${b.dataset.del}`, { method: "DELETE" })).signups; drawSignups(); toast("Sign-up deleted"); }
      catch (e) { toast(e.message, "error"); }
    }));
    $("clearAll")?.addEventListener("click", async () => {
      if (!confirmClear) { confirmClear = true; drawSignups(); return; }
      try { signups = (await api(`projects/${id}/signups`, { method: "DELETE" })).signups; confirmClear = false; drawSignups(); toast("All sign-ups deleted"); }
      catch (e) { toast(e.message, "error"); }
    });
  };
  const loadSignups = async () => {
    try { signups = (await api(`projects/${id}/signups`)).signups; } catch { signups = []; }
    drawSignups();
  };

  const draw = (quiet) => {
    if (!project.site) {
      render(`<div class="page wide" style="max-width:1040px"><section class="site-empty">
        <div>
          <span class="eyebrow">Test site</span>
          <h1 style="margin-top:8px">A test site for <span class="grad-text">${esc(project.title || "your business")}</span></h1>
          <p class="sub">Four pages written from your plan, with a sign-up form so you can find out if people actually want this before you build more. Share the live link, or download the files and host them yourself.</p>
          <ul>
            <li>${icons.check}Home, About, Services, and Contact pages</li>
            <li>${icons.check}A sign-up form that collects names and emails, with a live link to share</li>
            <li>${icons.check}No made-up reviews, licenses, emails, or phone numbers</li>
            <li class="no">${icons.circle}It can't run logins, match people, or take payments${(project.types || []).includes("app") ? ". Your launch path covers those." : ""}</li>
          </ul>
          <button class="btn primary xl" id="gen">${icons.spark}Create my test site</button>
        </div>
        <div class="mini-site" aria-hidden="true"><div class="bar"><i></i><i></i><i></i></div>
          <div class="body"><div class="l" style="width:30%"></div><div class="h"></div><div class="l" style="width:85%"></div><div class="l" style="width:65%"></div><div class="b"></div><div class="cards"><i></i><i></i><i></i></div></div></div>
      </section></div>`, { crumbs });
      $("gen").addEventListener("click", generate);
      return;
    }
    const c = project.site.pages.contact;
    const wl = project.site.waitlist || {};
    const [fs, fsLabel] = formState();
    const isApp = (project.types || []).includes("app");
    const html = `<div class="page wide">
      <div class="site-grid">
        <div>
          <div class="toolbar">
            <div class="seg" role="tablist" aria-label="Page">${["home", "about", "services", "contact"].map((p) => `<button role="tab" aria-selected="${p === page}" data-page="${p}">${p[0].toUpperCase() + p.slice(1)}</button>`).join("")}</div>
            <div class="seg" aria-label="Device">${["desktop", "phone"].map((d) => `<button aria-pressed="${d === device}" data-device="${d}">${d[0].toUpperCase() + d.slice(1)}</button>`).join("")}</div>
          </div>
          <div class="frame ${device}"><div class="chrome"><i></i><i></i><i></i><span>${esc(location.host)}/s/${esc(project.site.publicId)}${page === "home" ? "" : "/" + page}</span></div>
            <iframe title="Test site preview" sandbox src="/preview/${id}/${page}?v=${Date.now()}"></iframe></div>
          <p class="help" style="margin-top:8px">This is a preview, so the sign-up button is turned off here. It works on your live link and in your downloaded files.</p>
          <section class="card su-card">
            <div class="su-hd"><h3>${icons.q[0]}Sign-ups <span class="count" id="signupCount">${signups ? signups.length : "…"}</span></h3></div>
            <p class="help">Only people with this plan's link can see these. Before you email anyone, look into the email rules in your <a href="#/p/${id}/t/fixed-email">email marketing step</a>. The form tells visitors they can ask you to remove them.</p>
            <div id="signupBox"></div>
          </section>
        </div>
        <aside class="inspector">
          <div class="card">
            <h3>${icons.globe}Your live link</h3>
            <p class="help">Share this link to collect sign-ups. It shows only your test site, never your plan.</p>
            <div class="linkbox"><input class="field mono" id="liveUrl" readonly value="${esc(liveUrl())}" aria-label="Your live link"><button class="btn" id="copyLink">Copy</button></div>
            <a class="btn ghost" href="${esc(liveUrl())}" target="_blank" rel="noopener">Open live site ${icons.arrow}</a>
          </div>
          <form class="card" id="formCard">
            <h3>${icons.doc}Sign-up form <span class="state ${fs}">${fsLabel}</span></h3>
            <p class="help">${fs === "warn" ? "Add your contact email below to turn the form on. Visitors need a way to ask to be removed." : "Visitors leave their name, email, and an optional answer. The form never asks for anything sensitive."}</p>
            <div><label class="label" for="wlQ">Question for visitors (optional)</label><input id="wlQ" class="field" maxlength="120" value="${esc(wl.question)}" placeholder="Example: When do you usually fly home?"></div>
            <div><label class="label" for="wlBtn">Button text</label><input id="wlBtn" class="field" maxlength="30" value="${esc(wl.button || "Join the waitlist")}"></div>
            <div style="display:flex;gap:6px;justify-content:space-between;flex-wrap:wrap">
              <button class="btn ghost" type="button" id="wlToggle">${project.site.waitlistOn === false ? "Turn form on" : "Turn form off"}</button>
              <button class="btn" type="submit">Save</button></div>
          </form>
          <form class="card" id="contactForm">
            <h3>${icons.q[0]}Contact info</h3>
            <p class="help">Only what you enter here appears on your site. Your email is required for the sign-up form.</p>
            <div><label class="label" for="cEmail">Email</label><input id="cEmail" class="field" type="email" maxlength="120" value="${esc(c.email)}" placeholder="hello@yourbusiness.com"></div>
            <div><label class="label" for="cIg">Instagram</label><input id="cIg" class="field" maxlength="40" value="${esc(c.instagram)}" placeholder="yourbusiness"></div>
            <div><label class="label" for="cLoc">Location</label><input id="cLoc" class="field" maxlength="120" value="${esc(c.location)}" placeholder="Elon University campus"></div>
            <div style="display:flex;justify-content:flex-end"><button class="btn" type="submit">Save</button></div>
          </form>
          <form class="card" id="editForm">
            <h3>${icons.spark}Change something</h3>
            <textarea id="instr" class="field" rows="3" maxlength="500" placeholder="Shorten the home headline and add a team discount service."></textarea>
            <div style="display:flex;justify-content:flex-end"><button class="btn primary" type="submit">Update site <kbd>${MOD}↵</kbd></button></div>
          </form>
          <div class="card">
            <h3>${icons.shieldok}What a test site can do</h3>
            <ul class="cando">
              <li class="yes">${icons.check}Show your idea, services, and contact info</li>
              <li class="yes">${icons.check}Collect sign-ups to measure interest</li>
              <li class="yes">${icons.check}Share with a link or host the files yourself</li>
              <li class="no">${icons.circle}Logins, matching people, payments, or bookings</li>
            </ul>
            ${isApp
              ? `<p class="help">Your idea needs a real app. Follow your <a href="#/p/${id}">launch path</a> to get there.</p>`
              : `<p class="help">Does your idea need those? Add the launch path to your plan.</p><button class="btn" type="button" data-app="on">${icons.plus}Add launch path</button>`}
          </div>
          <div class="card">
            <h3>${icons.download}Download files</h3>
            <p class="help">Host your 4 pages on your own account or domain. The sign-up form still sends sign-ups here.</p>
            <div style="display:flex;gap:6px;flex-wrap:wrap"><a class="btn dark" href="/api/projects/${id}/site.zip">${icons.download}Download .zip</a>
            <button class="btn ghost" id="reset">${confirmReset ? "Click again to start over" : "Start over"}</button></div>
          </div>
        </aside>
      </div>
    </div>`;
    const opts = { crumbs, actions: `<a class="btn" href="${esc(liveUrl())}" target="_blank" rel="noopener">Open live site ${icons.arrow}</a>` };
    quiet ? quietRender(html, opts) : render(html, opts);
    drawSignups();

    view.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => { page = b.dataset.page; draw(true); }));
    view.querySelectorAll("[data-device]").forEach((b) => b.addEventListener("click", () => { device = b.dataset.device; draw(true); }));
    $("reset").addEventListener("click", () => { if (confirmReset) { confirmReset = false; generate(); } else { confirmReset = true; draw(true); } });
    $("copyLink").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(liveUrl()); toast("Link copied"); }
      catch { $("liveUrl").select(); toast("Press Ctrl+C to copy"); }
    });
    wireLaunch(() => draw(true));
    const saveForm = async (bodyIn, msg) => {
      try { refresh(await api(`projects/${id}/site/waitlist`, { method: "PATCH", body: bodyIn })); draw(true); toast(msg); }
      catch (ex) { project.fresh = false; await load(id).catch(() => {}); draw(true); toast(ex.message, "error"); }
    };
    $("formCard").addEventListener("submit", (e) => { e.preventDefault(); saveForm({ question: $("wlQ").value, button: $("wlBtn").value }, "Sign-up form saved"); });
    $("wlToggle").addEventListener("click", () => saveForm({ on: project.site.waitlistOn === false }, project.site.waitlistOn === false ? "Sign-up form on" : "Sign-up form off"));
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
  if (project.site) loadSignups();
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
    const [status, src, st] = await Promise.all([api("status"), api("sources"), api("states")]);
    SOURCES = src.sources || {};
    STATE_NAMES = st.states || {};
    $("modeBadge").hidden = !status.testMode;
  } catch { /* still usable */ }
  window.addEventListener("hashchange", route);
  route();
})();
