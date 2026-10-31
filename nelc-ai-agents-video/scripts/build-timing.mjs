// يبني ملف التوقيت من المدد الفعلية للتعليق الصوتي.
// لكل مشهد ملف صوتي واحد (public/audio/<scene>.mp3) مع توقيت كلماته؛
// تُستخرج بداية كل مقطع من توقيت أول كلمة فيه، فتتزامن الحركة مع النطق الفعلي.
// إن لم يوجد صوت لمشهد ما، تُقدَّر مدده من عدد الكلمات وتُعلَّم بأنها تقديرية.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const narration = JSON.parse(readFileSync(path.join(root, "src/data/narration.json"), "utf8"));
const WORDS_PER_SEC = 2.0; // سرعة تقديرية لسرد عربي معتدل
const EST_GAP = 0.4; // وقفة تقديرية بين المقاطع (ثوانٍ)
const SEP = " "; // يطابق فاصل المقاطع في scripts/tts_edge.py
export const FPS = 30, LEAD = 24, TAIL = 30, OVERLAP = 18;

const probe = (file) =>
  parseFloat(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim(),
  );

let estimated = 0;
const scenes = narration.scenes.map((s) => {
  const rel = `audio/${s.id}.mp3`;
  const abs = path.join(root, "public", rel);
  const wordsFile = path.join(root, "public", `audio/${s.id}.words.json`);
  if (existsSync(abs) && existsSync(wordsFile)) {
    const total = probe(abs);
    const words = JSON.parse(readFileSync(wordsFile, "utf8"));
    // موضع بداية كل مقطع داخل نص المشهد المركّب
    let pos = 0;
    const starts = s.beats.map((b) => {
      const p = pos;
      pos += b.text.length + SEP.length;
      return p;
    });
    const offsets = starts.map((c0) => {
      const w = words.find((x) => x.c >= c0);
      return w ? Math.max(0, w.t - 0.05) : total;
    });
    const beats = s.beats.map((b, i) => {
      const offset = offsets[i];
      const next = i < s.beats.length - 1 ? offsets[i + 1] : total;
      const end = starts[i] + b.text.length;
      const marks = words
        .filter((x) => x.c >= starts[i] && x.c < end)
        .map((x) => ({ t: +(x.t - offset).toFixed(3), c: x.c - starts[i] }));
      return { id: b.id, offset: +offset.toFixed(3), seconds: +(next - offset).toFixed(3), estimated: false, marks };
    });
    return { id: s.id, file: rel, seconds: total, durFrames: LEAD + Math.ceil(total * FPS) + TAIL, beats };
  }
  let t = 0;
  const beats = s.beats.map((b, i) => {
    estimated++;
    const words = b.text.split(/\s+/).filter(Boolean).length;
    const seconds = Math.max(1.5, words / WORDS_PER_SEC) + (i < s.beats.length - 1 ? EST_GAP : 0);
    const beat = { id: b.id, offset: +t.toFixed(3), seconds: +seconds.toFixed(3), estimated: true };
    t += seconds;
    return beat;
  });
  return { id: s.id, file: null, seconds: t, durFrames: LEAD + Math.ceil(t * FPS) + TAIL, beats };
});

const total = scenes.reduce((a, s) => a + s.durFrames, 0) - OVERLAP * (scenes.length - 1);
writeFileSync(
  path.join(root, "src/data/timing.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), estimatedBeats: estimated, totalFrames: total, scenes }, null, 2),
);
console.log(`timing.json: ${scenes.length} scenes, video ${(total / FPS).toFixed(1)}s, estimated beats: ${estimated}`);
