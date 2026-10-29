import React, { createContext, useContext } from "react";
import type { BeatT, SceneT } from "./timeline";

const Ctx = createContext<SceneT | null>(null);

export const SceneProvider: React.FC<{ scene: SceneT; children: React.ReactNode }> = ({ scene, children }) => (
  <Ctx.Provider value={scene}>{children}</Ctx.Provider>
);

export const useScene = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useScene outside SceneProvider");
  return s;
};

// موضع عبارة داخل مقطع السرد بالإطارات.
// إن توفرت علامات الكلمات من مزوّد الصوت تُستخدم، وإلا يُقدَّر الموضع بنسبة الحروف.
const cueInBeat = (beat: BeatT, phrase?: string) => {
  if (!phrase) return beat.start;
  const idx = beat.text.indexOf(phrase);
  if (idx < 0) {
    console.warn(`cue not found in ${beat.id}: ${phrase}`);
    return beat.start;
  }
  if (beat.marks && beat.marks.length > 0) {
    let best = beat.marks[0];
    for (const m of beat.marks) if (m.c <= idx) best = m;
    return beat.start + Math.round(best.t * 30);
  }
  return beat.start + Math.round((idx / beat.text.length) * beat.dur);
};

export const useCues = () => {
  const scene = useScene();
  // c(رقم المقطع يبدأ من 1، عبارة اختيارية) → إطار محلي
  const c = (n: number, phrase?: string) => {
    const beat = scene.beats[n - 1];
    if (!beat) throw new Error(`${scene.id} has no beat ${n}`);
    return cueInBeat(beat, phrase);
  };
  const end = (n: number) => {
    const beat = scene.beats[n - 1];
    return beat.start + beat.dur;
  };
  return { c, end, scene };
};
