import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useScene } from "../SceneContext";
import { C, FONT } from "../theme";
import { easeOut, prog } from "./anim";

// يختصر أرقام الصفحات المتتالية إلى نطاقات: 37–45
const pageRanges = (pages: number[]) => {
  const sorted = [...new Set(pages)].sort((a, b) => a - b);
  const out: string[] = [];
  for (let i = 0; i < sorted.length; i++) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    out.push(j > i + 1 ? `${sorted[i]}–${sorted[j]}` : j === i + 1 ? `${sorted[i]}، ${sorted[j]}` : `${sorted[i]}`);
    i = j;
  }
  return out.join("، ");
};

const DIM_SCENES = ["s12", "s13", "s14", "s15", "s16", "s17", "s18"];

// خريطة مصغرة للأبعاد السبعة تُظهر موقع المشاهد الحالي من الإطار
const DimensionMap: React.FC<{ active: number }> = ({ active }) => {
  const f = useCurrentFrame();
  const p = prog(f, 10, 24);
  const r = 34;
  return (
    <div style={{ position: "absolute", left: 72, top: 58, opacity: p, display: "flex", alignItems: "center", gap: 18 }}>
      <svg width={92} height={92} viewBox="-46 -46 92 92">
        <circle r={r} fill="none" stroke={C.line} strokeWidth={1.5} />
        {Array.from({ length: 7 }).map((_, i) => {
          const a = (-90 + (360 / 7) * i) * (Math.PI / 180);
          const on = i === active;
          return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={on ? 9 : 5} fill={on ? C.turquoise : C.lineStrong} />;
        })}
        <text x={0} y={9} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={C.teal}>
          {active + 1}
        </text>
      </svg>
      <div style={{ fontFamily: FONT, fontSize: 20, color: C.muted, fontWeight: 500, lineHeight: 1.3 }}>
        من 7
        <br />
        أبعاد
      </div>
    </div>
  );
};

export const SceneShell: React.FC<{
  children: React.ReactNode;
  heading?: boolean;
  camera?: (f: number) => { scale?: number; x?: number; y?: number };
}> = ({ children, heading = true, camera }) => {
  const scene = useScene();
  const f = useCurrentFrame();
  const inP = prog(f, 0, 20, easeOut);
  const outP = prog(f, scene.dur - 18, 18);
  const cam = camera ? camera(f) : {};
  const dimIdx = DIM_SCENES.indexOf(scene.id);
  const underline = prog(f, 12, 26);
  return (
    <AbsoluteFill style={{ opacity: inP * (1 - outP), fontFamily: FONT, direction: "rtl" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${cam.x ?? 0}px, ${(cam.y ?? 0) + (1 - inP) * 18}px) scale(${(cam.scale ?? 1) * (1 - outP * 0.02)})`,
          transformOrigin: "50% 50%",
          filter: inP < 1 ? `blur(${(1 - inP) * 6}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
      {heading && (
        <div style={{ position: "absolute", right: 96, top: 56, textAlign: "right" }}>
          {scene.kicker && (
            <div
              style={{
                display: "inline-block",
                fontSize: 22,
                fontWeight: 600,
                color: C.turquoiseDark,
                background: C.cyanLight,
                borderRadius: 999,
                padding: "5px 18px",
                marginBottom: 10,
                opacity: prog(f, 4, 16),
              }}
            >
              {scene.kicker}
            </div>
          )}
          <div style={{ fontSize: 56, fontWeight: 700, color: C.teal, lineHeight: 1.2, opacity: prog(f, 6, 18), transform: `translateX(${(1 - prog(f, 6, 22)) * 30}px)` }}>
            {scene.title}
          </div>
          <div style={{ height: 5, width: 120 * underline, background: C.turquoise, borderRadius: 3, marginTop: 14, marginRight: 0 }} />
        </div>
      )}
      {dimIdx >= 0 && <DimensionMap active={dimIdx} />}
      <div style={{ position: "absolute", left: 72, bottom: 34, fontSize: 19, color: C.faint, fontWeight: 500, opacity: prog(f, 20, 20) }}>
        المصدر: الوثيقة، ص {pageRanges(scene.pages)}
      </div>
      {scene.beats.map((b) =>
        b.file ? (
          <Sequence key={b.id} from={b.start} durationInFrames={b.dur + 6} layout="none">
            <Audio src={staticFile(b.file)} />
          </Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  );
};
