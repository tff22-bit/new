// نظام التصميم: ألوان وخطوط ومقاسات موحّدة لكل المشاهد.
export const C = {
  bg: "#F3F7F9",
  bg2: "#EAF3F6",
  surface: "#FFFFFF",
  cyanLight: "#D6F4F7",
  cyanSoft: "#A9E6EC",
  turquoise: "#22B3BF",
  turquoiseDark: "#178E99",
  blue: "#5A9BD8",
  blueLight: "#DCEBFA",
  teal: "#0D5C68",
  charcoal: "#22313A",
  muted: "#64777F",
  faint: "#9AAAB1",
  line: "#D3E2E7",
  lineStrong: "#B5CDD4",
  alert: "#D9786B",
  alertLight: "#FBE7E3",
  ok: "#2BA88C",
  okLight: "#DDF3EC",
} as const;

export const FONT = "'IBM Plex Sans Arabic', sans-serif";

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const shadow = {
  card: "0 10px 30px rgba(13, 92, 104, 0.08), 0 2px 6px rgba(13, 92, 104, 0.05)",
  lift: "0 18px 44px rgba(13, 92, 104, 0.14), 0 4px 10px rgba(13, 92, 104, 0.06)",
  glow: (c: string) => `0 0 0 6px ${c}22, 0 12px 34px ${c}44`,
};
