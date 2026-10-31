// يولّد النص الكامل للسرد، ولوحة القصة، وجدول التتبع من المصدر الموحد narration.json
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const narr = JSON.parse(readFileSync(path.join(root, "src/data/narration.json"), "utf8"));
const timing = JSON.parse(readFileSync(path.join(root, "src/data/timing.json"), "utf8"));
const vis = JSON.parse(readFileSync(path.join(root, "scripts/storyboard-visuals.json"), "utf8"));
const OVERLAP = 18, FPS = 30;

const sceneDur = (s) => timing.scenes.find((x) => x.id === s.id).durFrames / FPS;
const est = timing.estimatedBeats > 0;
const fmt = (sec) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
const total = narr.scenes.reduce((a, s) => a + sceneDur(s), 0) - (OVERLAP / FPS) * (narr.scenes.length - 1);
const note = est
  ? "> المدد **تقديرية** (لم يُولَّد الصوت بعد). تُحسب المدد الفعلية تلقائيًا من ملفات السرد عبر `npm run timing`."
  : "> المدد محسوبة من المدد الفعلية لملفات السرد.";

// السرد
let script = `# النص الكامل للسرد العربي\n\n${note}\n\n`;
for (const [i, s] of narr.scenes.entries()) {
  script += `## المشهد ${i + 1}: ${s.title}\n\n`;
  for (const b of s.beats) script += `${b.text}\n\n`;
}
writeFileSync(path.join(root, "docs/02-narration-script.md"), script);

// لوحة القصة
let sb = `# لوحة القصة (Storyboard)\n\n${note}\n\nالمدة الإجمالية: **${fmt(total)}** · 1920×1080 · 30 إطارًا/ث\n\n`;
for (const [i, s] of narr.scenes.entries()) {
  const v = vis[s.id];
  sb += `## ${i + 1}. ${s.title}${s.kicker ? ` — ${s.kicker}` : ""}\n\n`;
  sb += `| | |\n|---|---|\n`;
  sb += `| الهدف التعليمي | ${s.objective} |\n| صفحات المصدر | ${s.pages.join("، ")} |\n| المدة | ${fmt(sceneDur(s))}${est ? " (تقديرية)" : ""} |\n`;
  sb += `| النص على الشاشة | ${v.onscreen} |\n| العناصر البصرية | ${v.visual} |\n| الحركة | ${v.motion} |\n\n`;
  sb += `**السرد:**\n\n${s.beats.map((b) => `- ${b.text}`).join("\n")}\n\n`;
}
writeFileSync(path.join(root, "docs/03-storyboard.md"), sb);

// التتبع
const stdOf = (p) => {
  const map = [[13, "م1"], [14, "م2"], [15, "م3"], [16, "م4"], [17, "م5"], [18, "م6"], [19, "م7"], [20, "م8"], [21, "م9"], [22, "م10"], [23, "م11"], [24, "م12"], [25, "م13"], [26, "م14"], [27, "م15"], [28, "م16"], [29, "م17"], [30, "م18"], [31, "م18"], [32, "م19"], [33, "م20"], [34, "م21"], [35, "م22"], [36, "م23"], [38, "مجال 1"], [39, "مجال 2"], [40, "مجال 3"], [41, "مجال 4"], [42, "مجال 5"], [43, "مجال 6"], [44, "مجال 7"], [45, "مجال 8"]];
  const m = map.find(([pg]) => pg === p);
  return m ? m[1] : "";
};
let tr = `# جدول التتبع: من المصدر إلى المشهد\n\nكل جملة سرد مرتبطة بصفحة (أو صفحات) الوثيقة التي تستند إليها، وبالمعيار عند الانطباق.\n\n| المشهد | المقطع | الصفحات | المعيار/المجال | نص السرد |\n|---|---|---|---|---|\n`;
for (const [i, s] of narr.scenes.entries())
  for (const b of s.beats) {
    const stds = [...new Set(b.pages.map(stdOf).filter(Boolean))].join("، ");
    tr += `| ${i + 1}. ${s.title} | ${b.id} | ${b.pages.join("، ")} | ${stds || "—"} | ${b.text.replace(/\|/g, "\\|")} |\n`;
  }
writeFileSync(path.join(root, "docs/04-traceability.md"), tr);
console.log(`docs written; total ${fmt(total)}${est ? " (estimated)" : ""}`);
