import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

// خلفية هادئة مستمرة عبر الفيديو: تدرج خفيف وشبكة نقاط وبقع ضوء بطيئة الحركة
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const bx = Math.sin(t / 9) * 60;
  const by = Math.cos(t / 11) * 40;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #F7FAFB 55%, ${C.bg2} 100%)` }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          right: -250 + bx,
          top: -350 + by,
          background: `radial-gradient(circle, ${C.cyanLight} 0%, rgba(214,244,247,0) 70%)`,
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          left: -300 - bx,
          bottom: -380 - by,
          background: `radial-gradient(circle, ${C.blueLight} 0%, rgba(220,235,250,0) 70%)`,
          opacity: 0.7,
        }}
      />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
        <defs>
          <pattern id="dots" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform={`translate(${(t * 4) % 36} 0)`}>
            <circle cx="2" cy="2" r="1.3" fill={C.lineStrong} />
          </pattern>
          <radialGradient id="fade" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </radialGradient>
          <mask id="dotmask">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" mask="url(#dotmask)" />
      </svg>
    </AbsoluteFill>
  );
};
