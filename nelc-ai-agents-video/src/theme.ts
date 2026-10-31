// نظام التصميم: ألوان وخطوط ومقاسات موحّدة لكل المشاهد.
export const C = {
  // لوحة بنفسجية فاتحة مع لون مكمّل (أزرق سماوي) ونعناعي للتأكيد الإيجابي
  bg: "#F7F4FE",
  bg2: "#EFE9FD",
  surface: "#FFFFFF",
  cyanLight: "#ECE5FE",
  cyanSoft: "#CDBBFA",
  turquoise: "#8B5CF6",
  turquoiseDark: "#6D3FD9",
  blue: "#4C8DF0",
  blueLight: "#E1ECFD",
  teal: "#3B1E7A",
  charcoal: "#2A2140",
  muted: "#6E6689",
  faint: "#A69DBD",
  line: "#E6DEF7",
  lineStrong: "#CFC2F0",
  alert: "#E46A7E",
  alertLight: "#FCE7EB",
  ok: "#25AE8C",
  okLight: "#DDF5EE",
} as const;

export const FONT = "'IBM Plex Sans Arabic', sans-serif";

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const shadow = {
  card: "0 10px 30px rgba(59, 30, 122, 0.08), 0 2px 6px rgba(59, 30, 122, 0.05)",
  lift: "0 18px 44px rgba(59, 30, 122, 0.14), 0 4px 10px rgba(59, 30, 122, 0.06)",
  glow: (c: string) => `0 0 0 6px ${c}22, 0 12px 34px ${c}44`,
};
