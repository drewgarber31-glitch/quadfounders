// Quad Founders landing page interactions. No tracking, no third-party scripts.
const $ = (id) => document.getElementById(id);

// Sticky nav background after scrolling
const nav = $("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Mockup progress ring + tile bars animate when visible
const R = 70, C = 2 * Math.PI * R, GAP = 7, SEG = C / 4 - GAP;
const fracs = [0.66, 0.33, 0.25, 0.16];
$("mockRing").innerHTML = fracs.map((f, i) => {
  const rot = -90 + i * 90 + (GAP / C) * 180;
  return `<circle cx="84" cy="84" r="${R}" fill="none" stroke="var(--border-soft)" stroke-dasharray="${SEG} ${C}" transform="rotate(${rot} 84 84)"/>
    <circle class="arc" cx="84" cy="84" r="${R}" fill="none" stroke="var(--q${i})" stroke-dasharray="${SEG} ${C}" stroke-dashoffset="${SEG}" data-to="${SEG * (1 - f)}" transform="rotate(${rot} 84 84)"/>`;
}).join("");
const stage = $("stage");
new IntersectionObserver((entries, obs) => {
  if (!entries[0].isIntersecting) return;
  stage.classList.add("in");
  stage.querySelectorAll(".arc").forEach((a) => a.setAttribute("stroke-dashoffset", a.dataset.to));
  stage.querySelectorAll(".bar b").forEach((b) => (b.style.width = b.dataset.w));
  obs.disconnect();
}, { threshold: 0.25 }).observe(stage);

// Rotating example placeholder in the hero input
const input = $("heroIdea");
const examples = [
  "An app that matches students flying home on the same day",
  "Rent-a-fridge for dorms, delivered on move-in day",
  "A gear swap between club sports teams",
  "Custom study playlists made from your syllabus",
];
let ex = 0;
setInterval(() => {
  if (document.activeElement === input || input.value) return;
  ex = (ex + 1) % examples.length;
  input.placeholder = examples[ex];
}, 3200);

// State picker for the hero form (remembers the last pick)
const stateSel = $("heroState");
const TERR = ["DC", "PR", "VI", "GU", "AS", "MP"];
let savedState = "";
try { savedState = localStorage.getItem("qf.state") || ""; } catch { /* storage unavailable */ }
fetch("/api/states").then((r) => r.json()).then(({ states = {} }) => {
  const codes = Object.keys(states).sort((a, b) => states[a].localeCompare(states[b]));
  const group = (label, list) => {
    const g = document.createElement("optgroup");
    g.label = label;
    for (const c of list) g.append(new Option(states[c], c, false, c === savedState));
    stateSel.append(g);
  };
  group("States", codes.filter((c) => !TERR.includes(c)));
  group("DC and U.S. territories", codes.filter((c) => TERR.includes(c)));
}).catch(() => { /* the app screen also asks for the state */ });

// Hero form: create the plan right away, then continue in the app
$("heroForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = $("heroErr");
  const btn = e.target.querySelector("button");
  const idea = input.value.trim();
  err.hidden = true;
  if (!idea) { input.focus(); input.placeholder = "Type your idea first, even one sentence"; return; }
  const state = stateSel.value;
  if (!state) { err.textContent = "Pick the state or territory where you'll run your business."; err.hidden = false; stateSel.focus(); return; }
  try { localStorage.setItem("qf.state", state); } catch { /* storage unavailable */ }
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Reading your idea';
  try {
    const res = await fetch("/api/projects", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idea, state }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
    try {
      const list = JSON.parse(localStorage.getItem("qf.projects") || "[]").filter((p) => p.id !== data.id);
      list.unshift({ id: data.id, title: data.title || "My idea" });
      localStorage.setItem("qf.projects", JSON.stringify(list.slice(0, 20)));
    } catch { /* storage unavailable */ }
    location.href = `/app#/p/${data.id}/questions`;
  } catch (ex2) {
    err.textContent = ex2.message;
    err.hidden = false;
    btn.disabled = false;
    btn.textContent = "Build my plan";
  }
});

// Quadrant wheel + tabs
const NAMES = ["Customer", "Pricing", "Marketing", "Legal"];
const wheel = $("wheel");
const pt = (r, a) => [200 + r * Math.cos((a * Math.PI) / 180), 200 + r * Math.sin((a * Math.PI) / 180)].map((n) => n.toFixed(2)).join(" ");
const wedge = (i) => {
  const a0 = -90 + i * 90 + 3, a1 = a0 + 84, ro = 180, ri = 92;
  return `M${pt(ro, a0)}A${ro} ${ro} 0 0 1 ${pt(ro, a1)}L${pt(ri, a1)}A${ri} ${ri} 0 0 0 ${pt(ri, a0)}Z`;
};
wheel.innerHTML = [0, 1, 2, 3].map((i) => `<path d="${wedge(i)}" fill="var(--q${i})" data-q="${i}"/>`).join("");
const tabs = [...document.querySelectorAll(".qtab")];
function select(i) {
  tabs.forEach((t, n) => t.setAttribute("aria-selected", String(n === i)));
  wheel.querySelectorAll("path").forEach((p, n) => {
    p.classList.toggle("on", n === i);
    const mid = ((-90 + n * 90 + 45) * Math.PI) / 180;
    p.style.transform = n === i ? `translate(${(Math.cos(mid) * 10).toFixed(1)}px, ${(Math.sin(mid) * 10).toFixed(1)}px)` : "";
  });
  $("hubN").textContent = String(i + 1).padStart(2, "0");
  $("hubL").textContent = NAMES[i];
}
tabs.forEach((t, i) => t.addEventListener("click", () => select(i)));
wheel.querySelectorAll("path").forEach((p) => p.addEventListener("click", () => select(Number(p.dataset.q))));
select(0);

$("yr").textContent = new Date().getFullYear();
