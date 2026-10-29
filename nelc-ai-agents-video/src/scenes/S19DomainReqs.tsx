import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, prog } from "../components/anim";
import { DOMAINS } from "../data/domains";
import { Card, IconBadge, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const pos = (i: number) => ({ x: 1450 - (i % 4) * 405, y: 380 + Math.floor(i / 4) * 300 });
const TW = 380, TH = 270;

export const S19DomainReqs: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const flipAt = [
    c(2, "ففي التدريس"), c(2, "وفي التعلم"), c(3, "وفي التقويم"), c(3, "وفي الإرشاد"),
    c(4, "وفي المحتوى"), c(4, "وفي البحث"), c(4, "وفي الخدمات"), c(4, "وفي الحوكمة"),
  ];
  return (
    <SceneShell>
      <Reveal at={c(1, "متطلبات خاصة")} kind="fade" style={{ left: 96, top: 120 }}>
        <Text size={26} weight={600} color={C.muted}>الأبعاد السبعة + متطلبات المجال</Text>
      </Reveal>
      {DOMAINS.map((d, i) => {
        const p = pos(i);
        const t = prog(f, flipAt[i], 22, easeInOut);
        const front = t < 0.5;
        const sx = Math.abs(Math.cos(t * Math.PI));
        const current = f >= flipAt[i] && (i === 7 || f < flipAt[i + 1]);
        return (
          <Reveal key={i} at={c(1) + 10 + i * 5} kind="scale" style={{ left: p.x - TW / 2, top: p.y - TH / 2 }}>
            <div style={{ transform: `scaleX(${Math.max(0.02, sx)})` }}>
              {front ? (
                <Card style={{ width: TW, height: TH, padding: 26, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <IconBadge name={d.icon} size={70} />
                  <Text size={29} weight={700}>{d.label}</Text>
                </Card>
              ) : (
                <Card tone="cyan" highlight={current ? 1 : 0} style={{ width: TW, height: TH, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", border: `2px solid ${C.turquoise}` }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <IconBadge name={d.icon} size={46} bg="#fff" />
                    <Text size={21} weight={600} color={C.turquoiseDark}>{d.label}</Text>
                  </div>
                  <Text size={28} weight={700} color={C.teal} style={{ lineHeight: 1.35 }}>{d.req}</Text>
                </Card>
              )}
            </div>
          </Reveal>
        );
      })}
    </SceneShell>
  );
};
