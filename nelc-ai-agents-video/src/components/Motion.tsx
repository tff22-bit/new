import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, shadow } from "../theme";
import { Icon, type IconName } from "./Icon";

// ظهور مرن بارتداد خفيف — أسلوب الموشن جرافيك المسطح السريع
export const usePop = (at: number, out?: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 160, mass: 0.7 } });
  const o = out !== undefined ? spring({ frame: f - out, fps, config: { damping: 200, stiffness: 180 } }) : 0;
  return { p: f < at ? 0 : p, o };
};

export const Pop: React.FC<{ at: number; out?: number; x: number; y: number; children: React.ReactNode; from?: "scale" | "up" | "right" | "left"; rotate?: number }> = ({
  at,
  out,
  x,
  y,
  children,
  from = "scale",
  rotate = 0,
}) => {
  const { p, o } = usePop(at, out);
  if (p <= 0.001 || o >= 0.999) return null;
  const k = Math.min(1, p);
  let t = `translate(-50%, -50%) scale(${(from === "scale" ? p : 1) * (1 - o * 0.3)})`;
  if (from === "up") t += ` translateY(${(1 - p) * 80}px)`;
  if (from === "right") t += ` translateX(${(1 - p) * 140}px)`;
  if (from === "left") t += ` translateX(${-(1 - p) * 140}px)`;
  if (rotate) t += ` rotate(${(1 - p) * rotate}deg)`;
  return <div style={{ position: "absolute", left: x, top: y, transform: t, opacity: k * (1 - o) }}>{children}</div>;
};

// دائرة أيقونة مسطحة بلون ممتلئ
export const Bubble: React.FC<{ icon: IconName; size?: number; color?: string; bg?: string; ring?: boolean }> = ({ icon, size = 120, color = "#fff", bg = C.turquoise, ring }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: ring ? `0 0 0 ${size * 0.09}px ${bg}33, ${shadow.lift}` : shadow.card,
    }}
  >
    <Icon name={icon} size={size * 0.5} color={color} stroke={1.9} />
  </div>
);

// كلمة/عبارة حركية كبيرة
export const Kinetic: React.FC<{ at: number; out?: number; x: number; y: number; text: string; size?: number; color?: string; weight?: number }> = ({
  at,
  out,
  x,
  y,
  text,
  size = 64,
  color = C.teal,
  weight = 700,
}) => (
  <Pop at={at} out={out} x={x} y={y} from="up">
    <div style={{ fontFamily: FONT, fontSize: size, fontWeight: weight, color, whiteSpace: "nowrap", lineHeight: 1.25 }}>{text}</div>
  </Pop>
);

export const Pill: React.FC<{ text: string; icon?: IconName; color?: string; bg?: string; size?: number }> = ({ text, icon, color = "#fff", bg = C.turquoise, size = 30 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: `${size * 0.4}px ${size * 0.9}px`,
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size,
      whiteSpace: "nowrap",
      boxShadow: shadow.card,
    }}
  >
    {icon && <Icon name={icon} size={size * 1.15} color={color} stroke={2} />}
    {text}
  </div>
);

// عدّاد رقمي متصاعد
export const CountUp: React.FC<{ at: number; dur: number; to: number; size?: number; color?: string }> = ({ at, dur, to, size = 160, color = C.turquoise }) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [at, at + dur], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return <div style={{ fontFamily: FONT, fontSize: size, fontWeight: 700, color, lineHeight: 1 }}>{v}</div>;
};
