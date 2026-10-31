import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { SceneProvider } from "./SceneContext";
import { TIMELINE } from "./timeline";
import { C, FONT } from "./theme";
import { Background } from "./components/Background";
import { SCENES } from "./scenes";
import { loadFonts } from "./fonts";

loadFonts();

// شريط تقدم رفيع مقسم إلى فصول، يساعد المشاهد على معرفة موقعه
const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const total = TIMELINE.total;
  return (
    <div style={{ position: "absolute", left: 72, right: 96, bottom: 18, height: 4, display: "flex", flexDirection: "row-reverse", gap: 4 }}>
      {TIMELINE.scenes.map((s) => {
        const w = s.dur / total;
        const p = Math.max(0, Math.min(1, (f - s.from) / s.dur));
        return (
          <div key={s.id} style={{ flex: w, background: C.line, borderRadius: 2, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: C.turquoise }} />
          </div>
        );
      })}
    </div>
  );
};

// انتقال سريع بين المشاهد: شريط بنفسجي مائل يعبر الشاشة من اليمين إلى اليسار
const Sweep: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const t = (f - at) / 18;
  if (t < 0 || t > 1) return null;
  const x = 2300 - t * 3000;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: -200, left: x, width: 520, height: 1480, transform: "skewX(-18deg)", background: `linear-gradient(90deg, ${C.cyanSoft}00, ${C.cyanSoft}cc 40%, ${C.turquoise}aa 60%, ${C.cyanSoft}00)` }} />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT, direction: "rtl" }}>
    <Background />
    {TIMELINE.scenes.map((s) => {
      const Comp = SCENES[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={`${s.id} · ${s.title}`}>
          <SceneProvider scene={s}>{Comp ? <Comp /> : null}</SceneProvider>
        </Sequence>
      );
    })}
    {TIMELINE.scenes.slice(1).map((s) => (
      <Sweep key={`sw-${s.id}`} at={s.from - 4} />
    ))}
    <Progress />
  </AbsoluteFill>
);
