// يتحقق من أن كل عبارة مستخدمة في c(n, "...") موجودة في نص المقطع المقابل
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const narr = JSON.parse(readFileSync(path.join(root, "src/data/narration.json"), "utf8"));
let bad = 0;
for (const file of readdirSync(path.join(root, "src/scenes"))) {
  const m = file.match(/^S(\d\d)/);
  if (!m) continue;
  const scene = narr.scenes.find((s) => s.id === `s${m[1]}`);
  const src = readFileSync(path.join(root, "src/scenes", file), "utf8");
  for (const [, n, phrase] of src.matchAll(/c\((\d+), "([^"]+)"\)/g)) {
    const beat = scene.beats[Number(n) - 1];
    if (!beat || !beat.text.includes(phrase)) {
      bad++;
      console.log(`${file}: beat ${n} missing «${phrase}»`);
    }
  }
}
console.log(bad ? `${bad} broken cues` : "all cues OK");
process.exit(bad ? 1 : 0);
