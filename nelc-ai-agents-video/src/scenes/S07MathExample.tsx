import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C, FONT } from "../theme";
import { polyPoint, prog, pulse } from "../components/anim";
import { Conn, FlowDot, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { Card, Chip, ExampleTag, IconBadge, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const XS = [1450, 1110, 770, 430];
const Y = 585;
const CW = 290, CH = 200;

type Step = { who: string; verb: string; sub: string; icon: IconName; human?: boolean };
const STEPS: Step[] = [
  { who: "الوكيل", verb: "يختار", sub: "الخطوة التعليمية التالية", icon: "branch" },
  { who: "الوكيل", verb: "يقدّم الدعم", sub: "شرح أو تلميح أو نشاط", icon: "chat" },
  { who: "الطالب", verb: "يتفاعل", sub: "يحاول الحل ويوضح خطواته", icon: "pencil", human: true },
  { who: "الوكيل", verb: "يراجع", sub: "محاولة الطالب ومدى تقدمه", icon: "check" },
];

export const S07MathExample: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const stepAt = [c(3, "ثم يختار"), c(3, "ويقدّم"), c(4, "فيتفاعل"), c(4, "ثم يراجع")];
  const loopAt = c(4, "ويعدّل");
  const hitl = c(5);
  const decide = c(5, "ثم يواصل");
  const paused = f >= hitl && f < decide + 20;
  // الخطوة النشطة في الدورة (تدور بعد اكتمال البناء وتتوقف عند طلب توجيه المعلم)
  const cycleStart = loopAt + 30;
  const period = 200;
  const cyc = f > cycleStart && !paused ? ((f - cycleStart) % period) / period : -1;
  const active = f < cycleStart ? stepAt.filter((s) => f >= s).length - 1 : cyc < 0 ? 2 : Math.floor(cyc * 4);
  const ret = [
    { x: XS[3], y: Y - CH / 2 }, { x: XS[3], y: Y - CH / 2 - 60 }, { x: XS[0], y: Y - CH / 2 - 60 }, { x: XS[0], y: Y - CH / 2 },
  ];
  return (
    <SceneShell>
      <ExampleTag at={c(1, "المثال")} text="مثال توضيحي من الوثيقة · مساعد تعلّم الرياضيات للمرحلة المتوسطة" style={{ left: 96, top: 80 }} />

      {/* المعلم */}
      <Reveal at={c(2)} kind="down" style={{ left: 280, top: 222, width: 1360 }}>
        <Card style={{ width: 1360, height: 110, padding: "0 34px", display: "flex", alignItems: "center", gap: 26 }} highlight={f > c(2) && f < c(3) ? 1 : 0} accent={C.blue}>
          <IconBadge name="teacher" size={70} round bg={C.blueLight} color={C.blue} />
          <Text size={34} weight={700} color={C.blue}>المعلم</Text>
          <div style={{ width: 2, height: 56, background: C.line }} />
          <Reveal at={c(2, "أهداف")} kind="scale" style={{ position: "relative" }}>
            <Chip icon="target" label="أهداف التعلم" size={26} />
          </Reveal>
          <Reveal at={c(2, "وحدود")} kind="scale" style={{ position: "relative" }}>
            <Chip icon="shield" label="حدود المساعدة" size={26} />
          </Reveal>
        </Card>
      </Reveal>

      {/* دورة عمل الوكيل */}
      <Svg>
        {XS.slice(0, 3).map((x, i) => (
          <Conn key={i} d={`M ${x - CW / 2 - 6} ${Y} L ${XS[i + 1] + CW / 2 + 8} ${Y}`} at={stepAt[i + 1] - 6} dur={12} color={C.turquoise} arrow={{ x: XS[i + 1] + CW / 2 + 8, y: Y, angle: 180 }} />
        ))}
        <Conn d={`M ${ret[0].x} ${ret[0].y - 4} L ${ret[1].x} ${ret[1].y} L ${ret[2].x} ${ret[2].y} L ${ret[3].x} ${ret[3].y - 6}`} at={loopAt} dur={30} color={C.turquoise} arrow={{ x: ret[3].x, y: ret[3].y - 6, angle: 90 }} />
        {cyc >= 0 && <FlowDot point={polyPoint([{ x: XS[0], y: Y + CH / 2 + 22 }, { x: XS[3], y: Y + CH / 2 + 22 }], cyc)} r={7} />}
      </Svg>
      <Reveal at={loopAt + 10} kind="fade" style={{ left: 0, right: 0, top: Y - CH / 2 - 108, textAlign: "center" }}>
        <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.turquoiseDark, background: C.bg, padding: "0 14px" }}>يعدّل الخطوة التالية وفق استجابة الطالب</span>
      </Reveal>
      {STEPS.map((s, i) => {
        const on = i === active && f >= stepAt[i];
        return (
          <Reveal key={i} at={stepAt[i]} kind="scale" style={{ left: XS[i] - CW / 2, top: Y - CH / 2 }}>
            <Card highlight={on ? 1 : 0} accent={s.human ? C.blue : C.turquoise} style={{ width: CW, height: CH, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, opacity: paused && !s.human ? 0.6 : 1, border: `1.5px solid ${s.human ? C.blue : C.turquoise}66` }}>
              <Text size={21} weight={600} color={s.human ? C.blue : C.turquoiseDark}>{s.who}</Text>
              <Icon name={s.icon} size={46} color={s.human ? C.blue : C.turquoiseDark} />
              <Text size={31} weight={700}>{s.verb}</Text>
              <Text size={21} color={C.muted} style={{ textAlign: "center" }}>{s.sub}</Text>
            </Card>
          </Reveal>
        );
      })}
      {/* لمحة من محاولة الطالب */}
      <Reveal at={c(4, "يحاول")} kind="up" style={{ left: XS[2] - 150, top: Y + CH / 2 + 46, width: 300 }}>
        <Card tone="soft" style={{ padding: "10px 16px", direction: "rtl", textAlign: "center" }}>
          {["٢س + ٣ = ١١", "٢س = ٨", "س = ٤"].map((l, i) => (
            <div key={i} style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.blue, opacity: prog(f, c(4, "يحاول") + 12 + i * 14, 10) }}>{l}</div>
          ))}
        </Card>
      </Reveal>
      <Reveal at={c(4, "وتتكرر")} kind="fade" style={{ left: XS[0] - 150, top: Y + CH / 2 + 50, width: 300, textAlign: "center" }}>
        <Text size={23} color={C.muted}>تتكرر الدورة بحسب الحاجة</Text>
      </Reveal>

      {/* الرجوع إلى المعلم */}
      <HumanInTheLoop at={hitl} decide={decide} term={c(5, "الإنسان في الحلقة")} />
    </SceneShell>
  );
};

const HumanInTheLoop: React.FC<{ at: number; decide: number; term: number }> = ({ at, decide, term }) => {
  const f = useCurrentFrame();
  const glow = pulse(f, at, 40);
  return (
    <>
      <Svg>
        <Conn d={`M 1250 ${Y + CH / 2 + 10} L 1250 885`} at={at + 6} dur={20} color={C.blue} dashed width={3} arrow={{ x: 1250, y: 885, angle: 90 }} />
        <Conn d={`M 1040 885 L 1040 ${Y + CH / 2 + 14}`} at={decide} dur={20} color={C.blue} dashed width={3} arrow={{ x: 1040, y: Y + CH / 2 + 14, angle: -90 }} />
      </Svg>
      <Reveal at={at + 10} kind="fade" style={{ left: 1270, top: 840 }}>
        <Text size={22} weight={600} color={C.blue}>عند الحاجة، من أي خطوة</Text>
      </Reveal>
      <Reveal at={decide + 6} kind="fade" style={{ left: 940, top: 840, width: 200 }}>
        <Text size={22} weight={600} color={C.blue}>قرار أو توجيه</Text>
      </Reveal>
      <Reveal at={at} kind="scale" style={{ left: 1140, top: 720 }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", opacity: f < decide + 20 ? 1 : 0 }}>
          <Icon name="pause" size={36} color="#fff" stroke={2.6} />
        </div>
      </Reveal>
      <Reveal at={at + 16} kind="up" style={{ left: 280, top: 890, width: 1360 }}>
        <Card style={{ width: 1360, height: 100, padding: "0 34px", display: "flex", alignItems: "center", gap: 24, boxShadow: `0 0 0 ${4 * glow}px ${C.blue}44` }}>
          <IconBadge name="teacher" size={62} round bg={C.blueLight} color={C.blue} />
          <Text size={30} weight={700} color={C.blue}>الرجوع إلى المعلم</Text>
          <Text size={25} color={C.muted}>يتوقف الوكيل لطلب التوجيه أو الموافقة، ثم يواصل وفق قراره</Text>
          <div style={{ flex: 1 }} />
          <Reveal at={term} kind="scale" style={{ position: "relative" }}>
            <Chip label="الإنسان في الحلقة" size={24} color="#fff" bg={C.blue} />
          </Reveal>
        </Card>
      </Reveal>
    </>
  );
};
