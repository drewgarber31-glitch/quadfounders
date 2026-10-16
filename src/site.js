// Renders a student's website from JSON content into safe static HTML pages,
// and packages them as a .zip download. All AI text is escaped, so the AI can't
// inject scripts into a student's site.

const PALETTES = {
  lawn: { bg: "#F7FAF7", ink: "#0F1F17", accent: "#1F7A4D", accent2: "#5FBF8F", soft: "#E3EFE7" },
  ink: { bg: "#F6F7FB", ink: "#0E1424", accent: "#1E3A8A", accent2: "#60A5FA", soft: "#E2E7F3" },
  brick: { bg: "#FBF6F4", ink: "#24120F", accent: "#B23F2C", accent2: "#F59E6B", soft: "#F3E3DE" },
  sky: { bg: "#F3F9FC", ink: "#0B1F2A", accent: "#0B72AD", accent2: "#5DD3F0", soft: "#DCEEF6" },
  plum: { bg: "#FAF6FB", ink: "#1E1026", accent: "#7B2F9E", accent2: "#E879F9", soft: "#EFE2F3" },
  sun: { bg: "#FCFAF1", ink: "#221C07", accent: "#875700", accent2: "#FACC15", soft: "#F4ECCD" },
};

export const PAGES = ["home", "about", "services", "contact"];
const PAGE_LABEL = { home: "Home", about: "About", services: "Services", contact: "Contact" };

export function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeEmail(v) {
  const s = String(v || "").trim();
  return /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(s) ? s : "";
}
function safeHandle(v) {
  const s = String(v || "").trim().replace(/^@/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(s) ? s : "";
}

// Small decorative icons (no external files). Chosen by position, not meaning.
const ICONS = [
  '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
  '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  '<path d="M12 20s-7-4.3-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.7-7 10-7 10z"/>',
  '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
];
const icon = (i) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[i % ICONS.length]}</svg>`;
const MAIL = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/></svg>';
const IG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/></svg>';
const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>';
const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/**
 * @param {object} site  site JSON
 * @param {string} page  one of PAGES
 * @param {(page:string)=>string} href  builds links between pages
 */
export function renderPage(site, page, href) {
  const p = PALETTES[site.palette] || PALETTES.lawn;
  const c = site.pages?.[page] || {};
  const rawName = String(site.businessName || "My Business");
  const name = esc(rawName);
  const initial = esc((rawName.trim()[0] || "B").toUpperCase());
  const tagline = esc(site.tagline);
  const nav = PAGES.map(
    (pg) => `<a href="${esc(href(pg))}"${pg === page ? ' aria-current="page"' : ""}>${PAGE_LABEL[pg]}</a>`
  ).join("");
  const services = (site.pages?.services?.items || []).slice(0, 8);
  const contactHead = esc(site.pages?.contact?.headline || "Get in touch");

  const same = (a, b) => String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
  const pageHero = (eyebrow, headline, lead) => `<section class="phero"><div class="wrap">
    ${same(eyebrow, headline) ? "" : `<p class="eyebrow a1">${eyebrow}</p>`}<h1 class="a2">${esc(headline)}</h1>${lead ? `<p class="lead a3">${esc(lead)}</p>` : ""}
  </div></section>`;

  const serviceCard = (i, n) => `<article class="svc a${Math.min(n + 2, 6)}">
      <div class="svc-top"><span class="ic">${icon(n)}</span>${i.price ? `<span class="price">${esc(i.price)}</span>` : ""}</div>
      <h3>${esc(i.name)}</h3><p>${esc(i.description)}</p>
      <a class="more" href="${esc(href("contact"))}">Ask about this ${ARROW}</a>
    </article>`;

  const ctaBand = `<section class="band"><div class="wrap band-in">
      <h2>${contactHead}</h2>
      <a class="btn light" href="${esc(href("contact"))}">Contact ${name} ${ARROW}</a>
    </div></section>`;

  let body = "";
  if (page === "home") {
    const hl = (c.highlights || []).slice(0, 4);
    const chips = hl.slice(0, 2).map((h, n) => `<span class="chip chip${n + 1}">${icon(n)}${esc(h.title)}</span>`).join("");
    body = `<section class="hero"><div class="wrap hero-in">
        <div class="hero-copy">
          ${tagline ? `<p class="pill a1"><i></i>${tagline}</p>` : ""}
          <h1 class="a2">${esc(c.headline)}</h1>
          <p class="lead a3">${esc(c.intro)}</p>
          <div class="btns a4"><a class="btn" href="${esc(href("services"))}">${esc(c.cta || "See services")} ${ARROW}</a><a class="btn ghost" href="${esc(href("about"))}">About us</a></div>
        </div>
        <div class="art a3" aria-hidden="true"><div class="orb"></div><div class="tile"><span>${initial}</span></div>${chips}</div>
      </div></section>
      ${hl.length ? `<section class="sec"><div class="wrap">
        <p class="eyebrow">Why ${name}</p>
        <div class="grid g${Math.min(hl.length, 4)}">${hl.map((h, n) => `<article class="feat a${Math.min(n + 2, 6)}"><span class="num">0${n + 1}</span><h3>${esc(h.title)}</h3><p>${esc(h.text)}</p></article>`).join("")}</div>
      </div></section>` : ""}
      ${services.length ? `<section class="sec alt"><div class="wrap">
        <div class="sec-head"><div>${same("Services", site.pages?.services?.headline) ? "" : '<p class="eyebrow">Services</p>'}<h2>${esc(site.pages?.services?.headline || "What we offer")}</h2></div><a class="link" href="${esc(href("services"))}">All services ${ARROW}</a></div>
        <div class="grid g3">${services.slice(0, 3).map(serviceCard).join("")}</div>
      </div></section>` : ""}
      ${ctaBand}`;
  } else if (page === "about") {
    const vals = (c.values || []).slice(0, 6);
    body = `${pageHero("About", c.headline)}
      <section class="sec"><div class="wrap story">
        <p class="big a3">${esc(c.story)}</p>
        ${vals.length ? `<div class="values">${vals.map((v, n) => `<div class="val a${Math.min(n + 3, 6)}"><span class="ic">${icon(n)}</span><span>${esc(v)}</span></div>`).join("")}</div>` : ""}
      </div></section>
      ${ctaBand}`;
  } else if (page === "services") {
    body = `${pageHero("Services", c.headline)}
      <section class="sec"><div class="wrap"><div class="grid g3">${services.map(serviceCard).join("")}</div></div></section>
      ${ctaBand}`;
  } else if (page === "contact") {
    const email = safeEmail(c.email);
    const ig = safeHandle(c.instagram);
    const rows = [
      email && `<a class="row" href="mailto:${esc(email)}"><span class="ic">${MAIL}</span><span><small>Email</small>${esc(email)}</span></a>`,
      ig && `<a class="row" href="https://instagram.com/${esc(ig)}" rel="noopener"><span class="ic">${IG}</span><span><small>Instagram</small>@${esc(ig)}</span></a>`,
      c.location && `<div class="row"><span class="ic">${PIN}</span><span><small>Where</small>${esc(c.location)}</span></div>`,
    ].filter(Boolean).join("");
    body = `${pageHero("Contact", c.headline, c.text)}
      <section class="sec"><div class="wrap"><div class="contact a3">
        ${rows || `<p class="muted">Add your email or Instagram in Quad Founders to show it here.</p>`}
        ${email ? `<a class="btn" href="mailto:${esc(email)}">Send an email ${ARROW}</a>` : ""}
      </div></div></section>`;
  }

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${PAGE_LABEL[page]} | ${name}</title>
<meta name="description" content="${tagline}">
<style>
:root{--bg:${p.bg};--ink:${p.ink};--accent:${p.accent};--accent2:${p.accent2};--soft:${p.soft};--muted:color-mix(in srgb,var(--ink) 62%,var(--bg));--line:color-mix(in srgb,var(--ink) 10%,transparent)}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
a{color:inherit}.wrap{width:min(1120px,100% - 40px);margin:0 auto}
h1,h2,h3{margin:0;letter-spacing:-.035em;line-height:1.05;text-wrap:balance}
p{margin:0}
header{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.head{display:flex;flex-wrap:wrap;gap:10px 24px;align-items:center;justify-content:space-between;min-height:68px;padding:10px 0}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px;letter-spacing:-.03em;text-decoration:none}
.mono{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:#fff;font-weight:800;font-size:16px;background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 55%,var(--accent2)))}
nav{display:flex;gap:4px;flex-wrap:wrap}
nav a{padding:7px 13px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;color:var(--muted);transition:background .2s,color .2s}
nav a:hover{color:var(--ink);background:var(--soft)}
nav a[aria-current]{color:var(--accent);background:var(--soft)}
.btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#fff;padding:14px 24px;border-radius:999px;font-weight:700;font-size:16px;text-decoration:none;box-shadow:0 10px 24px -10px color-mix(in srgb,var(--accent) 80%,transparent);transition:transform .2s,box-shadow .2s}
.btn:hover{transform:translateY(-2px);box-shadow:0 16px 30px -12px color-mix(in srgb,var(--accent) 85%,transparent)}
.btn svg{width:18px;height:18px}
.btn.ghost{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--line)}
.btn.ghost:hover{box-shadow:inset 0 0 0 1.5px var(--ink)}
.btn.light{background:#fff;color:var(--accent);box-shadow:none}
.eyebrow{font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
.lead{font-size:clamp(18px,2vw,21px);color:var(--muted);max-width:56ch;margin-top:20px}
/* Hero */
.hero{position:relative;overflow:hidden;padding:clamp(48px,8vw,96px) 0 clamp(40px,6vw,80px)}
.hero::before{content:"";position:absolute;inset:-30% -10% auto auto;width:70%;height:120%;background:radial-gradient(closest-side,color-mix(in srgb,var(--accent2) 35%,transparent),transparent);pointer-events:none}
.hero-in{position:relative;display:grid;grid-template-columns:1.15fr .85fr;gap:48px;align-items:center}
.hero h1{font-size:clamp(42px,6.8vw,78px);font-weight:800}
.pill{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px var(--line),0 6px 16px -10px rgba(0,0,0,.2);font-size:14px;font-weight:600;color:var(--muted);margin-bottom:22px}
.pill i{width:8px;height:8px;border-radius:50%;background:var(--accent)}
.btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
.art{position:relative;aspect-ratio:1;max-width:420px;width:100%;justify-self:center}
.art .orb{position:absolute;inset:6%;border-radius:50%;background:conic-gradient(from 200deg,var(--accent),var(--accent2),var(--soft),var(--accent));filter:blur(2px);opacity:.9;animation:spin 24s linear infinite}
.art .tile{position:absolute;inset:20%;border-radius:32px;background:color-mix(in srgb,#fff 82%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 30px 60px -24px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.7);display:grid;place-items:center}
.art .tile span{font-size:clamp(80px,12vw,140px);font-weight:800;letter-spacing:-.06em;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
.chip{position:absolute;display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:14px;background:#fff;box-shadow:0 14px 30px -14px rgba(0,0,0,.3);font-size:14px;font-weight:700;max-width:220px;animation:bob 6s ease-in-out infinite}
.chip svg{color:var(--accent);width:18px;height:18px}
.chip1{left:-4%;bottom:16%}.chip2{right:-2%;top:12%;animation-delay:-3s}
@keyframes spin{to{transform:rotate(360deg)}}@keyframes bob{50%{transform:translateY(-8px)}}
/* Sections */
.sec{padding:clamp(48px,7vw,88px) 0}
.sec.alt{background:color-mix(in srgb,var(--soft) 55%,var(--bg));border-block:1px solid var(--line)}
.sec h2{font-size:clamp(30px,4vw,44px);font-weight:800}
.sec-head{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;justify-content:space-between;margin-bottom:28px}
.link{display:inline-flex;align-items:center;gap:6px;font-weight:700;color:var(--accent);text-decoration:none}
.link svg{width:18px;height:18px;transition:transform .2s}.link:hover svg{transform:translateX(3px)}
.grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.feat,.svc{position:relative;background:#fff;border-radius:22px;padding:26px;box-shadow:0 0 0 1px var(--line),0 12px 30px -20px rgba(0,0,0,.25);transition:transform .25s,box-shadow .25s}
.feat:hover,.svc:hover{transform:translateY(-4px);box-shadow:0 0 0 1px color-mix(in srgb,var(--accent) 35%,transparent),0 20px 40px -22px rgba(0,0,0,.35)}
.feat .num{display:inline-block;font-size:14px;font-weight:800;color:var(--accent);margin-bottom:18px;padding:4px 10px;border-radius:999px;background:var(--soft)}
.feat h3,.svc h3{font-size:21px;font-weight:750;margin-bottom:8px}
.feat p,.svc p{color:var(--muted);font-size:16px}
.svc{display:flex;flex-direction:column}
.svc-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.ic{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:var(--soft);color:var(--accent)}
.price{font-weight:800;font-size:15px;color:var(--accent);background:var(--soft);padding:6px 12px;border-radius:999px}
.more{margin-top:auto;padding-top:18px;display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:15px;color:var(--accent);text-decoration:none}
.more svg{width:16px;height:16px;transition:transform .2s}.more:hover svg{transform:translateX(3px)}
/* Page hero (inner pages) */
.phero{position:relative;overflow:hidden;padding:clamp(56px,8vw,100px) 0 clamp(28px,4vw,48px);background:radial-gradient(60% 120% at 100% 0%,color-mix(in srgb,var(--accent2) 28%,transparent),transparent 70%)}
.phero h1{font-size:clamp(40px,6vw,68px);font-weight:800;max-width:18ch}
/* About */
.story{display:grid;grid-template-columns:1.3fr 1fr;gap:48px;align-items:start}
.story .big{font-size:clamp(20px,2.4vw,26px);line-height:1.55;letter-spacing:-.01em}
.values{display:grid;gap:12px}
.val{display:flex;align-items:center;gap:14px;padding:16px 18px;background:#fff;border-radius:18px;box-shadow:0 0 0 1px var(--line);font-weight:650}
/* CTA band */
.band{padding:0 0 clamp(48px,7vw,88px)}
.band-in{position:relative;overflow:hidden;display:flex;flex-wrap:wrap;gap:22px;align-items:center;justify-content:space-between;padding:clamp(32px,5vw,56px);border-radius:32px;color:#fff;background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 60%,var(--accent2)))}
.band-in::after{content:"";position:absolute;right:-60px;top:-80px;width:280px;height:280px;border-radius:50%;background:rgba(255,255,255,.14)}
.band h2{font-size:clamp(28px,4vw,44px);font-weight:800;max-width:20ch;position:relative}
.band .btn{position:relative}
/* Contact */
.contact{max-width:620px;display:grid;gap:14px}
.row{display:flex;align-items:center;gap:16px;padding:18px 20px;background:#fff;border-radius:20px;box-shadow:0 0 0 1px var(--line),0 12px 30px -22px rgba(0,0,0,.3);text-decoration:none;font-weight:650;font-size:18px;transition:transform .2s}
a.row:hover{transform:translateX(4px)}
.row small{display:block;font-size:13px;font-weight:600;color:var(--muted);letter-spacing:.02em}
.contact .btn{justify-self:start;margin-top:8px}
.muted{color:var(--muted)}
footer{border-top:1px solid var(--line);padding:36px 0 44px;font-size:15px;color:var(--muted)}
.foot{display:flex;flex-wrap:wrap;gap:16px 32px;justify-content:space-between;align-items:center}
.foot nav a{padding:4px 8px;font-size:14px}
.made{font-size:13px;opacity:.8}
/* Entrance motion */
.a1,.a2,.a3,.a4,.a5,.a6{animation:up .7s cubic-bezier(.2,.8,.2,1) both}
.a2{animation-delay:.08s}.a3{animation-delay:.16s}.a4{animation-delay:.24s}.a5{animation-delay:.32s}.a6{animation-delay:.4s}
@keyframes up{from{opacity:0;transform:translateY(16px)}}
@media (max-width:820px){.hero-in,.story{grid-template-columns:1fr}.art{max-width:300px}.chip1{left:0}.chip2{right:0}}
@media (max-width:520px){nav a{padding:6px 10px;font-size:14px}.head{justify-content:center}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
a:focus-visible{outline:3px solid var(--accent);outline-offset:3px;border-radius:8px}
</style></head>
<body>
<header><div class="wrap head"><a class="brand" href="${esc(href("home"))}"><span class="mono" aria-hidden="true">${initial}</span>${name}</a><nav aria-label="Main">${nav}</nav></div></header>
<main>${body}</main>
<footer><div class="wrap foot"><div><strong style="color:var(--ink)">${name}</strong>${tagline ? ` · ${tagline}` : ""}<br>&copy; ${new Date().getFullYear()} ${name}</div><nav aria-label="Footer">${nav}</nav><span class="made">Built with Quad Founders</span></div></footer>
</body></html>`;
}

// ---------- Minimal ZIP writer (stored, no compression) ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** @param {{name:string, content:string}[]} files */
export function makeZip(files) {
  const enc = new TextEncoder();
  const parts = [];
  const central = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const data = enc.encode(f.content);
    const crc = crc32(data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // UTF-8 names
    local.setUint16(8, 0, true); // stored
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    parts.push(new Uint8Array(local.buffer), name, data);

    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true);
    cen.setUint16(4, 20, true);
    cen.setUint16(6, 20, true);
    cen.setUint16(8, 0x0800, true);
    cen.setUint32(16, crc, true);
    cen.setUint32(20, data.length, true);
    cen.setUint32(24, data.length, true);
    cen.setUint16(28, name.length, true);
    cen.setUint32(42, offset, true);
    central.push(new Uint8Array(cen.buffer), name);
    offset += 30 + name.length + data.length;
  }
  const cenSize = central.reduce((s, a) => s + a.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, cenSize, true);
  end.setUint32(16, offset, true);
  const all = [...parts, ...central, new Uint8Array(end.buffer)];
  const out = new Uint8Array(all.reduce((s, a) => s + a.length, 0));
  let pos = 0;
  for (const a of all) { out.set(a, pos); pos += a.length; }
  return out;
}

export function siteFiles(site) {
  const file = (pg) => (pg === "home" ? "index.html" : `${pg}.html`);
  return PAGES.map((pg) => ({ name: file(pg), content: renderPage(site, pg, file) }));
}
