// يصدّر صورًا ثابتة عند مواضع محددة من مشاهد مختارة لمراجعة الجودة بصريًا
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { readFileSync } from "node:fs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = process.argv[2];
const ids = process.argv[3] ? process.argv[3].split(",") : null;
const fracs = (process.argv[4] ?? "0.25,0.6,0.95").split(",").map(Number);

const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const browser = await openBrowser("chrome", { browserExecutable: "/opt/pw-browsers/chromium" });
const comp = await selectComposition({ serveUrl, id: "AIAgentsStandards", puppeteerInstance: browser });

// مدد المشاهد محسوبة مسبقًا في timing.json (المنطق نفسه في src/timeline.ts)
const timing = JSON.parse(readFileSync(path.join(root, "src/data/timing.json"), "utf8"));
const OVERLAP = timing.overlap;
let cursor = 0;
const scenes = timing.scenes.map((t) => {
  const sc = { id: t.id, from: cursor, dur: t.durFrames };
  cursor += t.durFrames - OVERLAP;
  return sc;
});

for (const s of scenes) {
  if (ids && !ids.includes(s.id)) continue;
  for (const fr of fracs) {
    const frame = Math.min(comp.durationInFrames - 1, s.from + Math.round(s.dur * fr));
    const output = path.join(outDir, `${s.id}_${String(Math.round(fr * 100)).padStart(3, "0")}.jpg`);
    await renderStill({ composition: comp, serveUrl, output, frame, imageFormat: "jpeg", jpegQuality: 80, puppeteerInstance: browser, timeoutInMilliseconds: 60000, scale: 0.5 });
    console.log(output);
  }
}
await browser.close({ silent: true });
