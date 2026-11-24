/**
 * Generates the Open Graph / Twitter preview cards (1200x630) in the
 * "Select Your Ethan" staggered-sticker style:
 *
 *   public/og/home.jpg                          – homepage card
 *   public/og/<characterSlug>/<projectSlug>.jpg – one card per project page
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
import { characters } from "../app/data/content.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "og");
const W = 1200;
const H = 630;

const asset = (p) => pathToFileURL(path.join(PUBLIC, p)).href;
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const baseCss = `
*{margin:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;
  background:#7a7a7a url("${asset("background.png")}") center/cover;
  font-family:"Londrina Solid",sans-serif}
body::before{content:"";position:absolute;inset:0;background:#8c8c8c;mix-blend-mode:multiply;z-index:0}
h1{position:absolute;left:60px;right:60px;text-align:center;color:#fff;line-height:1;
  text-transform:uppercase;white-space:nowrap;z-index:5;text-shadow:0 3px 0 rgba(0,0,0,.18)}
.mtn{position:absolute;left:50%;bottom:-300px;width:1300px;transform:translateX(-50%);z-index:1}
.bust{position:absolute;width:230px;height:250px;transform-origin:top left;z-index:3}
.clip{position:absolute;inset:0 0 18px 0;overflow:hidden}
.halo{position:absolute;border-radius:50%;width:180px;height:180px;left:25px;top:12px}
.clip img{position:absolute;height:320px;left:50%;transform:translateX(-50%);top:10px}
.banner{position:absolute;left:15px;top:190px;width:200px;height:52px}
.banner img{position:absolute;inset:0;width:100%;height:100%}
.banner span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  text-transform:uppercase;color:#000;padding-top:2px;font-size:23px;white-space:nowrap}
.shot{position:absolute;background:#fff;padding:12px;z-index:3;
  box-shadow:0 12px 30px rgba(0,0,0,.35)}
.shot img{display:block;width:100%;height:100%;object-fit:cover}
`;

const page = (body) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@900&display=block" rel="stylesheet">
<style>${baseCss}</style></head><body>
<img class="mtn" src="${asset("mountain.png")}">
${body}
<script>
  // Shrink the title until it fits on one line.
  for (const h of document.querySelectorAll("h1")) {
    let s = parseFloat(getComputedStyle(h).fontSize);
    while (h.scrollWidth > h.clientWidth && s > 40) h.style.fontSize = (s -= 2) + "px";
  }
</script></body></html>`;

const label = (c) => `The ${c.name.replace(/\b\w/g, (m) => m.toUpperCase())}`;

function bust(c, x, y, scale, rotate) {
  return `<div class="bust" style="left:${x}px;top:${y}px;transform:scale(${scale}) rotate(${rotate}deg)">
  <div class="clip"><div class="halo" style="background:${c.color}"></div><img src="${asset(c.image)}"></div>
  <div class="banner"><img src="${asset(c.banner)}"><span>${esc(label(c))}</span></div></div>`;
}

function homeHtml() {
  const slots = [
    [60, 190, -4],
    [335, 245, 3],
    [610, 190, -3],
    [885, 245, 4],
  ];
  return page(`<h1 style="top:36px;font-size:96px">Select Your Ethan</h1>
${characters.slice(0, 4).map((c, i) => bust(c, slots[i][0], slots[i][1], 1.15, slots[i][2])).join("")}`);
}

function projectHtml(c, p) {
  return page(`<h1 style="top:36px;font-size:96px">${esc(p.title)}</h1>
${bust(c, 110, 205, 1.45, -4)}
<div class="shot" style="left:520px;top:190px;width:600px;height:360px;transform:rotate(3deg)">
  <img src="${asset(p.image)}"></div>`);
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
  fs.rmSync(tmp);
  await browser.close();
}

main();
