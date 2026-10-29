import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, shadow } from "../theme";
import { easeOut, prog, pulse } from "./anim";
import { Icon, type IconName } from "./Icon";

type Kind = "up" | "down" | "right" | "left" | "scale" | "fade" | "blur";

// يُظهر العنصر عند إطار معين بحركة هادئة محكومة (نابض مُخمَّد بلا ارتداد)
export const useAppear = (at: number, damping = 200, durationInFrames?: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, mass: 0.9, stiffness: 110 }, durationInFrames });
};

export const Reveal: React.FC<{
  at: number;
  kind?: Kind;
  dist?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  out?: number; // إطار الاختفاء (اختياري)
}> = ({ at, kind = "up", dist = 28, style, children, out }) => {
  const f = useCurrentFrame();
  const p = useAppear(at);
  const o = out !== undefined ? 1 - prog(f, out, 14) : 1;
  if (p <= 0.001) return null;
  let transform = "";
  if (kind === "up") transform = `translateY(${(1 - p) * dist}px)`;
  if (kind === "down") transform = `translateY(${-(1 - p) * dist}px)`;
  if (kind === "right") transform = `translateX(${(1 - p) * dist}px)`;
  if (kind === "left") transform = `translateX(${-(1 - p) * dist}px)`;
  if (kind === "scale") transform = `scale(${0.86 + 0.14 * p})`;
  const filter = kind === "blur" ? `blur(${(1 - p) * 8}px)` : undefined;
  return <div style={{ position: "absolute", opacity: Math.min(1, p * 1.3) * o, transform, filter, ...style }}>{children}</div>;
};

export const Card: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  accent?: string;
  highlight?: number; // 0..1 إبراز
  tone?: "white" | "soft" | "cyan" | "alert" | "ok";
}> = ({ style, children, accent, highlight = 0, tone = "white" }) => {
  const bg = { white: C.surface, soft: "#F6FAFB", cyan: "#EEFAFB", alert: C.alertLight, ok: C.okLight }[tone];
  const ring = accent ?? C.turquoise;
  return (
    <div
      style={{
        background: bg,
        borderRadius: 22,
        boxShadow: highlight > 0 ? `0 0 0 ${3 * highlight}px ${ring}, ${shadow.lift}` : shadow.card,
        border: `1px solid ${highlight > 0 ? "transparent" : C.line}`,
        fontFamily: FONT,
        color: C.charcoal,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const IconBadge: React.FC<{ name: IconName; size?: number; bg?: string; color?: string; round?: boolean }> = ({
  name,
  size = 64,
  bg = C.cyanLight,
  color = C.teal,
  round,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: round ? "50%" : size * 0.3,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Icon name={name} size={size * 0.56} color={color} stroke={1.8} />
  </div>
);

export const Chip: React.FC<{ icon?: IconName; label: string; color?: string; bg?: string; size?: number; style?: React.CSSProperties }> = ({
  icon,
  label,
  color = C.teal,
  bg = C.surface,
  size = 26,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: `${size * 0.42}px ${size * 0.85}px`,
      borderRadius: 999,
      background: bg,
      border: `1.5px solid ${C.line}`,
      boxShadow: shadow.card,
      fontFamily: FONT,
      fontSize: size,
      fontWeight: 600,
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {icon && <Icon name={icon} size={size * 1.15} color={color} />}
    {label}
  </div>
);

// العقدة الممثلة للوكيل: نواة مضيئة وحلقة مدارية — نفس الشكل في كل الفيديو
export const AgentCore: React.FC<{ size?: number; label?: string; active?: boolean; dim?: boolean; halted?: boolean; style?: React.CSSProperties }> = ({
  size = 150,
  label,
  active = true,
  dim,
  halted,
  style,
}) => {
  const f = useCurrentFrame();
  const rot = halted ? 0 : (f * 1.2) % 360;
  const glow = active && !halted ? 0.5 + 0.5 * pulse(f, 0, 60) : 0.2;
  const core = halted ? C.faint : C.turquoise;
  return (
    <div style={{ position: "absolute", width: size, height: size, opacity: dim ? 0.45 : 1, ...style }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <radialGradient id={halted ? "coreg-h" : "coreg-a"} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#E9FCFD" />
            <stop offset="100%" stopColor={core} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="49" fill={core} opacity={0.08 + 0.1 * glow} />
        <g transform={`rotate(${rot} 50 50)`}>
          <circle cx="50" cy="50" r="44" fill="none" stroke={core} strokeWidth="1.2" strokeDasharray="3 6" opacity="0.7" />
          <circle cx="50" cy="6" r="3.2" fill={core} />
        </g>
        <rect x="22" y="22" width="56" height="56" rx="17" fill={halted ? "url(#coreg-h)" : "url(#coreg-a)"} />
        <rect x="22" y="22" width="56" height="56" rx="17" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.7" />
        <circle cx="50" cy="50" r={9 + 3 * glow} fill="#fff" opacity="0.92" />
        <circle cx="50" cy="50" r="4.5" fill={halted ? C.muted : C.teal} />
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            top: size + 10,
            left: -80,
            right: -80,
            textAlign: "center",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 28,
            color: C.teal,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

export const Person: React.FC<{
  icon?: IconName;
  label: string;
  sub?: string;
  size?: number;
  color?: string;
  bg?: string;
  style?: React.CSSProperties;
  ring?: number;
}> = ({ icon = "user", label, sub, size = 120, color = C.teal, bg = C.surface, style, ring = 0 }) => (
  <div style={{ position: "absolute", width: size, ...style }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        border: `2px solid ${C.line}`,
        boxShadow: ring > 0 ? `0 0 0 ${8 * ring}px ${color}22, ${shadow.lift}` : shadow.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={icon} size={size * 0.5} color={color} stroke={1.6} />
    </div>
    <div style={{ position: "absolute", top: size + 10, left: -90, right: -90, textAlign: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.charcoal }}>{label}</div>
      {sub && <div style={{ fontSize: 22, fontWeight: 500, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

// شريط الخلاصة في أسفل المشهد
export const Takeaway: React.FC<{ at: number; text: string; icon?: IconName; y?: number }> = ({ at, text, icon = "bulb", y = 948 }) => {
  const p = useAppear(at);
  const f = useCurrentFrame();
  const line = prog(f, at + 6, 26);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          background: C.teal,
          color: "#fff",
          fontFamily: FONT,
          fontSize: 32,
          fontWeight: 600,
          padding: "18px 38px",
          borderRadius: 999,
          boxShadow: shadow.lift,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Icon name={icon} size={36} color={C.cyanSoft} stroke={2} />
        <span>{text}</span>
        <div style={{ position: "absolute", bottom: 0, right: 0, height: 4, width: `${line * 100}%`, background: C.turquoise }} />
      </div>
    </div>
  );
};

export const ExampleTag: React.FC<{ at: number; text?: string; style?: React.CSSProperties }> = ({ at, text = "مثال توضيحي", style }) => (
  <Reveal at={at} kind="fade" style={style}>
    <div
      style={{
        fontFamily: FONT,
        fontSize: 22,
        fontWeight: 600,
        color: C.blue,
        background: C.blueLight,
        padding: "6px 18px",
        borderRadius: 999,
        border: `1px dashed ${C.blue}`,
      }}
    >
      {text}
    </div>
  </Reveal>
);

export const Text: React.FC<{ size?: number; weight?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 30,
  weight = 500,
  color = C.charcoal,
  style,
  children,
}) => <div style={{ fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: 1.45, ...style }}>{children}</div>;

// شرطة إبراز تُرسم تحت كلمة أو عنصر
export const Underline: React.FC<{ at: number; width: number; color?: string; style?: React.CSSProperties }> = ({ at, width, color = C.turquoise, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 20, easeOut);
  return <div style={{ position: "absolute", height: 6, borderRadius: 3, background: color, width: width * p, right: 0, ...style }} />;
};

// مرحلة داخل المشهد: تظهر وتختفي بنعومة مع انزياح خفيف (بدل تبديل الشرائح)
export const Phase: React.FC<{ at: number; out?: number; children: React.ReactNode; drift?: number }> = ({ at, out, children, drift = 40 }) => {
  const f = useCurrentFrame();
  const i = prog(f, at, 22);
  const o = out !== undefined ? prog(f, out, 20) : 0;
  if (i <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: i * (1 - o), transform: `translateX(${-o * drift}px)` }}>{children}</div>
  );
};
