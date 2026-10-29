// يمنع التصيير النهائي إذا كان أي مقطع بلا سرد صوتي فعلي
import { readFileSync } from "node:fs";
const t = JSON.parse(readFileSync(new URL("../src/data/timing.json", import.meta.url), "utf8"));
const missing = t.scenes.flatMap((s) => s.beats.filter((b) => b.estimated).map((b) => `${s.id}_${b.id}`));
if (missing.length) {
  console.error(`Narration missing for ${missing.length} beats (e.g. ${missing.slice(0, 5).join(", ")}).`);
  console.error("Generate audio with scripts/tts.py, then run `npm run timing`. Refusing to render a silent video.");
  process.exit(1);
}
console.log("All beats have narration audio.");
