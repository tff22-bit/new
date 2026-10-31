// يتحقق من أن كل عبارة مستخدمة في c(n, "...") موجودة في نص المقطع المقابل
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const narr = JSON.parse(readFileSync(path.join(root, "src/data/narration.json"), "utf8"));
const DIAC = /[\u064B-\u0652\u0670\u0640]/g;
let bad = 0;
const files = [
  ...readdirSync(path.join(root, "src/scenes")).map((f) => ["src/scenes", f]),
  ...readdirSync(path.join(root, "src/scenes/short")).map((f) => ["src/scenes/short", f]),
];
for (const [dir, file] of files) {
  const m = file.match(/^([SQ])(\d\d)/);
  if (!m) continue;
  const scene = narr.scenes.find((s) => s.id === `${m[1].toLowerCase()}${m[2]}`);
  if (!scene) continue; // مشهد غير مستخدم في النسخة الحالية
  const src = readFileSync(path.join(root, dir, file), "utf8");
  for (const [, n, phrase] of src.matchAll(/c\((\d+), "([^"]+)"\)/g)) {
    const beat = scene.beats[Number(n) - 1];
    if (!beat || !beat.text.replace(DIAC, "").includes(phrase.replace(DIAC, ""))) {
      bad++;
      console.log(`${file}: beat ${n} missing «${phrase}»`);
    }
  }
}
console.log(bad ? `${bad} broken cues` : "all cues OK");
process.exit(bad ? 1 : 0);
