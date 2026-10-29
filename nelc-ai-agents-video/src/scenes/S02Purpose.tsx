import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C, FONT } from "../theme";
import { easeInOut, polyPoint, prog } from "../components/anim";
import { Conn, FlowDot, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { Card, Chip, IconBadge, Phase, Reveal, Takeaway, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const outputs: { icon: IconName; label: string; cue: string }[] = [
  { icon: "target", label: "اختيار الاستخدام الأمثل", cue: "اختيار الاستخدام" },
  { icon: "key", label: "تحديد صلاحيات الوكيل", cue: "وتحديد صلاحيات" },
  { icon: "users", label: "مسؤوليات مستخدميه", cue: "ومسؤوليات" },
  { icon: "shieldCheck", label: "قيمته وسلامة مخرجاته", cue: "والتحقق" },
];

const values: { icon: IconName; label: string }[] = [
  { icon: "student", label: "تحسين التعلم" },
  { icon: "medal", label: "جودة الخدمات" },
  { icon: "speed", label: "كفاءة العمل" },
];

export const S02Purpose: React.FC = () => {
  const f = useCurrentFrame();
  const { c, end } = useCues();
  const t3 = c(3);
  const t4 = c(4);
  return (
    <SceneShell>
      {/* الوثيقة وما تساعد عليه */}
      <Phase at={c(1)} out={t3 - 8}>
        <Reveal at={c(1)} kind="scale" style={{ left: 1180, top: 380, width: 520 }}>
          <Card style={{ width: 520, padding: 34, display: "flex", gap: 24, alignItems: "center" }}>
            <IconBadge name="doc" size={96} />
            <div>
              <Text size={34} weight={700}>معايير ومتطلبات</Text>
              <Text size={28} color={C.muted}>استخدام وكلاء الذكاء الاصطناعي في التعليم والتدريب</Text>
            </div>
          </Card>
        </Reveal>
        <Reveal at={c(1, "في المملكة")} kind="up" style={{ left: 1290, top: 620 }}>
          <Chip icon="globe" label="في المملكة العربية السعودية" />
        </Reveal>
        <Svg>
          {outputs.map((o, i) => {
            const y = 300 + i * 150;
            return <Conn key={i} d={`M 1170 520 C 1060 520 1060 ${y} 960 ${y}`} at={c(2, o.cue) - 10} dur={20} color={C.cyanSoft} arrow={{ x: 960, y, angle: 180 }} />;
          })}
        </Svg>
        {outputs.map((o, i) => (
          <Reveal key={i} at={c(2, o.cue)} kind="right" style={{ left: 420, top: 300 + i * 150 - 50, width: 530 }}>
            <Card style={{ width: 530, height: 100, padding: "0 28px", display: "flex", gap: 20, alignItems: "center" }}>
              <IconBadge name={o.icon} size={60} />
              <Text size={30} weight={600}>{o.label}</Text>
            </Card>
          </Reveal>
        ))}
      </Phase>

      {/* القيمة المرجوة بحسب الغرض */}
      <Phase at={t3} out={t4 - 8}>
        <Reveal at={t3} kind="fade" style={{ right: 0, left: 0, top: 250, textAlign: "center" }}>
          <Text size={34} weight={600} color={C.muted}>القيمة المرجوّة… بحسب الغرض من الاستخدام</Text>
        </Reveal>
        {values.map((v, i) => {
          const at = c(3, ["تحسين", "أو جودة", "أو كفاءة"][i]);
          const grow = prog(f, at, 30, easeInOut);
          const x = 1260 - i * 330;
          const h = 330;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 340, width: 260, height: 560 }}>
              <div style={{ position: "absolute", bottom: 120, left: 40, width: 180, height: h * grow, borderRadius: "28px 28px 10px 10px", background: `linear-gradient(180deg, ${C.turquoise}, ${C.cyanSoft})`, opacity: 0.9 }} />
              <Reveal at={at + 10} kind="scale" style={{ left: 80, top: 560 - 120 - h * grow - 40 }}>
                <IconBadge name={v.icon} size={100} round bg="#fff" />
              </Reveal>
              <Reveal at={at + 6} kind="up" style={{ left: 0, right: 0, bottom: 50, textAlign: "center" }}>
                <Text size={34} weight={700}>{v.label}</Text>
              </Reveal>
            </div>
          );
        })}
        <Svg>
          <Conn d="M 380 820 L 1560 820" at={t3 + 4} dur={30} color={C.lineStrong} width={2} />
        </Svg>
      </Phase>

      {/* ماذا تحدده المعايير، وكيف تختاره الجهة */}
      <Phase at={t4}>
        <WhatHow at={t4} cHow={c(4, "وتترك")} />
        <Takeaway at={end(4) - 50} text="المعايير تحدد «ماذا» يتحقق وبأي دليل… والجهة تختار «كيف»" />
      </Phase>
    </SceneShell>
  );
};

const WhatHow: React.FC<{ at: number; cHow: number }> = ({ at, cHow }) => {
  const f = useCurrentFrame();
  const start = { x: 1480, y: 600 };
  const goal = { x: 440, y: 600 };
  const routes = [
    [start, { x: 1200, y: 600 }, { x: 960, y: 420 }, { x: 720, y: 600 }, goal],
    [start, { x: 1200, y: 600 }, { x: 960, y: 600 }, { x: 720, y: 600 }, goal],
    [start, { x: 1200, y: 600 }, { x: 960, y: 780 }, { x: 720, y: 600 }, goal],
  ];
  const labels = ["أساليب التنفيذ", "الإجراءات", "الأدوات"];
  return (
    <>
      <Reveal at={at} kind="left" style={{ left: 250, top: 300, width: 380 }}>
        <Card tone="cyan" style={{ padding: "26px 30px", textAlign: "center", border: `2px solid ${C.turquoise}` }}>
          <Text size={26} weight={600} color={C.turquoiseDark}>تحدده المعايير</Text>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 12 }}>
            <Chip icon="target" label="المخرجات" size={24} />
            <Chip icon="clipboard" label="الأدلة" size={24} />
          </div>
        </Card>
      </Reveal>
      <Reveal at={at + 6} kind="scale" style={{ left: goal.x - 60, top: goal.y - 60 }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 14px rgba(13,92,104,0.12)" }}>
          <Icon name="flag" size={58} color="#fff" />
        </div>
      </Reveal>
      <Reveal at={at + 2} kind="scale" style={{ left: start.x - 50, top: start.y - 50 }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#fff", border: `3px solid ${C.blue}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="building" size={50} color={C.blue} />
        </div>
      </Reveal>
      <Reveal at={at + 8} kind="fade" style={{ left: start.x - 120, top: start.y + 70, width: 240, textAlign: "center" }}>
        <Text size={26} weight={600} color={C.blue}>الجهة</Text>
      </Reveal>
      <Svg>
        {routes.map((r, i) => (
          <Conn key={i} d={`M ${r[0].x} ${r[0].y} L ${r[1].x} ${r[1].y} Q ${r[2].x} ${r[2].y} ${r[3].x} ${r[3].y} L ${r[4].x + 70} ${r[4].y}`} at={cHow + i * 8} dur={34} color={C.blue} dashed width={3} />
        ))}
        {routes.map((r, i) => {
          const t = ((f - cHow - 40 - i * 20) / 120) % 1;
          if (f < cHow + 40 + i * 20) return null;
          return <FlowDot key={i} point={polyPoint([r[0], r[1], { x: r[2].x, y: (r[2].y + 600) / 2 }, r[3], { x: r[4].x + 70, y: r[4].y }], t)} r={6} color={C.blue} />;
        })}
      </Svg>
      {labels.map((l, i) => (
        <Reveal key={i} at={cHow + 20 + i * 8} kind="fade" style={{ left: 960 - 110, top: [455, 610, 745][i] - 22, width: 220, textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.blue, background: "#fff", padding: "4px 14px", borderRadius: 999, border: `1px solid ${C.blueLight}` }}>{l}</div>
        </Reveal>
      ))}
      <Reveal at={cHow + 30} kind="up" style={{ left: 1120, top: 300, width: 520, textAlign: "center" }}>
        <Card style={{ padding: "22px 26px" }}>
          <Text size={26} weight={600} color={C.blue}>تختاره الجهة بما يناسب أعمالها</Text>
        </Card>
      </Reveal>
    </>
  );
};
