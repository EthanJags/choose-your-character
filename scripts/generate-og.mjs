/**
 * Generates the Open Graph / Twitter link previews in the "Select Your Ethan"
 * character-select style. Every image is exactly 1200x630 (1.91:1, the ratio
 * X, LinkedIn, Facebook, Discord and iMessage use for large link cards):
 *
 *   public/og/home.jpg                          – homepage card
 *   public/og/home.mp4                          – homepage og:video: the 1P cursor
 *                                                 moves tile to tile (needs ffmpeg)
 *   public/og/<characterSlug>/<projectSlug>.jpg – one card per project page, with
 *                                                 that project's Ethan selected and
 *                                                 its thumbnail as the "stage"
 *
 * Run after adding or changing a character or project:
 *
 *   npm run og
 *
 * Needs Node 22.18+ (it imports app/data/content.ts directly) and the
 * `playwright` package with Chromium available (npx playwright install chromium).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { characters } from "../app/data/content.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "og");
const W = 1200;
const H = 630;

const asset = (p) => pathToFileURL(path.join(PUBLIC, p)).href;
const POINTER = pathToFileURL(path.join(ROOT, "scripts/og-assets/pointer-1p.png")).href;
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const label = (c) => `The ${c.name.replace(/\b\w/g, (m) => m.toUpperCase())}`;

// The cutouts are framed alike except the adventurer, whose photo has ~5%
// empty space above the head. Shift it up so the heads line up.
const HEAD_PAD = { adventurer: 0.05 };

// Layout (px on the 1200x630 canvas).
const TILE = { x0: 72, w: 252, h: 214, gap: 16, top: 108 };
const tileX = (i) => TILE.x0 + i * (TILE.w + TILE.gap);
const POINTER_AT = (i) => ({ x: tileX(i) + 10, y: TILE.top + 62 });
const PANEL_TOP = 356;
const SLOTS = [
  ["P2", "#2c5fd4"],
  ["P3", "#e8a40c"],
  ["P4", "#2a9450"],
];

const css = `
*{margin:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;font-family:"Londrina Solid",sans-serif;background:#232026}
.paper{position:absolute;inset:0;background:url("${asset("background.png")}") center/cover;mix-blend-mode:soft-light;opacity:.55}
.dots{position:absolute;inset:0;background:radial-gradient(circle,rgba(255,255,255,.09) 1.6px,transparent 2.2px) 0 0/13px 13px;
  -webkit-mask-image:linear-gradient(200deg,#000 0%,transparent 55%)}
.title{position:absolute;left:52px;top:26px;height:62px;max-width:860px;padding:0 28px;background:#f4f1ea}
.title span{display:block;font-size:54px;line-height:64px;color:#141414;text-transform:uppercase;white-space:nowrap}
.site{position:absolute;right:56px;top:42px;color:rgba(255,255,255,.55);font-size:26px;text-transform:uppercase;letter-spacing:1px}
.tile{position:absolute;top:${TILE.top}px;width:${TILE.w}px;height:${TILE.h}px;border:4px solid #0e0e0e;overflow:hidden}
.tile .ph{position:absolute;inset:0}
.tile .ph img{position:absolute;left:50%;height:440px;transform:translateX(-50%)}
.tile .plate{position:absolute;left:0;right:0;bottom:0;height:42px;background:#0e0e0e}
.tile .plate span{display:block;padding-left:14px;color:#f4f1ea;font-size:29px;line-height:40px;text-transform:uppercase;font-style:italic}
.tile.sel{border:6px solid #d8232a;box-shadow:7px 7px 0 #0e0e0e}
.pointer{position:absolute;z-index:9;width:62px;image-rendering:pixelated;filter:drop-shadow(3px 4px 0 rgba(0,0,0,.5))}
.p1{position:absolute;left:72px;top:${PANEL_TOP}px;width:512px;height:252px;border:4px solid #0e0e0e;overflow:hidden;
  background:linear-gradient(155deg,#e2363d 0%,#a3161d 100%)}
.p1 .burst{position:absolute;right:-60px;top:-80px;width:420px;height:420px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.22),transparent)}
.p1 .fig{position:absolute;left:390px;height:500px;transform:translateX(-50%)}
.p1 .tag{position:absolute;left:0;top:0;padding:2px 16px 0 14px;background:#0e0e0e;color:#f4f1ea;font-size:34px;font-style:italic}
.p1 .ready{position:absolute;left:84px;top:8px;color:#fff;font-size:28px;letter-spacing:1px;font-style:italic;text-transform:uppercase}
.p1 .name{position:absolute;left:-14px;top:62px;padding:0 28px 0 36px;background:#f4f1ea;transform:skewX(-14deg);border-bottom:6px solid var(--c)}
.p1 .name span{display:block;transform:skewX(14deg);color:#111;font-size:42px;line-height:56px;text-transform:uppercase;white-space:nowrap}
.slot{position:absolute;top:${PANEL_TOP}px;width:176px;height:252px;border:4px solid #0e0e0e;overflow:hidden;
  background:linear-gradient(160deg,color-mix(in srgb,var(--p) 34%,#1b1a1e) 0%,#151418 100%)}
.slot .tag{position:absolute;left:0;top:0;padding:2px 14px 0 12px;background:var(--p);color:#111;font-size:30px;font-style:italic}
.slot .big{position:absolute;right:10px;bottom:30px;color:var(--p);opacity:.22;font-size:190px;line-height:1;font-style:italic}
.slot .ps{position:absolute;left:0;right:0;bottom:14px;text-align:center;color:rgba(244,241,234,.8);font-size:24px;text-transform:uppercase;letter-spacing:1px}
.stage{position:absolute;left:600px;top:${PANEL_TOP}px;width:552px;height:252px;border:4px solid #0e0e0e;overflow:hidden;background:#111}
.stage img{display:block;width:100%;height:100%;object-fit:cover}
.stage .tag{position:absolute;left:0;top:0;padding:2px 14px 0 12px;background:#0e0e0e;color:#f4f1ea;font-size:30px;font-style:italic;text-transform:uppercase}
`;

const page = (body, script = "") => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@900&display=block" rel="stylesheet">
<style>${css}</style></head><body>
<div class="paper"></div><div class="dots"></div>
${body}
<script>
  // Long project names: shrink the title strip's text until it fits.
  for (const el of document.querySelectorAll(".title span, .p1 .name span")) {
    const box = el.closest(".title, .p1");
    const max = el.closest(".title") ? 860 - 56 : 470;
    let s = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > max && s > 24) el.style.fontSize = (s -= 2) + "px";
  }
  ${script}
</script></body></html>`;

function tiles(selected) {
  return characters
    .slice(0, 4)
    .map((c, i) => {
      const top = 6 - (HEAD_PAD[c.slug] ?? 0) * 440;
      return `<div class="tile${i === selected ? " sel" : ""}" data-i="${i}" style="left:${tileX(i)}px;background:${c.color}">
  <div class="ph"><img src="${asset(c.image)}" style="top:${top}px"></div>
  <div class="plate"><span>${esc(label(c))}</span></div></div>`;
    })
    .join("");
}

function p1Panel(c, extra = "") {
  const top = -6 - (HEAD_PAD[c.slug] ?? 0) * 500;
  return `<div class="p1" style="--c:${c.color}" ${extra}><div class="burst"></div>
  <img class="fig" src="${asset(c.image)}" style="top:${top}px">
  <div class="tag">P1</div><div class="ready">Ready!</div>
  <div class="name"><span>${esc(label(c))}</span></div></div>`;
}

const pointer = (i) => {
  const { x, y } = POINTER_AT(i);
  return `<img class="pointer" src="${POINTER}" style="left:${x}px;top:${y}px">`;
};

const emptySlots = SLOTS.map(
  ([tag, color], j) =>
    `<div class="slot" style="left:${600 + j * 188}px;--p:${color}"><div class="tag">${tag}</div><div class="big">${tag[1]}</div><div class="ps">Press Start</div></div>`,
).join("");

function homeHtml() {
  return page(`<div class="title"><span>Select Your Ethan</span></div><div class="site">ethanjagoda.me</div>
${tiles(0)}${pointer(0)}${p1Panel(characters[0])}${emptySlots}`);
}

function projectHtml(c, p) {
  const i = Math.max(0, characters.slice(0, 4).findIndex((x) => x.slug === c.slug));
  return page(`<div class="title"><span>${esc(p.title)}</span></div><div class="site">ethanjagoda.me</div>
${tiles(i)}${pointer(i)}${p1Panel(c)}
<div class="stage"><img src="${asset(p.image)}"><div class="tag">Stage</div></div>`);
}

// Homepage video: the 1P cursor visits each tile in turn. Each Ethan is held
// for HOLD ms, then the cursor glides to the next tile over MOVE ms and the
// selection + P1 panel switch as it lands. After the 4th it glides back to
// the 1st, so the last frame flows straight into the first.
const HOLD = 1100;
const MOVE = 400;
const STEP = HOLD + MOVE;
const LOOP_MS = STEP * 4;
const FPS = 30;

function homeVideoHtml() {
  const panels = characters
    .slice(0, 4)
    .map((c, i) => p1Panel(c, `data-p="${i}" style="--c:${c.color};opacity:${i === 0 ? 1 : 0}"`))
    .join("");
  const stops = characters.slice(0, 4).map((_, i) => POINTER_AT(i));
  const script = `
  const stops=${JSON.stringify(stops)}, HOLD=${HOLD}, MOVE=${MOVE}, STEP=${STEP}, N=4;
  const ease=(u)=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
  const ptr=document.querySelector(".pointer");
  const tilesEl=[...document.querySelectorAll(".tile")];
  const panelsEl=[...document.querySelectorAll(".p1")];
  window.setT=(t)=>{
    const k=Math.floor(t/STEP)%N, local=t%STEP;
    let from=k, to=k, u=0;
    if(local>HOLD){ to=(k+1)%N; u=ease((local-HOLD)/MOVE); }
    const x=stops[from].x+(stops[to].x-stops[from].x)*u, y=stops[from].y+(stops[to].y-stops[from].y)*u;
    ptr.style.left=x+"px"; ptr.style.top=y+"px";
    const sel=u>=1?to:(u>0.85?to:from);
    tilesEl.forEach((el,i)=>el.classList.toggle("sel",i===sel));
    // Cross-fade the P1 panel over the last 30% of the glide.
    const f=Math.min(1,Math.max(0,(u-0.7)/0.3));
    panelsEl.forEach((el,i)=>{el.style.opacity=i===from&&i!==to?1-f:i===to&&i!==from?f:(i===from?1:0);});
  };
  window.setT(0);`;
  return page(
    `<div class="title"><span>Select Your Ethan</span></div><div class="site">ethanjagoda.me</div>
${tiles(0)}${pointer(0)}${panels}${emptySlots}`,
    script,
  );
}

async function renderHomeVideo(tab, tmp) {
  const framesDir = path.join(OUT, ".frames");
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir);
  fs.writeFileSync(tmp, homeVideoHtml());
  await tab.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  // Frame N would equal frame 0, so stop one short of the full period.
  const frames = (LOOP_MS / 1000) * FPS;
  for (let f = 0; f < frames; f++) {
    await tab.evaluate((t) => window.setT(t), (f * 1000) / FPS);
    await tab.screenshot({
      path: path.join(framesDir, `${String(f).padStart(4, "0")}.png`),
    });
  }
  const file = path.join(OUT, "home.mp4");
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-framerate", String(FPS),
    "-i", path.join(framesDir, "%04d.png"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "22",
    "-movflags", "+faststart", "-an",
    file,
  ]);
  fs.rmSync(framesDir, { recursive: true });
  console.log("wrote", path.relative(ROOT, file));
}

async function main() {
  let chromium;
  try {
    ({ chromium } = createRequire(import.meta.url)("playwright"));
  } catch {
    console.error("Missing playwright. Run: npm i -D playwright && npx playwright install chromium");
    process.exit(1);
  }

  const jobs = [{ out: "home.jpg", html: homeHtml() }];
  for (const c of characters) {
    for (const p of c.projects) {
      jobs.push({ out: `${c.slug}/${p.slug}.jpg`, html: projectHtml(c, p) });
    }
  }

  const browser = await chromium.launch();
  const tab = await browser.newPage({ viewport: { width: W, height: H } });
  const tmp = path.join(OUT, ".render.html");
  fs.mkdirSync(OUT, { recursive: true });
  for (const job of jobs) {
    const file = path.join(OUT, job.out);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(tmp, job.html);
    await tab.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
    await tab.evaluate(() => document.fonts.ready);
    await tab.screenshot({ path: file, type: "jpeg", quality: 88 });
    console.log("wrote", path.relative(ROOT, file));
  }
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    await renderHomeVideo(tab, tmp);
  } catch (err) {
    console.warn("skipped home.mp4 (needs ffmpeg):", err.message);
  }
  fs.rmSync(tmp);
  await browser.close();
}

main();
