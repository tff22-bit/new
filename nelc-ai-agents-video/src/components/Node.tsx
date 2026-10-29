import React from "react";
import { C, FONT } from "../theme";
import { Icon, type IconName } from "./Icon";
import { Card, Reveal } from "./UI";

// صندوق خطوة صغير يُستخدم في مخططات التدفق
export const StepBox: React.FC<{
  at: number;
  x: number; // مركز
  y: number;
  w?: number;
  h?: number;
  label: string;
  icon?: IconName;
  color?: string;
  highlight?: number;
  tone?: "white" | "soft" | "cyan" | "alert" | "ok";
  size?: number;
}> = ({ at, x, y, w = 240, h = 84, label, icon, color = C.turquoiseDark, highlight = 0, tone = "white", size = 27 }) => (
  <Reveal at={at} kind="scale" style={{ left: x - w / 2, top: y - h / 2, width: w, height: h }}>
    <Card tone={tone} highlight={highlight} accent={color} style={{ width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 16px", border: `1.5px solid ${color}55` }}>
      {icon && <Icon name={icon} size={size * 1.3} color={color} />}
      <span style={{ fontFamily: FONT, fontSize: size, fontWeight: 600, color: C.charcoal, lineHeight: 1.2, textAlign: "center" }}>{label}</span>
    </Card>
  </Reveal>
);
