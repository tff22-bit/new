// يحوّل المدد الفعلية لملفات السرد إلى جدول زمني بالإطارات.
// مدة كل مشهد = تمهيد + مجموع مقاطع السرد + فواصل + ذيل؛ لا توجد مدد ثابتة مسبقًا.
import narration from "./data/narration.json";
import timing from "./data/timing.json";
import { FPS } from "./theme";

export const LEAD = 24; // إطارات قبل بداية التعليق في المشهد
export const TAIL = 30; // إطارات بعد نهاية التعليق
export const OVERLAP = 18; // تداخل الانتقال بين مشهدين

export type Mark = { t: number; c: number };
export type BeatT = {
  id: string;
  text: string;
  start: number; // إطار محلي داخل المشهد يبدأ عنده نطق المقطع
  dur: number;
  estimated: boolean;
  marks?: Mark[];
};
export type SceneT = {
  id: string;
  title: string;
  kicker?: string;
  pages: number[];
  from: number; // إطار عام
  dur: number;
  audio: string | null; // ملف التعليق الصوتي للمشهد كاملًا
  beats: BeatT[];
};

type TimingBeat = { id: string; offset: number; seconds: number; estimated: boolean; marks?: Mark[] };
type TimingScene = { id: string; file: string | null; seconds: number; durFrames: number; beats: TimingBeat[] };

const timingById = new Map((timing.scenes as TimingScene[]).map((s) => [s.id, s]));

export const buildTimeline = () => {
  let cursor = 0;
  const scenes: SceneT[] = narration.scenes.map((s) => {
    const t = timingById.get(s.id);
    const beats: BeatT[] = s.beats.map((b) => {
      const tb = t?.beats.find((x) => x.id === b.id);
      return {
        id: b.id,
        text: b.text,
        start: LEAD + Math.round((tb?.offset ?? 0) * FPS),
        dur: Math.max(1, Math.round((tb?.seconds ?? 3) * FPS)),
        estimated: tb?.estimated ?? true,
        marks: tb?.marks,
      };
    });
    const dur = t?.durFrames ?? LEAD + TAIL + beats.reduce((a, b) => a + b.dur, 0);
    const scene: SceneT = {
      id: s.id,
      title: s.title,
      kicker: (s as { kicker?: string }).kicker,
      pages: s.pages,
      from: cursor,
      dur,
      audio: t?.file ?? null,
      beats,
    };
    cursor += dur - OVERLAP;
    return scene;
  });
  const total = cursor + OVERLAP;
  return { scenes, total };
};

export const TIMELINE = buildTimeline();
