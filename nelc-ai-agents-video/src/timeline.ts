// يحوّل المدد الفعلية لملفات السرد إلى جدول زمني بالإطارات.
// مدة كل مشهد = تمهيد + مجموع مقاطع السرد + فواصل + ذيل؛ لا توجد مدد ثابتة مسبقًا.
import narration from "./data/narration.json";
import timing from "./data/timing.json";
import { FPS } from "./theme";

export const LEAD = 24; // إطارات قبل أول جملة في المشهد
export const GAP = 12; // وقفة طبيعية بين المقاطع
export const TAIL = 30; // إطارات بعد آخر جملة
export const OVERLAP = 18; // تداخل الانتقال بين مشهدين

export type Mark = { t: number; c: number };
export type BeatT = {
  id: string;
  text: string;
  start: number; // إطار محلي داخل المشهد
  dur: number;
  file: string | null;
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
  beats: BeatT[];
};

type TimingBeat = { id: string; file: string | null; seconds: number; estimated: boolean; marks?: Mark[] };
type TimingScene = { id: string; beats: TimingBeat[] };

const timingById = new Map((timing.scenes as TimingScene[]).map((s) => [s.id, s]));

export const buildTimeline = () => {
  let cursor = 0;
  const scenes: SceneT[] = narration.scenes.map((s) => {
    const t = timingById.get(s.id);
    let local = LEAD;
    const beats: BeatT[] = s.beats.map((b, i) => {
      const tb = t?.beats.find((x) => x.id === b.id);
      const seconds = tb?.seconds ?? 3;
      const dur = Math.ceil(seconds * FPS);
      const beat: BeatT = {
        id: b.id,
        text: b.text,
        start: local,
        dur,
        file: tb?.file ?? null,
        estimated: tb?.estimated ?? true,
        marks: tb?.marks,
      };
      local += dur + (i < s.beats.length - 1 ? GAP : 0);
      return beat;
    });
    const dur = local + TAIL;
    const scene: SceneT = {
      id: s.id,
      title: s.title,
      kicker: (s as { kicker?: string }).kicker,
      pages: s.pages,
      from: cursor,
      dur,
      beats,
    };
    cursor += dur - OVERLAP;
    return scene;
  });
  const total = cursor + OVERLAP;
  return { scenes, total };
};

export const TIMELINE = buildTimeline();
