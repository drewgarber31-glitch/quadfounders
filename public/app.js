// Quad Founders front end. Plain JS, hash routing, no build step.
const $main = document.getElementById("main");
const QUAD = {
  customer: "Idea and customer",
  pricing: "Pricing and costs",
  marketing: "Marketing and first customers",
  legal: "Legal and registration",
};
let SOURCES = {};

// ---------- tiny helpers ----------
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = {
  get() { try { return JSON.parse(localStorage.getItem("qf.projects") || "[]"); } catch { return []; } },
  add(id, title) {
    try {
      const list = store.get().filter((p) => p.id !== id);
      list.unshift({ id, title, at: Date.now() });
      localStorage.setItem("qf.projects", JSON.stringify(list.slice(0, 20)));
    } catch { /* storage unavailable: app still works for this visit */ }
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

function view(html) {
  $main.innerHTML = html;
  $main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}
function loading(text) { view(`<div class="loading" role="status">${esc(text)}</div>`); }
function errorView(msg) {
  view(`<div class="stack"><h2>That didn't work</h2><p class="err">${esc(msg)}</p><p><a class="btn" href="#/">Start over</a></p></div>`);
}

// Safe mini-markdown for co-pilot replies: **bold**, "- " bullets, paragraphs, [source:id] chips.
function renderReply(text) {
  const blocks = esc(text).split(/\n{2,}/);
  return blocks.map((b) => {
    const lines = b.split("\n");
    const fmt = (s) => s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[source:([a-z0-9_]+)\]/gi, (m, id) => SOURCES[id]
        ? ` <a class="chip" href="${esc(SOURCES[id].url)}" target="_blank" rel="noopener">${esc(SOURCES[id].org)}</a>`
        : "");
    if (lines.every((l) => /^\s*[-*] /.test(l))) {
      return `<ul>${lines.map((l) => `<li>${fmt(l.replace(/^\s*[-*] /, ""))}</li>`).join("")}</ul>`;
    }
    return `<p>${lines.map(fmt).join("<br>")}</p>`;
  }).join("");
}

function sourceChips(ids = []) {
  return ids.filter((id) => SOURCES[id]).map((id) =>
    `<a class="chip" href="${esc(SOURCES[id].url)}" target="_blank" rel="noopener" title="${esc(SOURCES[id].summary)}">${esc(SOURCES[id].title)}</a>`
  ).join("");
}

// ---------- screens ----------

function homeScreen() {
  view(`
  <section class="home">
    <h1>Start your business between classes.</h1>
    <p class="lead">Tell us your idea. Get a step-by-step plan, a co-pilot for every task, and your own website, all in one place.</p>
    <form class="idea-box" id="ideaForm">
      <label class="lbl" for="idea">What's your idea?</label>
      <textarea id="idea" class="field" maxlength="2000" required
        placeholder="Example: I want to clean sneakers for students in my dorm and on my club team."></textarea>
      <p class="hint">A sentence is enough. You can add details next.</p>
      <div class="row"><button class="btn" type="submit">Build my plan</button></div>
      <p class="err" id="ideaErr" role="alert" hidden></p>
    </form>
    <ul class="promises">
      <li>Every legal and registration step links to the official government source.</li>
      <li>AI drafts are labeled, and you can edit or redo anything.</li>
      <li>Your website, your domain, your account.</li>
    </ul>
  </section>`);
  const form = document.getElementById("ideaForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const err = document.getElementById("ideaErr");
    err.hidden = true;
    btn.disabled = true;
    btn.textContent = "Reading your idea…";
    try {
      const data = await api("projects", { method: "POST", body: { idea: document.getElementById("idea").value } });
      store.add(data.id, data.title || "My idea");
      sessionStorage.setItem(`qf.q.${data.id}`, JSON.stringify(data.questions));
      location.hash = `#/p/${data.id}/questions`;
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
      btn.disabled = false;
      btn.textContent = "Build my plan";
    }
  });
}

async function questionsScreen(id) {
  loading("Loading your questions…");
  let project;
  try { project = await api(`projects/${id}`); } catch (e) { return errorView(e.message); }
  if (project.plan) { location.hash = `#/p/${id}`; return; }
  const qs = project.questions || [];
  const answers = {};
  let i = 0;

  const show = () => {
    if (i >= qs.length) return buildPlan();
    const q = qs[i];
    view(`
    <section class="qwrap">
      <div class="progress" aria-hidden="true"><span style="width:${Math.round((i / qs.length) * 100)}%"></span></div>
      <p class="count">Question ${i + 1} of ${qs.length}</p>
      <form id="qForm" class="stack">
        <label class="lbl" for="ans"><h2>${esc(q.text)}</h2></label>
        <textarea id="ans" class="field" maxlength="500" placeholder="${esc(q.hint ? "Example: " + q.hint : "")}">${esc(answers[q.id] || "")}</textarea>
        <div class="row">
          <button class="btn" type="submit">${i === qs.length - 1 ? "Build my plan" : "Next"}</button>
          <button class="linkbtn" type="button" id="skip">Skip</button>
          ${i > 0 ? `<button class="linkbtn" type="button" id="prev">Back</button>` : ""}
        </div>
      </form>
    </section>`);
    const ans = document.getElementById("ans");
    ans.focus();
    document.getElementById("qForm").addEventListener("submit", (e) => { e.preventDefault(); answers[q.id] = ans.value; i++; show(); });
    document.getElementById("skip").addEventListener("click", () => { answers[q.id] = ""; i++; show(); });
    document.getElementById("prev")?.addEventListener("click", () => { answers[q.id] = ans.value; i--; show(); });
  };

  const buildPlan = async () => {
    loading("Building your plan. This takes about 20 seconds…");
    try {
      await api(`projects/${id}/plan`, { method: "POST", body: { answers } });
      location.hash = `#/p/${id}`;
    } catch (e) {
      view(`<div class="stack"><p class="err">${esc(e.message)}</p><p><button class="btn" id="retry">Try again</button></p></div>`);
      document.getElementById("retry").addEventListener("click", buildPlan);
    }
  };
  show();
}

async function planScreen(id) {
  loading("Opening your plan…");
  let p;
  try { p = await api(`projects/${id}`); } catch (e) { return errorView(e.message); }
  if (!p.plan) { location.hash = `#/p/${id}/questions`; return; }
  store.add(id, p.title || "My idea");
  const render = () => {
    const done = p.plan.tasks.filter((t) => t.done).length;
    const total = p.plan.tasks.length;
    view(`
    <section>
      <div class="plan-head">
        <h1>${esc(p.title || "Your plan")}</h1>
        <p class="hint">${esc(p.idea)}</p>
        <div class="progress" aria-hidden="true"><span style="width:${Math.round((done / Math.max(total, 1)) * 100)}%"></span></div>
        <p class="count">${done} of ${total} tasks done</p>
      </div>
      <div class="quad">
        ${Object.keys(QUAD).map((q, n) => cell(q, n)).join("")}
      </div>
      <div class="next-step">
        <h3>${p.site ? "Your website" : "Ready for a website?"}</h3>
        <p>${p.site ? "Preview it, change anything, and download it." : "Build a 4-page site for your business from your plan. You can edit everything."}</p>
        <p><a class="btn" href="#/p/${id}/site">${p.site ? "Open my website" : "Build my website"}</a></p>
      </div>
    </section>`);
    wire();
  };

  const cell = (q, n) => {
    const tasks = p.plan.tasks.filter((t) => t.quadrant === q);
    return `
    <article class="cell" id="cell-${q}">
      <header><h3>${QUAD[q]}</h3><span class="pos" aria-hidden="true">${n + 1}/4</span></header>
      <span class="ai-tag">AI draft</span>
      <p class="summary" id="sum-${q}">${esc(p.plan.quadrants[q].summary)}</p>
      <div class="cell-actions">
        <button class="linkbtn" data-edit="${q}">Edit</button>
        <button class="linkbtn" data-regen="${q}">Redo with feedback</button>
      </div>
      <ul class="tasks">
        ${tasks.map((t) => `
        <li class="task${t.done ? " done" : ""}">
          <input type="checkbox" data-done="${esc(t.id)}" ${t.done ? "checked" : ""} aria-label="Mark ${esc(t.title)} done">
          <a href="#/p/${id}/task/${esc(t.id)}"><span class="t">${esc(t.title)}</span><span class="mins">About ${t.minutes} min${t.quadrant === "legal" && t.sources?.length ? " · official source" : ""}</span></a>
        </li>`).join("")}
      </ul>
    </article>`;
  };

  const wire = () => {
    $main.querySelectorAll("[data-done]").forEach((box) => box.addEventListener("change", async () => {
      box.disabled = true;
      try { p = await api(`projects/${id}/tasks/${box.dataset.done}`, { method: "PATCH", body: { done: box.checked } }); render(); }
      catch (e) { box.checked = !box.checked; box.disabled = false; alert(e.message); }
    }));
    $main.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => editCell(b.dataset.edit)));
    $main.querySelectorAll("[data-regen]").forEach((b) => b.addEventListener("click", () => regenCell(b.dataset.regen)));
  };

  const inlineForm = (q, label, value, button, onSave) => {
    const sum = document.getElementById(`sum-${q}`);
    const form = document.createElement("form");
    form.className = "stack";
    form.innerHTML = `<label class="lbl" for="f-${q}">${label}</label>
      <textarea id="f-${q}" class="field" maxlength="1200">${esc(value)}</textarea>
      <div class="row"><button class="btn small" type="submit">${button}</button><button class="linkbtn" type="button">Cancel</button></div>
      <p class="err" role="alert" hidden></p>`;
    sum.replaceWith(form);
    form.querySelector("textarea").focus();
    form.querySelector(".linkbtn").addEventListener("click", render);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector(".btn");
      btn.disabled = true;
      try { p = await onSave(form.querySelector("textarea").value); render(); }
      catch (ex) { const er = form.querySelector(".err"); er.textContent = ex.message; er.hidden = false; btn.disabled = false; }
    });
  };
  const editCell = (q) => inlineForm(q, "Edit this summary", p.plan.quadrants[q].summary, "Save",
    (v) => api(`projects/${id}/quadrants/${q}`, { method: "PATCH", body: { summary: v } }));
  const regenCell = (q) => inlineForm(q, "What should change?", "", "Redo it",
    (v) => api(`projects/${id}/quadrants/${q}/regenerate`, { method: "POST", body: { feedback: v } }));

  render();
}

async function taskScreen(id, taskId) {
  loading("Opening your task…");
  let p, msgs;
  try {
    p = await api(`projects/${id}`);
    msgs = (await api(`projects/${id}/tasks/${taskId}/messages`)).messages;
  } catch (e) { return errorView(e.message); }
  const task = p.plan?.tasks.find((t) => t.id === taskId);
  if (!task) return errorView("Task not found.");

  const render = () => {
    view(`
    <section class="taskpage">
      <a class="back" href="#/p/${id}">Back to plan</a>
      <div class="stack">
        <p class="count">${QUAD[task.quadrant]} · about ${task.minutes} min</p>
        <h1 style="font-size:clamp(30px,6vw,44px)">${esc(task.title)}</h1>
        <p>${esc(task.why)}</p>
        ${task.basis ? `<p class="hint">Based on: ${esc(task.basis)}</p>` : ""}
        ${task.sources?.length ? `<div class="sources">${sourceChips(task.sources)}</div>` : ""}
      </div>
      <div class="chat" id="chat" aria-live="polite">
        ${msgs.length ? msgs.map((m) => m.role === "user"
          ? `<div class="msg user">${esc(m.content).replace(/\n/g, "<br>")}</div>`
          : `<div class="msg assistant"><span class="ai-tag">Co-pilot · AI</span>${renderReply(m.content)}</div>`).join("")
          : `<p class="empty">Ask the co-pilot to walk you through this task. Try: “Break this into steps for me.”</p>`}
      </div>
      <form class="composer" id="chatForm">
        <label class="lbl" for="msg">Message the co-pilot</label>
        <textarea id="msg" class="field" maxlength="1500" placeholder="Break this into steps for me."></textarea>
        <div class="row">
          <button class="btn" type="submit">Send</button>
          <button class="btn ghost" type="button" id="doneBtn">${task.done ? "Marked done" : "Mark task done"}</button>
        </div>
        <p class="err" role="alert" hidden></p>
      </form>
    </section>`);
    const form = document.getElementById("chatForm");
    const msg = document.getElementById("msg");
    msg.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) form.requestSubmit(); });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = msg.value.trim() || "Break this into steps for me.";
      const btn = form.querySelector(".btn");
      btn.disabled = true;
      btn.textContent = "Thinking…";
      try { msgs = (await api(`projects/${id}/tasks/${taskId}/messages`, { method: "POST", body: { message: text } })).messages; render(); document.getElementById("msg").focus(); }
      catch (ex) { const er = form.querySelector(".err"); er.textContent = ex.message; er.hidden = false; btn.disabled = false; btn.textContent = "Send"; }
    });
    document.getElementById("doneBtn").addEventListener("click", async () => {
      try { p = await api(`projects/${id}/tasks/${taskId}`, { method: "PATCH", body: { done: !task.done } }); task.done = !task.done; render(); }
      catch (ex) { alert(ex.message); }
    });
  };
  render();
}

async function siteScreen(id) {
  loading("Opening your website…");
  let p;
  try { p = await api(`projects/${id}`); } catch (e) { return errorView(e.message); }
  if (!p.plan) { location.hash = `#/p/${id}/questions`; return; }
  let page = "home";
  let device = "desktop";

  const generate = async () => {
    loading("Building your website. This takes about 20 seconds…");
    try { p = await api(`projects/${id}/site`, { method: "POST" }); render(); }
    catch (e) { view(`<div class="stack"><p class="err">${esc(e.message)}</p><p><button class="btn" id="retry">Try again</button></p></div>`); document.getElementById("retry").addEventListener("click", generate); }
  };

  const render = () => {
    if (!p.site) {
      view(`<section class="stack" style="max-width:640px">
        <a class="back" href="#/p/${id}">Back to plan</a>
        <h1>Build your website</h1>
        <p>We'll write a 4-page site (Home, About, Services, Contact) from your plan. Nothing is made up: no fake reviews, emails, or phone numbers. You can change everything after.</p>
        <p><button class="btn" id="gen">Build my website</button></p></section>`);
      document.getElementById("gen").addEventListener("click", generate);
      return;
    }
    const c = p.site.pages.contact;
    view(`
    <section class="sitepage">
      <a class="back" href="#/p/${id}">Back to plan</a>
      <div class="stack"><h1 style="font-size:clamp(30px,6vw,48px)">${esc(p.site.businessName)}</h1><span class="ai-tag">AI draft · you can change anything</span></div>
      <div class="site-layout">
        <div class="stack">
          <div class="row" style="justify-content:space-between">
            <div class="tabs" role="tablist">
              ${["home", "about", "services", "contact"].map((pg) => `<button class="tab" role="tab" aria-selected="${pg === page}" data-page="${pg}">${pg[0].toUpperCase() + pg.slice(1)}</button>`).join("")}
            </div>
            <div class="tabs">
              <button class="tab" aria-pressed="${device === "phone"}" data-device="phone">Phone</button>
              <button class="tab" aria-pressed="${device === "desktop"}" data-device="desktop">Desktop</button>
            </div>
          </div>
          <div class="frame-wrap ${device}"><iframe title="Website preview" sandbox src="/preview/${id}/${page}?v=${Date.now()}"></iframe></div>
        </div>
        <div class="site-tools">
          <form class="panel" id="editForm">
            <label class="lbl" for="instr">Change something</label>
            <textarea id="instr" class="field" maxlength="500" placeholder="Make the home page headline shorter and add a service for team discounts."></textarea>
            <button class="btn" type="submit">Update my site</button>
            <p class="err" role="alert" hidden></p>
          </form>
          <form class="panel" id="contactForm">
            <h3>Contact info</h3>
            <p class="hint">Only what you type here shows on your site. The AI never makes these up.</p>
            <label class="lbl" for="cEmail">Business email</label><input id="cEmail" class="field" type="email" maxlength="120" value="${esc(c.email)}">
            <label class="lbl" for="cIg">Instagram handle</label><input id="cIg" class="field" maxlength="40" value="${esc(c.instagram)}" placeholder="yourbusiness">
            <label class="lbl" for="cLoc">Where you work</label><input id="cLoc" class="field" maxlength="120" value="${esc(c.location)}" placeholder="Elon University campus">
            <button class="btn ghost" type="submit">Save contact info</button>
          </form>
          <div class="panel">
            <h3>Get your site</h3>
            <p>Download your 4 pages as a .zip. One-click publishing to your own Cloudflare account and domain is coming next.</p>
            <a class="btn ghost" href="/api/projects/${id}/site.zip">Download my site</a>
            <button class="linkbtn" id="regen">Start the site over</button>
          </div>
        </div>
      </div>
    </section>`);
    $main.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => { page = b.dataset.page; render(); }));
    $main.querySelectorAll("[data-device]").forEach((b) => b.addEventListener("click", () => { device = b.dataset.device; render(); }));
    document.getElementById("regen").addEventListener("click", generate);
    const ef = document.getElementById("editForm");
    ef.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = ef.querySelector(".btn");
      btn.disabled = true; btn.textContent = "Updating…";
      try { p = await api(`projects/${id}/site/edit`, { method: "POST", body: { instruction: document.getElementById("instr").value } }); render(); }
      catch (ex) { const er = ef.querySelector(".err"); er.textContent = ex.message; er.hidden = false; btn.disabled = false; btn.textContent = "Update my site"; }
    });
    const cf = document.getElementById("contactForm");
    cf.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = cf.querySelector(".btn");
      btn.disabled = true;
      try {
        p = await api(`projects/${id}/site/contact`, { method: "PATCH", body: {
          email: document.getElementById("cEmail").value,
          instagram: document.getElementById("cIg").value,
          location: document.getElementById("cLoc").value,
        } });
        page = "contact"; render();
      } catch (ex) { alert(ex.message); btn.disabled = false; }
    });
  };
  render();
}

function projectsScreen() {
  const list = store.get();
  view(`<section class="stack" style="max-width:640px"><h1>My plans</h1>
    ${list.length ? `<ul class="list">${list.map((p) => `<li><a href="#/p/${esc(p.id)}">${esc(p.title)}</a></li>`).join("")}</ul>`
      : `<p class="empty">No plans yet on this device.</p>`}
    <p><a class="btn" href="#/">Start a new idea</a></p></section>`);
}

// ---------- router ----------
function route() {
  document.getElementById("myProjectsLink").hidden = store.get().length === 0;
  const h = location.hash.replace(/^#/, "") || "/";
  let m;
  if ((m = h.match(/^\/p\/([0-9a-f-]{36})\/questions$/))) return questionsScreen(m[1]);
  if ((m = h.match(/^\/p\/([0-9a-f-]{36})\/task\/([a-z0-9-]+)$/))) return taskScreen(m[1], m[2]);
  if ((m = h.match(/^\/p\/([0-9a-f-]{36})\/site$/))) return siteScreen(m[1]);
  if ((m = h.match(/^\/p\/([0-9a-f-]{36})$/))) return planScreen(m[1]);
  if (h === "/projects") return projectsScreen();
  return homeScreen();
}

(async () => {
  try {
    const [status, src] = await Promise.all([api("status"), api("sources")]);
    SOURCES = src.sources || {};
    document.getElementById("testBanner").hidden = !status.testMode;
  } catch { /* app still loads */ }
  window.addEventListener("hashchange", route);
  route();
})();
