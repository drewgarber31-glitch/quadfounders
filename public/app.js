// Quad Founders front end. Plain JS modules, hash routing, no build step.

const $ = (id) => document.getElementById(id);
const view = $("view");
const SECTIONS = [
  { id: "customer", name: "Idea and customer" },
  { id: "pricing", name: "Pricing and costs" },
  { id: "marketing", name: "Marketing" },
  { id: "legal", name: "Legal and registration" },
];
const NOVELTY = { new: "Brand-new idea", twist: "New twist", common: "Proven model" };
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
  $("crumbs").innerHTML = crumbs
    .map((c, i) => (i === crumbs.length - 1 ? `<span class="cur">${esc(c.label)}</span>` : `<a href="${c.href}">${esc(c.label)}</a><span class="sep">/</span>`))
    .join("");
  $("topActions").innerHTML = actions;
  view.scrollTop = 0;
  view.focus({ preventScroll: true });
}

function skeleton(crumbs) {
  render(`<div class="page"><div class="skel"><i class="h"></i><i></i><i class="s"></i><i></i><i class="s"></i></div></div>`, { crumbs });
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
    const c = (s) => `${t.filter((x) => x.quadrant === s && x.done).length}/${t.filter((x) => x.quadrant === s).length}`;
    html += `<div class="sb-label">${esc(project.title || "Current plan")}</div>
      <a class="sb-item" href="#/p/${project.id}" ${active === "overview" ? 'aria-current="page"' : ""}>${icons.grid}<span class="grow">Overview</span></a>
      ${SECTIONS.map((s, i) => `<a class="sb-item" href="#/p/${project.id}/s/${s.id}" ${active === s.id ? 'aria-current="page"' : ""}>${icons.quad(i)}<span class="grow">${s.name}</span><span class="count">${c(s.id)}</span></a>`).join("")}
      <a class="sb-item" href="#/p/${project.id}/site" ${active === "site" ? 'aria-current="page"' : ""}>${icons.globe}<span class="grow">Website</span></a>`;
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
  const crumbs = [{ label: "New idea" }];
  const tabs = `<div class="seg" role="tablist">
      <button role="tab" aria-selected="${mode === "idea"}" data-mode="idea">I have an idea</button>
      <button role="tab" aria-selected="${mode === "find"}" data-mode="find">Help me find one</button>
    </div>`;

  if (mode === "idea") {
    render(`<section class="start">
      <div style="display:grid;gap:8px"><h1>What do you want to build?</h1>
      <p class="sub">Describe your idea, even if nothing like it exists yet. You'll get a plan built around it, a co-pilot for every step, and a website.</p></div>
      ${tabs}
      <form id="ideaForm" class="composer-box">
        <label class="label" for="idea" style="position:absolute;left:-9999px">Your idea</label>
        <textarea id="idea" maxlength="2000" required placeholder="Example: An app that matches students who need a ride to the airport over break with others leaving at the same time."></textarea>
        <div class="bar"><p class="help">A sentence is enough. You'll add details next.</p>
          <button class="btn primary" type="submit">Build my plan <kbd>${MOD}↵</kbd></button></div>
      </form>
      <p class="err" id="ideaErr" hidden></p>
      <ul class="points">
        <li>${icons.check}<span>Plans are built around your idea, including ones nobody has tried yet.</span></li>
        <li>${icons.check}<span>Every legal step links to the official source.</span></li>
        <li>${icons.check}<span>AI drafts are labeled. Edit or redo anything.</span></li>
      </ul>
    </section>`, { crumbs });
    const form = $("ideaForm");
    const ta = $("idea");
    ta.focus();
    submitOnModEnter(ta, form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await createProject(ta.value, form.querySelector("button"), $("ideaErr"));
    });
  } else {
    render(`<section class="start">
      <div style="display:grid;gap:8px"><h1>Find an idea worth building</h1>
      <p class="sub">The best ideas start with a problem you've actually run into. Tell us about yours and we'll suggest original directions to test.</p></div>
      ${tabs}
      <form id="findForm" class="form-grid">
        <div><label class="label" for="problems">Problems you've noticed</label>
          <textarea id="problems" class="field" rows="3" maxlength="800" placeholder="Things that annoy you, your friends, or people in your major, club, or job."></textarea></div>
        <div><label class="label" for="skills">Skills and interests</label>
          <textarea id="skills" class="field" rows="2" maxlength="500" placeholder="What you're good at or could talk about for hours."></textarea></div>
        <div class="form-row">
          <div><label class="label" for="major">Major</label><input id="major" class="field" maxlength="120" placeholder="Financial Technology"></div>
          <div><label class="label" for="hours">Hours per week</label>
            <select id="hours" class="field"><option value="">Not sure</option><option>Under 3 hours</option><option>3 to 6 hours</option><option>6 to 10 hours</option><option>10+ hours</option></select></div>
        </div>
        <div><label class="label" for="budget">Money to start</label>
          <select id="budget" class="field"><option value="">Not sure</option><option>$0</option><option>Under $50</option><option>$50 to $200</option><option>$200 to $500</option><option>$500+</option></select></div>
        <div><button class="btn primary lg" type="submit">Suggest ideas</button></div>
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
  const btn = e.target.querySelector("button");
  const err = $("findErr");
  const out = $("ideaResults");
  err.hidden = true;
  btn.disabled = true;
  out.innerHTML = working("Thinking through your problems and skills. About 20 seconds.");
  try {
    const { ideas } = await api("ideas", { method: "POST", body: {
      problems: $("problems").value, skills: $("skills").value, major: $("major").value, hours: $("hours").value, budget: $("budget").value,
    } });
    out.innerHTML = `<div class="ideas">${ideas.map((i, n) => `
      <details class="idea" ${n === 0 ? "open" : ""}>
        <summary><h3>${esc(i.title)}</h3><p>${esc(i.oneLiner)}</p></summary>
        <dl>
          <dt>Problem</dt><dd>${esc(i.problem)}</dd>
          <dt>Who has it</dt><dd>${esc(i.customer)}</dd>
          <dt>What's new</dt><dd>${esc(i.whatsNew)}</dd>
          <dt>Test this week</dt><dd>${esc(i.firstTest)}</dd>
          <dt>Why it fits you</dt><dd>${esc(i.fit)}</dd>
          ${i.watchOut ? `<dt>Watch out</dt><dd><span class="tag warn">Check first</span> ${esc(i.watchOut)}</dd>` : ""}
        </dl>
        <div class="foot"><button class="btn primary" data-idea="${n}">Build a plan for this</button></div>
      </details>`).join("")}</div>
      <p class="help" style="margin-top:12px">AI suggestions. Nothing here is checked against existing businesses, so look for similar ideas before you commit.</p>`;
    out.querySelectorAll("[data-idea]").forEach((b) => b.addEventListener("click", () => {
      const i = ideas[Number(b.dataset.idea)];
      createProject(`${i.title}: ${i.oneLiner} Problem: ${i.problem} Customer: ${i.customer}. What's new: ${i.whatsNew}`, b, err);
    }));
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
      <p class="k">Question ${i + 1} of ${qs.length}</p>
      <form id="qForm" style="display:grid;gap:14px">
        <h1 id="qLabel">${esc(q.text)}</h1>
        <div class="composer-box">
          <textarea id="ans" aria-labelledby="qLabel" maxlength="500" placeholder="${esc(q.hint ? "Example: " + q.hint : "")}">${esc(answers[q.id] || "")}</textarea>
          <div class="bar">
            <div style="display:flex;gap:4px">${i > 0 ? `<button class="btn ghost" type="button" id="prev">Back</button>` : ""}<button class="btn ghost" type="button" id="skip">Skip</button></div>
            <button class="btn primary" type="submit">${i === qs.length - 1 ? "Build my plan" : "Next"} <kbd>${MOD}↵</kbd></button>
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
    render(`<section class="q-step">${working("Building your plan. This takes about 20 seconds.")}</section>`, { crumbs: [{ label: project.title || "New idea" }, { label: "Building plan" }] });
    try {
      refresh(await api(`projects/${id}/plan`, { method: "POST", body: { answers } }));
      location.hash = `#/p/${id}`;
    } catch (e) {
      render(`<section class="q-step"><p class="err">${esc(e.message)}</p><div><button class="btn primary" id="retry">Try again</button></div></section>`);
      $("retry").addEventListener("click", build);
    }
  };
  step();
}

// One plan section: summary card + task rows.
function sectionBlock(s, idx, { showHeader = true } = {}) {
  const tasks = project.plan.tasks.filter((t) => t.quadrant === s.id);
  const done = tasks.filter((t) => t.done).length;
  return `<section class="section" id="sec-${s.id}">
    ${showHeader ? `<div class="section-head">${icons.quad(idx)}<h2><a href="#/p/${project.id}/s/${s.id}" style="text-decoration:none">${s.name}</a></h2><span class="count">${done}/${tasks.length}</span><span class="spacer"></span></div>` : ""}
    <div class="summary" id="sum-${s.id}">
      <p>${esc(project.plan.quadrants[s.id].summary)}</p>
      <div class="row"><span class="tag ai">AI draft</span>
        <div class="acts"><button class="btn ghost" data-edit="${s.id}">Edit</button><button class="btn ghost" data-redo="${s.id}">Redo with feedback</button></div></div>
    </div>
    <div class="list">${tasks.map(taskRow).join("")}</div>
  </section>`;
}

function taskRow(t) {
  return `<div class="rowi ${t.done ? "done" : ""}">
    <button class="status ${t.done ? "on" : ""}" data-toggle="${esc(t.id)}" aria-pressed="${t.done}" aria-label="${t.done ? "Mark not done" : "Mark done"}: ${esc(t.title)}">${t.done ? icons.done : icons.circle}</button>
    <a class="title" href="#/p/${project.id}/t/${esc(t.id)}" style="text-decoration:none">${esc(t.title)}</a>
    ${t.sources?.[0] && SOURCES[t.sources[0]] ? `<span class="tag">${esc(SOURCES[t.sources[0]].org.replace("U.S. Small Business Administration", "SBA").replace("Internal Revenue Service", "IRS").replace("Federal Trade Commission", "FTC").replace("U.S. Patent and Trademark Office", "USPTO"))}</span>` : ""}
    <span class="mins">${t.minutes}m</span>
    <a class="chev" href="#/p/${project.id}/t/${esc(t.id)}" aria-hidden="true" tabindex="-1">${icons.chev}</a>
  </div>`;
}

function wirePlan(rerender) {
  view.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", async () => {
    const task = project.plan.tasks.find((t) => t.id === b.dataset.toggle);
    const next = !task.done;
    task.done = next; // optimistic
    rerender();
    try {
      refresh(await api(`projects/${project.id}/tasks/${task.id}`, { method: "PATCH", body: { done: next } }));
      sidebar(currentActive);
      if (next) toast("Task done");
    } catch (e) { task.done = !next; rerender(); toast(e.message, "error"); }
  }));
  view.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => inlineEdit(b.dataset.edit, "edit", rerender)));
  view.querySelectorAll("[data-redo]").forEach((b) => b.addEventListener("click", () => inlineEdit(b.dataset.redo, "redo", rerender)));
}

function inlineEdit(sec, mode, rerender) {
  const box = $(`sum-${sec}`);
  const val = mode === "edit" ? project.plan.quadrants[sec].summary : "";
  box.innerHTML = `<form style="display:grid;gap:8px">
    <label class="label" for="ed-${sec}" style="margin:0">${mode === "edit" ? "Edit summary" : "What should change?"}</label>
    <textarea id="ed-${sec}" class="field" maxlength="1200" placeholder="${mode === "redo" ? "Example: Focus on graduate students instead of undergrads." : ""}">${esc(val)}</textarea>
    <div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn ghost" type="button">Cancel</button><button class="btn primary" type="submit">${mode === "edit" ? "Save" : "Redo"} <kbd>${MOD}↵</kbd></button></div>
  </form>`;
  const form = box.querySelector("form");
  const ta = box.querySelector("textarea");
  ta.focus();
  submitOnModEnter(ta, form);
  form.querySelector(".ghost").addEventListener("click", rerender);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector(".primary");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> ${mode === "edit" ? "Saving" : "Rewriting"}`;
    try {
      refresh(mode === "edit"
        ? await api(`projects/${project.id}/quadrants/${sec}`, { method: "PATCH", body: { summary: ta.value } })
        : await api(`projects/${project.id}/quadrants/${sec}/regenerate`, { method: "POST", body: { feedback: ta.value } }));
      rerender();
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
  const draw = () => {
    sidebar("overview");
    const t = project.plan.tasks;
    const done = t.filter((x) => x.done).length;
    const pct = Math.round((done / Math.max(t.length, 1)) * 100);
    const assumptions = project.plan.assumptions || [];
    render(`<div class="page">
      <header class="page-head">
        <div class="meta"><span class="tag">${esc(NOVELTY[project.novelty] || "Plan")}</span>${(project.types || []).map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</div>
        <h1>${esc(project.title || "Your plan")}</h1>
        <p class="sub">${esc(project.idea)}</p>
        <div class="progress num"><div class="bar-track"><span style="width:${pct}%"></span></div>${done} of ${t.length} tasks done</div>
      </header>
      ${assumptions.length ? `<section class="section" style="margin-top:8px">
        <div class="section-head">${icons.spark}<h2>What has to be true</h2><span class="count">${assumptions.filter((a) => a.status === "holds").length}/${assumptions.length} confirmed</span></div>
        <div class="list">${assumptions.map((a) => `<div class="assume"><div class="top"><p class="t">${esc(a.text)}</p>
          <select class="field" data-assume="${a.id}" aria-label="Status of: ${esc(a.text)}">
            <option value="untested" ${a.status === "untested" ? "selected" : ""}>Untested</option>
            <option value="holds" ${a.status === "holds" ? "selected" : ""}>Confirmed</option>
            <option value="wrong" ${a.status === "wrong" ? "selected" : ""}>Proven wrong</option>
          </select></div><p class="how">Test: ${esc(a.test)}</p></div>`).join("")}</div>
      </section>` : ""}
      ${SECTIONS.map((s, i) => sectionBlock(s, i)).join("")}
    </div>`, {
      crumbs: [{ label: project.title || "Plan" }],
      actions: `<a class="btn" href="#/p/${id}/site">${icons.globe}${project.site ? "Website" : "Build website"}</a>`,
    });
    wirePlan(draw);
    view.querySelectorAll("[data-assume]").forEach((sel) => sel.addEventListener("change", async () => {
      try {
        refresh(await api(`projects/${id}/assumptions/${sel.dataset.assume}`, { method: "PATCH", body: { status: sel.value } }));
        toast(sel.value === "wrong" ? "Marked wrong. Ask the co-pilot how to adjust." : "Updated");
        if (sel.value === "wrong") draw();
      } catch (e) { toast(e.message, "error"); }
    }));
  };
  draw();
}

async function sectionScreen(id, sec) {
  skeleton([{ label: "Plan" }]);
  try { await load(id); } catch (e) { return errorScreen(e.message); }
  const idx = SECTIONS.findIndex((s) => s.id === sec);
  if (!project.plan || idx < 0) { location.hash = `#/p/${id}`; return; }
  currentActive = sec;
  const draw = () => {
    sidebar(sec);
    render(`<div class="page">
      <header class="page-head"><h1>${SECTIONS[idx].name}</h1></header>
      ${sectionBlock(SECTIONS[idx], idx, { showHeader: false })}
    </div>`, { crumbs: [{ label: project.title || "Plan", href: `#/p/${id}` }, { label: SECTIONS[idx].name }] });
    wirePlan(draw);
  };
  draw();
}

async function taskScreen(id, taskId) {
  skeleton([{ label: "Plan" }]);
  let msgs;
  try {
    await load(id);
    msgs = (await api(`projects/${id}/tasks/${taskId}/messages`)).messages;
  } catch (e) { return errorScreen(e.message); }
  const task = project.plan?.tasks.find((t) => t.id === taskId);
  if (!task) return errorScreen("That task doesn't exist.");
  const sec = SECTIONS.find((s) => s.id === task.quadrant);
  currentActive = task.quadrant;
  sidebar(task.quadrant);

  const draw = () => {
    render(`<div class="page">
      <header class="task-head">
        <div class="meta"><span class="tag num">About ${task.minutes} min</span>${(task.sources || []).map(srcTag).join("")}${task.basis ? `<span class="tag">Based on: ${esc(task.basis)}</span>` : ""}</div>
        <h1>${esc(task.title)}</h1>
        <p class="why">${esc(task.why)}</p>
      </header>
      <div class="thread" id="thread">
        ${msgs.length ? msgs.map((m) => m.role === "user"
          ? `<div class="msg"><span class="avatar">You</span><div><p class="who"><b>You</b></p><div class="body">${esc(m.content).replace(/\n/g, "<br>")}</div></div></div>`
          : `<div class="msg"><span class="avatar ai">QF</span><div><p class="who"><b>Co-pilot</b>AI</p><div class="body">${md(m.content)}</div></div></div>`).join("")
          : `<p class="empty">The co-pilot will walk you through this task step by step. Start by asking it to break the task down, or describe where you're stuck.</p>`}
      </div>
      <form class="reply" id="chatForm">
        <div class="composer-box">
          <label for="msg" style="position:absolute;left:-9999px">Message the co-pilot</label>
          <textarea id="msg" maxlength="1500" placeholder="Break this into steps for me."></textarea>
          <div class="bar"><p class="help">Educational guidance, not legal or tax advice.</p><button class="btn primary" type="submit">Send <kbd>${MOD}↵</kbd></button></div>
        </div>
      </form>
    </div>`, {
      crumbs: [{ label: project.title || "Plan", href: `#/p/${id}` }, { label: sec.name, href: `#/p/${id}/s/${sec.id}` }, { label: task.title }],
      actions: `<button class="btn ${task.done ? "" : "primary"}" id="doneBtn">${task.done ? icons.done + "Done" : icons.check + "Mark done"}</button>`,
    });
    const form = $("chatForm");
    const ta = $("msg");
    submitOnModEnter(ta, form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = ta.value.trim() || "Break this into steps for me.";
      const btn = form.querySelector(".primary");
      btn.disabled = true;
      ta.disabled = true;
      $("thread").insertAdjacentHTML("beforeend", `<div class="msg"><span class="avatar">You</span><div><p class="who"><b>You</b></p><div class="body">${esc(text)}</div></div></div><div class="msg" id="pending"><span class="avatar ai">QF</span><div>${working("Thinking")}</div></div>`);
      view.scrollTop = view.scrollHeight;
      try {
        msgs = (await api(`projects/${id}/tasks/${taskId}/messages`, { method: "POST", body: { message: text } })).messages;
        draw();
        view.scrollTop = view.scrollHeight;
        $("msg").focus();
      } catch (ex) { $("pending")?.remove(); btn.disabled = false; ta.disabled = false; toast(ex.message, "error"); }
    });
    $("doneBtn").addEventListener("click", async () => {
      try {
        refresh(await api(`projects/${id}/tasks/${taskId}`, { method: "PATCH", body: { done: !task.done } }));
        task.done = !task.done;
        sidebar(task.quadrant);
        draw();
        toast(task.done ? "Task done" : "Marked not done");
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
    render(`<div class="page">${working("Writing your website from your plan. About 20 seconds.")}</div>`, { crumbs });
    try { refresh(await api(`projects/${id}/site`, { method: "POST" })); draw(); toast("Website ready"); }
    catch (e) { render(`<div class="page"><p class="err">${esc(e.message)}</p><button class="btn primary" id="retry">Try again</button></div>`, { crumbs }); $("retry").addEventListener("click", generate); }
  };

  const draw = () => {
    if (!project.site) {
      render(`<div class="page"><header class="page-head"><h1>Website</h1>
        <p class="sub">Create a 4-page site (Home, About, Services, Contact) from your plan. Nothing is made up: no fake reviews, licenses, emails, or phone numbers. You can change everything after.</p></header>
        <button class="btn primary lg" id="gen">${icons.globe}Create my website</button></div>`, { crumbs });
      $("gen").addEventListener("click", generate);
      return;
    }
    const c = project.site.pages.contact;
    render(`<div class="page wide">
      <div class="site-grid">
        <div>
          <div class="toolbar">
            <div class="seg" role="tablist" aria-label="Page">${["home", "about", "services", "contact"].map((p) => `<button role="tab" aria-selected="${p === page}" data-page="${p}">${p[0].toUpperCase() + p.slice(1)}</button>`).join("")}</div>
            <div class="seg" aria-label="Device">${["desktop", "phone"].map((d) => `<button aria-pressed="${d === device}" data-device="${d}">${d[0].toUpperCase() + d.slice(1)}</button>`).join("")}</div>
          </div>
          <div class="frame ${device}"><div class="chrome"><i></i><i></i><i></i><span>${esc(project.site.businessName)} / ${page}</span></div>
            <iframe title="Website preview" sandbox src="/preview/${id}/${page}?v=${Date.now()}"></iframe></div>
        </div>
        <aside class="inspector">
          <form class="card" id="editForm">
            <h3>Change something</h3>
            <textarea id="instr" class="field" rows="3" maxlength="500" placeholder="Shorten the home headline and add a team discount service."></textarea>
            <div style="display:flex;justify-content:flex-end"><button class="btn primary" type="submit">Update site <kbd>${MOD}↵</kbd></button></div>
          </form>
          <form class="card" id="contactForm">
            <h3>Contact info</h3>
            <p class="help">Only what you enter here appears on your site.</p>
            <div><label class="label" for="cEmail">Email</label><input id="cEmail" class="field" type="email" maxlength="120" value="${esc(c.email)}" placeholder="hello@yourbusiness.com"></div>
            <div><label class="label" for="cIg">Instagram</label><input id="cIg" class="field" maxlength="40" value="${esc(c.instagram)}" placeholder="yourbusiness"></div>
            <div><label class="label" for="cLoc">Location</label><input id="cLoc" class="field" maxlength="120" value="${esc(c.location)}" placeholder="Elon University campus"></div>
            <div style="display:flex;justify-content:flex-end"><button class="btn" type="submit">Save</button></div>
          </form>
          <div class="card">
            <h3>Publish</h3>
            <p class="help">Download your 4 pages. One-click publishing to your own Cloudflare account is coming next.</p>
            <div style="display:flex;gap:6px;flex-wrap:wrap"><a class="btn" href="/api/projects/${id}/site.zip">${icons.download}Download .zip</a>
            <button class="btn ghost" id="reset">${confirmReset ? "Click again to start over" : "Start over"}</button></div>
          </div>
        </aside>
      </div>
    </div>`, { crumbs, actions: `<a class="btn ghost" href="/preview/${id}/home" target="_blank" rel="noopener">Open preview</a>` });

    view.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => { page = b.dataset.page; draw(); }));
    view.querySelectorAll("[data-device]").forEach((b) => b.addEventListener("click", () => { device = b.dataset.device; draw(); }));
    $("reset").addEventListener("click", () => { if (confirmReset) { confirmReset = false; generate(); } else { confirmReset = true; draw(); } });
    const ef = $("editForm");
    submitOnModEnter($("instr"), ef);
    ef.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = ef.querySelector(".primary");
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> Updating`;
      try { refresh(await api(`projects/${id}/site/edit`, { method: "POST", body: { instruction: $("instr").value } })); draw(); toast("Site updated"); }
      catch (ex) { btn.disabled = false; btn.textContent = "Update site"; toast(ex.message, "error"); }
    });
    $("contactForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        refresh(await api(`projects/${id}/site/contact`, { method: "PATCH", body: { email: $("cEmail").value, instagram: $("cIg").value, location: $("cLoc").value } }));
        page = "contact"; draw(); toast("Contact info saved");
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
