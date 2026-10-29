// يصدّر صورًا ثابتة عند مواضع محددة من مشاهد مختارة لمراجعة الجودة بصريًا
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { readFileSync } from "node:fs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = process.argv[2];
const ids = process.argv[3] ? process.argv[3].split(",") : null;
const fracs = (process.argv[4] ?? "0.25,0.6,0.95").split(",").map(Number);

const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const comp = await selectComposition({ serveUrl, id: "AIAgentsStandards", browserExecutable: "/opt/pw-browsers/chromium" });

// نفس منطق الجدول الزمني في المشروع
const narration = JSON.parse(readFileSync(path.join(root, "src/data/narration.json"), "utf8"));
const timing = JSON.parse(readFileSync(path.join(root, "src/data/timing.json"), "utf8"));
const LEAD = 24, GAP = 12, TAIL = 30, OVERLAP = 18;
let cursor = 0;
const scenes = narration.scenes.map((s) => {
  const t = timing.scenes.find((x) => x.id === s.id);
  let local = LEAD;
  s.beats.forEach((b, i) => {
    const tb = t.beats.find((x) => x.id === b.id);
    local += Math.ceil(tb.seconds * 30) + (i < s.beats.length - 1 ? GAP : 0);
  });
  const dur = local + TAIL;
  const sc = { id: s.id, from: cursor, dur };
  cursor += dur - OVERLAP;
  return sc;
});

for (const s of scenes) {
  if (ids && !ids.includes(s.id)) continue;
  for (const fr of fracs) {
    const frame = Math.min(comp.durationInFrames - 1, s.from + Math.round(s.dur * fr));
    const output = path.join(outDir, `${s.id}_${String(Math.round(fr * 100)).padStart(3, "0")}.jpg`);
    await renderStill({ composition: comp, serveUrl, output, frame, imageFormat: "jpeg", jpegQuality: 80, browserExecutable: "/opt/pw-browsers/chromium", scale: 0.5 });
    console.log(output);
  }
}
