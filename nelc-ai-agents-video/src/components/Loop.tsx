import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { Conn, FlowDot, Svg } from "./Draw";
import { Icon, type IconName } from "./Icon";
import { Card, Reveal } from "./UI";

export type LoopNode = { label: string; sub?: string; icon: IconName; at: number; who?: string; tone?: "agent" | "human" };

const rad = (d: number) => (d * Math.PI) / 180;

// مخطط دائري لدورة عمل: عقد متصلة بأقواس تُرسم تدريجيًا ونقطة تدور لتمثيل التكرار
export const Loop: React.FC<{
  cx: number;
  cy: number;
  r: number;
  nodes: LoopNode[];
  arcAt: number[];
  flowFrom?: number;
  flowUntil?: number;
  startAngle?: number;
  cardW?: number;
  cardH?: number;
  gapDeg?: number;
  highlight?: (i: number) => number;
  color?: string;
  center?: React.ReactNode;
}> = ({ cx, cy, r, nodes, arcAt, flowFrom, flowUntil, startAngle = -90, cardW = 260, cardH = 150, gapDeg = 26, highlight, color = C.turquoise, center }) => {
  const f = useCurrentFrame();
  const n = nodes.length;
  const step = 360 / n;
  // في الاتجاه العربي تسير الدورة عكس عقارب الساعة (من اليمين إلى اليسار في الأعلى)
  const ang = (i: number) => startAngle - step * i;
  const pt = (a: number) => ({ x: cx + Math.cos(rad(a)) * r, y: cy + Math.sin(rad(a)) * r });
  const period = 150;
  const flowing = flowFrom !== undefined && f >= flowFrom && (flowUntil === undefined || f < flowUntil);
  const dotA = flowFrom !== undefined ? startAngle - (((f - flowFrom) / period) * 360) % 360 : 0;
  return (
    <>
      <Svg>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.line} strokeWidth={1} strokeDasharray="2 8" opacity={arcAt[0] !== undefined && f > arcAt[0] ? 1 : 0} />
        {nodes.map((_, i) => {
          if (arcAt[i] === undefined) return null;
          const a1 = ang(i) - gapDeg;
          const a2 = ang(i + 1) + gapDeg;
          const p1 = pt(a1);
          const p2 = pt(a2);
          const d = `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 0 ${p2.x} ${p2.y}`;
          return <Conn key={i} d={d} at={arcAt[i]} dur={22} color={color} width={3.5} arrow={{ x: p2.x, y: p2.y, angle: a2 - 90 }} />;
        })}
        {flowing && <FlowDot point={pt(dotA)} r={7} color={color} />}
      </Svg>
      {center}
      {nodes.map((nd, i) => {
        const p = pt(ang(i));
        const hl = highlight ? highlight(i) : 0;
        const human = nd.tone === "human";
        return (
          <Reveal key={i} at={nd.at} kind="scale" style={{ left: p.x - cardW / 2, top: p.y - cardH / 2, width: cardW, height: cardH }}>
            <Card
              highlight={hl}
              accent={human ? C.blue : color}
              tone={human ? "white" : "white"}
              style={{ width: cardW, height: cardH, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, textAlign: "center" }}
            >
              {nd.who && <div style={{ fontSize: 20, fontWeight: 600, color: human ? C.blue : C.turquoiseDark }}>{nd.who}</div>}
              <Icon name={nd.icon} size={44} color={human ? C.blue : C.turquoiseDark} />
              <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.charcoal, lineHeight: 1.25 }}>{nd.label}</div>
              {nd.sub && <div style={{ fontSize: 21, color: C.muted, lineHeight: 1.3 }}>{nd.sub}</div>}
            </Card>
          </Reveal>
        );
      })}
    </>
  );
};
