import { Easing, interpolate } from "remotion";

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeStd = Easing.bezier(0.25, 0.1, 0.25, 1);

// تقدّم من 0 إلى 1 بين إطارين
export const prog = (frame: number, start: number, dur = 18, easing = easeOut) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// نبضة هادئة متكررة 0..1 تبدأ من إطار معين
export const pulse = (frame: number, start: number, period = 45) =>
  frame < start ? 0 : 0.5 - 0.5 * Math.cos(((frame - start) / period) * Math.PI * 2);

// نقاط على منحنيات بيزييه لتحريك عناصر على مسار بدقة
export type P = { x: number; y: number };
export const quad = (a: P, c: P, b: P, t: number): P => ({
  x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
  y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
});
export const cubic = (a: P, c1: P, c2: P, b: P, t: number): P => {
  const u = 1 - t;
  return {
    x: u ** 3 * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t ** 3 * b.x,
    y: u ** 3 * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t ** 3 * b.y,
  };
};
export const polyPoint = (pts: P[], t: number): P => {
  const segs = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = segs.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const k = segs[i] === 0 ? 0 : d / segs[i];
      return { x: lerp(pts[i].x, pts[i + 1].x, k), y: lerp(pts[i].y, pts[i + 1].y, k) };
    }
    d -= segs[i];
  }
  return pts[pts.length - 1];
};
export const polyPath = (pts: P[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
