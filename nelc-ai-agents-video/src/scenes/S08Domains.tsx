import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, Svg } from "../components/Draw";
import { DOMAINS } from "../data/domains";
import { AgentCore, Card, IconBadge, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

export const tilePos = (i: number) => ({ x: 1440 - (i % 4) * 400, y: 300 + Math.floor(i / 4) * 250 });

export const S08Domains: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const cues = ["التدريس", "والتعلم", "والتقويم", "والإرشاد", "والمحتوى", "والبحث", "والخدمات", "والحوكمة"];
  const at = (i: number) => (i < 4 ? c(2, cues[i]) : c(3, cues[i]));
  const zoomAt = c(4, "ففي التقويم");
  const multiAt = c(4, "وقد يندرج");
  // الشبكة تصغر وتتحرك للأعلى لإفساح المجال لمثال التقويم
  const z = prog(f, zoomAt - 10, 30, easeInOut);
  return (
    <SceneShell>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-z * 90}px) scale(${1 - z * 0.28})`, transformOrigin: "50% 20%" }}>
        {DOMAINS.map((d, i) => {
          const p = tilePos(i);
          const focus = f >= zoomAt && f < multiAt ? (i === 2 ? 1 : 0) : f >= multiAt ? (i === 1 || i === 2 ? 1 : 0) : 0;
          const dim = f >= zoomAt && focus === 0 ? 0.4 : 1;
          return (
            <Reveal key={i} at={at(i)} kind="scale" style={{ left: p.x - 180, top: p.y - 100, opacity: dim }}>
              <Card highlight={focus} style={{ width: 360, height: 200, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <IconBadge name={d.icon} size={64} />
                  <Text size={22} weight={700} color={C.faint}>{i + 1}</Text>
                </div>
                <Text size={28} weight={700} style={{ lineHeight: 1.3 }}>{d.label}</Text>
              </Card>
            </Reveal>
          );
        })}
      </div>
      {/* مثال التقويم: من يستخدم ومن يتأثر */}
      <UseVsImpact at={zoomAt} until={multiAt} />
      <Reveal at={multiAt + 10} kind="up" style={{ left: 560, top: 830, width: 800 }}>
        <Card tone="cyan" style={{ padding: "20px 30px", textAlign: "center", border: `2px solid ${C.turquoise}` }}>
          <Text size={28} weight={600} color={C.teal}>استخدام واحد قد يقع في أكثر من مجال ← تُطبَّق متطلبات كل منها</Text>
        </Card>
      </Reveal>
    </SceneShell>
  );
};

const UseVsImpact: React.FC<{ at: number; until: number }> = ({ at, until }) => {
  const f = useCurrentFrame();
  const o = prog(f, at, 20) * (1 - prog(f, until, 20));
  if (o <= 0) return null;
  const t = ((f - at - 30) / 60) % 1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Svg>
        <Conn d="M 1310 800 L 1060 800" at={at + 14} dur={16} color={C.blue} arrow={{ x: 1060, y: 800, angle: 180 }} />
        <Conn d="M 860 800 L 610 800" at={at + 40} dur={16} color={C.turquoise} arrow={{ x: 610, y: 800, angle: 180 }} />
        {f > at + 56 && <circle cx={lerp(860, 610, t)} cy={800} r={7} fill={C.turquoise} />}
      </Svg>
      <Reveal at={at + 4} kind="right" style={{ left: 1330, top: 720, width: 300 }}>
        <IconBadge name="teacher" size={100} round bg="#fff" color={C.blue} />
        <Text size={26} weight={700} style={{ marginTop: 8 }}>يستخدمه</Text>
        <Text size={22} color={C.muted}>الممارس أو جهة التقويم</Text>
      </Reveal>
      <Reveal at={at + 26} kind="scale" style={{ left: 900, top: 740 }}>
        <AgentCore size={120} />
      </Reveal>
      <Reveal at={at + 50} kind="left" style={{ left: 380, top: 720, width: 300 }}>
        <IconBadge name="student" size={100} round bg="#fff" color={C.turquoiseDark} />
        <Text size={26} weight={700} style={{ marginTop: 8 }}>يتأثر به</Text>
        <Text size={22} color={C.muted}>المتعلم — بنتيجة الحكم</Text>
      </Reveal>
    </div>
  );
};
