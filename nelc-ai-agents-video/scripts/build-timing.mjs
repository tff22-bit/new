// يبني ملف التوقيت من المدد الفعلية لملفات الصوت.
// إن لم يوجد ملف صوتي لمقطع ما، تُقدَّر مدته من عدد الكلمات وتُعلَّم بأنها تقديرية.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const narration = JSON.parse(readFileSync(path.join(root, "src/data/narration.json"), "utf8"));
const WORDS_PER_SEC = 2.0; // سرعة تقديرية لسرد عربي معتدل

const probe = (file) =>
  parseFloat(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim(),
  );

let estimated = 0;
const scenes = narration.scenes.map((s) => ({
  id: s.id,
  beats: s.beats.map((b) => {
    const rel = `audio/${s.id}_${b.id}.mp3`;
    const abs = path.join(root, "public", rel);
    if (existsSync(abs)) {
      const marksFile = abs.replace(/\.mp3$/, ".marks.json");
      const marks = existsSync(marksFile) ? JSON.parse(readFileSync(marksFile, "utf8")) : undefined;
      return { id: b.id, file: rel, seconds: probe(abs), estimated: false, marks };
    }
    estimated++;
    const words = b.text.split(/\s+/).filter(Boolean).length;
    return { id: b.id, file: null, seconds: Math.max(1.5, words / WORDS_PER_SEC), estimated: true };
  }),
}));

const total = scenes.flatMap((s) => s.beats).reduce((a, b) => a + b.seconds, 0);
writeFileSync(path.join(root, "src/data/timing.json"), JSON.stringify({ generatedAt: new Date().toISOString(), estimatedBeats: estimated, scenes }, null, 2));
console.log(`timing.json: ${scenes.length} scenes, narration ${total.toFixed(1)}s, estimated beats: ${estimated}`);
