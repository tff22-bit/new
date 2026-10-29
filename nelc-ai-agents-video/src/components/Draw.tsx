import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../theme";
import { easeInOut, prog, type P } from "./anim";

let uid = 0;
const useUid = (p: string) => React.useMemo(() => `${p}${uid++}`, [p]);

// خط يُرسم تدريجيًا (متصل أو متقطع) مع رأس سهم اختياري يظهر عند اكتمال الرسم
export const Conn: React.FC<{
  d: string;
  at: number;
  dur?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  arrow?: { x: number; y: number; angle: number };
  opacity?: number;
}> = ({ d, at, dur = 24, color = C.turquoise, width = 3, dashed, arrow, opacity = 1 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur, easeInOut);
  const id = useUid("m");
  if (p <= 0) return null;
  const a = prog(f, at + dur * 0.85, 8);
  return (
    <g opacity={opacity}>
      {dashed ? (
        <>
          <defs>
            <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
              <path d={d} pathLength={1} stroke="#fff" strokeWidth={width + 8} fill="none" strokeDasharray="1 1" strokeDashoffset={1 - p} />
            </mask>
          </defs>
          <path d={d} stroke={color} strokeWidth={width} fill="none" strokeDasharray="10 9" strokeLinecap="round" mask={`url(#${id})`} />
        </>
      ) : (
        <path d={d} pathLength={1} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
      )}
      {arrow && a > 0 && (
        <path
          d="M -13 -8 L 0 0 L -13 8"
          transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle}) scale(${0.6 + 0.4 * a})`}
          stroke={color}
          strokeWidth={width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={a}
        />
      )}
    </g>
  );
};

// نقطة مضيئة تتحرك على مسار (تُظهر اتجاه التدفق)
export const FlowDot: React.FC<{ point: P; r?: number; color?: string; opacity?: number }> = ({ point, r = 8, color = C.turquoise, opacity = 1 }) => (
  <g opacity={opacity}>
    <circle cx={point.x} cy={point.y} r={r * 2.2} fill={color} opacity={0.18} />
    <circle cx={point.x} cy={point.y} r={r} fill={color} />
    <circle cx={point.x} cy={point.y} r={r * 0.4} fill="#fff" />
  </g>
);

export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
    {children}
  </svg>
);

export const angleOf = (a: P, b: P) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
