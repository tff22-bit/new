import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, polyPoint, prog } from "../components/anim";
import { Conn, FlowDot, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { Card, Chip, IconBadge, Phase, Reveal, Takeaway, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const stages: { label: string; icon: IconName; cue: string }[] = [
  { label: "التعليم العام", icon: "book", cue: "التعليم العام" },
  { label: "التعليم العالي", icon: "student", cue: "والتعليم العالي" },
  { label: "المهني والتقني", icon: "tool", cue: "المهني" },
  { label: "التعلم مدى الحياة", icon: "refresh", cue: "مدى الحياة" },
];
const parties: { label: string; icon: IconName; cue: string }[] = [
  { label: "الجهات التعليمية والتدريبية", icon: "building", cue: "الجهات التعليمية" },
  { label: "الموردون والمطورون", icon: "code", cue: "والموردين" },
  { label: "الممارسون", icon: "teacher", cue: "والممارسين" },
  { label: "المتعلمون", icon: "student", cue: "والمتعلمين" },
  { label: "جهات التنظيم والإشراف", icon: "eye", cue: "وجهات التنظيم" },
];
const factors: { label: string; icon: IconName }[] = [
  { label: "المهمة", icon: "target" },
  { label: "الفئة المستفيدة", icon: "users" },
  { label: "البيانات", icon: "database" },
  { label: "الصلاحيات", icon: "key" },
  { label: "الأثر", icon: "chart" },
];

export const S03Scope: React.FC = () => {
  const f = useCurrentFrame();
  const { c, end } = useCues();
  const lift = prog(f, c(2), 30, easeInOut);
  const pts = [{ x: 1640, y: 470 }, { x: 280, y: 470 }];
  const travel = prog(f, c(1), c(1, "مدى الحياة") - c(1) + 20, easeInOut);
  return (
    <SceneShell>
      <Phase at={0} out={c(3) - 10}>
        {/* مسار رحلة التعلم */}
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${-lift * 160}px) scale(${1 - lift * 0.18})`, transformOrigin: "50% 30%" }}>
          <Svg>
            <Conn d="M 1640 470 L 280 470" at={c(1)} dur={c(1, "مدى الحياة") - c(1) + 20} color={C.cyanSoft} width={8} />
            {travel > 0 && travel < 1 && <FlowDot point={polyPoint(pts, travel)} r={10} />}
          </Svg>
          {stages.map((s, i) => {
            const x = lerp(1560, 360, i / 3);
            return (
              <Reveal key={i} at={c(1, s.cue)} kind="scale" style={{ left: x - 120, top: 470 - 64, width: 240, textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <IconBadge name={s.icon} size={128} round bg="#fff" />
                </div>
                <Text size={32} weight={700} style={{ marginTop: 16 }}>{s.label}</Text>
              </Reveal>
            );
          })}
        </div>
        {/* القطاعات */}
        <Reveal at={c(2)} kind="up" style={{ left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 28 }}>
          {["حكومية", "خاصة", "غير ربحية"].map((s) => (
            <Chip key={s} icon="building" label={`جهات ${s}`} size={28} />
          ))}
        </Reveal>
        {/* الفئات المستهدفة */}
        {parties.map((p, i) => (
          <Reveal key={i} at={c(2, p.cue)} kind="up" style={{ left: 1490 - i * 300, top: 720, width: 270 }}>
            <Card style={{ width: 270, height: 170, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center", padding: 16 }}>
              <Icon name={p.icon} size={50} color={C.turquoiseDark} />
              <Text size={26} weight={600}>{p.label}</Text>
            </Card>
          </Reveal>
        ))}
      </Phase>

      {/* معايير مشتركة… وتطبيق مختلف */}
      <Phase at={c(3)} out={c(4) - 10}>
        <Reveal at={c(3)} kind="right" style={{ left: 1300, top: 430, width: 340 }}>
          <Card tone="cyan" style={{ width: 340, padding: 30, textAlign: "center", border: `2px solid ${C.turquoise}` }}>
            <Icon name="doc" size={64} color={C.teal} />
            <Text size={32} weight={700} style={{ marginTop: 8 }}>معايير مشتركة</Text>
            <Text size={24} color={C.muted}>بين القطاعات</Text>
          </Card>
        </Reveal>
        <Svg>
          {factors.map((_, i) => {
            const y = 290 + i * 135;
            return <Conn key={i} d={`M 1290 540 C 1150 540 1150 ${y} 1020 ${y}`} at={c(3, "لكن") + i * 6} dur={20} color={C.cyanSoft} />;
          })}
          {factors.map((_, i) => {
            const y = 290 + i * 135;
            return <Conn key={`b${i}`} d={`M 720 ${y} L 560 ${y}`} at={c(3, "لكن") + 30 + i * 6} dur={14} color={C.lineStrong} width={2} arrow={{ x: 560, y, angle: 180 }} />;
          })}
        </Svg>
        {factors.map((fc, i) => {
          const y = 290 + i * 135;
          const lvl = [0.55, 0.8, 0.95, 0.7, 1][i];
          return (
            <React.Fragment key={i}>
              <Reveal at={c(3, "لكن") + 10 + i * 6} kind="right" style={{ left: 730, top: y - 42 }}>
                <Chip icon={fc.icon} label={fc.label} size={28} style={{ width: 230, justifyContent: "flex-start" }} />
              </Reveal>
              <Reveal at={c(3, "لكن") + 40 + i * 6} kind="scale" style={{ left: 470 - 40 * lvl, top: y - 40 * lvl - 6 }}>
                <Icon name="shield" size={80 * lvl + 10} color={C.turquoise} stroke={2} />
              </Reveal>
            </React.Fragment>
          );
        })}
        <Reveal at={c(3, "لكن") + 50} kind="fade" style={{ left: 140, top: 330, width: 260, textAlign: "center" }}>
          <Text size={26} weight={600} color={C.muted}>مستوى حماية يختلف بحسب الاستخدام</Text>
        </Reveal>
      </Phase>

      {/* الممارس داخل حدود الجهة */}
      <Phase at={c(4)}>
        <Practitioner at={c(4)} enterAt={c(4, "لدى الجهة")} labelAt={c(4, "معاملةَ")} />
        <Takeaway at={end(4) - 40} text="ما يفعله الممارس بالوكيل لأداء مهامه لدى الجهة = استخدام مؤسسي" />
      </Phase>
    </SceneShell>
  );
};

const Practitioner: React.FC<{ at: number; enterAt: number; labelAt: number }> = ({ at, enterAt, labelAt }) => {
  const f = useCurrentFrame();
  const move = prog(f, enterAt, 40, easeInOut);
  const lbl = prog(f, labelAt, 20);
  const x = lerp(1500, 1040, move);
  return (
    <>
      <Svg>
        <rect x={420} y={280} width={800} height={560} rx={40} fill={lbl > 0 ? `rgba(139,92,246,${0.07 * lbl})` : "none"} stroke={C.teal} strokeWidth={3} strokeDasharray="14 10" opacity={prog(f, at, 20)} />
      </Svg>
      <Reveal at={at + 4} kind="fade" style={{ left: 470, top: 310 }}>
        <Chip icon="building" label="الجهة" size={28} />
      </Reveal>
      <Reveal at={at + 12} kind="scale" style={{ left: 560, top: 470 }}>
        <IconBadge name="database" size={130} />
        <Text size={24} color={C.muted} style={{ textAlign: "center", marginTop: 10, width: 130 }}>بياناتها وبيانات المتعلمين</Text>
      </Reveal>
      <Reveal at={at} kind="scale" style={{ left: x - 65, top: 470 }}>
        <IconBadge name="teacher" size={130} round bg="#fff" color={C.blue} />
        <Text size={28} weight={700} style={{ textAlign: "center", marginTop: 10, width: 130 }}>الممارس</Text>
      </Reveal>
      <div style={{ position: "absolute", left: 470, top: 760, opacity: lbl, transform: `translateY(${(1 - lbl) * 14}px)` }}>
        <Chip icon="check" label="استخدام مؤسسي" color="#fff" bg={C.teal} size={30} />
      </div>
    </>
  );
};
