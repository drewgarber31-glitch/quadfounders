// Renders a student's website from JSON content into safe static HTML pages,
// and packages them as a .zip download. All AI text is escaped, so the AI can't
// inject scripts into a student's site.

const PALETTES = {
  lawn: { bg: "#F6F8F5", ink: "#16231C", accent: "#2F6B4F", soft: "#E3EDE6" },
  ink: { bg: "#F5F6F8", ink: "#141A24", accent: "#2A3F6B", soft: "#E1E5EE" },
  brick: { bg: "#F8F5F4", ink: "#231716", accent: "#9A3B2E", soft: "#F0E1DE" },
  sky: { bg: "#F4F8FA", ink: "#132028", accent: "#1F6F96", soft: "#DDECF3" },
  plum: { bg: "#F7F5F8", ink: "#1E1624", accent: "#6B3A7A", soft: "#EADFEE" },
  sun: { bg: "#FBF9F2", ink: "#211D10", accent: "#8A6A00", soft: "#F3ECCF" },
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

/**
 * @param {object} site  site JSON
 * @param {string} page  one of PAGES
 * @param {(page:string)=>string} href  builds links between pages
 */
export function renderPage(site, page, href) {
  const p = PALETTES[site.palette] || PALETTES.lawn;
  const c = site.pages?.[page] || {};
  const name = esc(site.businessName || "My Business");
  const nav = PAGES.map(
    (pg) => `<a href="${esc(href(pg))}"${pg === page ? ' aria-current="page"' : ""}>${PAGE_LABEL[pg]}</a>`
  ).join("");

  let body = "";
  if (page === "home") {
    const hl = (c.highlights || []).slice(0, 4)
      .map((h) => `<div class="card"><h3>${esc(h.title)}</h3><p>${esc(h.text)}</p></div>`).join("");
    body = `<section class="hero"><h1>${esc(c.headline)}</h1><p class="lead">${esc(c.intro)}</p>
      <a class="btn" href="${esc(href("services"))}">${esc(c.cta || "See services")}</a></section>
      ${hl ? `<section class="grid">${hl}</section>` : ""}`;
  } else if (page === "about") {
    const vals = (c.values || []).slice(0, 6).map((v) => `<li>${esc(v)}</li>`).join("");
    body = `<section><h1>${esc(c.headline)}</h1><p class="lead">${esc(c.story)}</p>${vals ? `<ul class="values">${vals}</ul>` : ""}</section>`;
  } else if (page === "services") {
    const items = (c.items || []).slice(0, 8).map((i) =>
      `<div class="card"><h3>${esc(i.name)}</h3><p>${esc(i.description)}</p>${i.price ? `<p class="price">${esc(i.price)}</p>` : ""}</div>`).join("");
    body = `<section><h1>${esc(c.headline)}</h1><div class="grid">${items}</div></section>`;
  } else if (page === "contact") {
    const email = safeEmail(c.email);
    const ig = safeHandle(c.instagram);
    const rows = [
      email && `<p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>`,
      ig && `<p><strong>Instagram:</strong> <a href="https://instagram.com/${esc(ig)}" rel="noopener">@${esc(ig)}</a></p>`,
      c.location && `<p><strong>Where:</strong> ${esc(c.location)}</p>`,
    ].filter(Boolean).join("");
    body = `<section><h1>${esc(c.headline)}</h1><p class="lead">${esc(c.text)}</p>${rows || `<p class="muted">Add your email or Instagram in Quad Founders to show it here.</p>`}</section>`;
  }

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${PAGE_LABEL[page]} | ${name}</title>
<meta name="description" content="${esc(site.tagline)}">
<style>
:root{--bg:${p.bg};--ink:${p.ink};--accent:${p.accent};--soft:${p.soft}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
header{display:flex;flex-wrap:wrap;gap:12px 24px;align-items:center;justify-content:space-between;padding:20px max(20px,5vw);border-bottom:1px solid var(--soft)}
.brand{font-weight:800;font-size:20px;color:var(--ink);text-decoration:none}
nav{display:flex;gap:18px;flex-wrap:wrap}nav a{color:var(--ink);text-decoration:none;font-weight:600}
nav a[aria-current]{color:var(--accent);text-decoration:underline;text-underline-offset:6px}
main{max-width:960px;margin:0 auto;padding:48px max(20px,5vw) 72px;display:grid;gap:40px}
h1{font-size:clamp(32px,6vw,52px);line-height:1.1;margin:0 0 16px;text-wrap:balance}
h3{margin:0 0 6px;font-size:19px}.lead{font-size:19px;max-width:60ch;margin:0 0 24px}
.btn{display:inline-block;background:var(--accent);color:#fff;padding:12px 22px;border-radius:999px;font-weight:700;text-decoration:none}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.card{background:#fff;border:1px solid var(--soft);border-radius:14px;padding:20px}.card p{margin:0}
.price{margin-top:10px!important;font-weight:700;color:var(--accent)}
.values{padding-left:20px}.muted{opacity:.7}
footer{padding:24px max(20px,5vw);border-top:1px solid var(--soft);font-size:14px;opacity:.75}
a:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
</style></head>
<body><header><a class="brand" href="${esc(href("home"))}">${name}</a><nav>${nav}</nav></header>
<main>${body}</main>
<footer>&copy; ${new Date().getFullYear()} ${name}. ${esc(site.tagline)}</footer>
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
