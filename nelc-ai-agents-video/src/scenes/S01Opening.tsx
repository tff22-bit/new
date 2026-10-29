import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C, FONT, shadow } from "../theme";
import { easeInOut, prog } from "../components/anim";
import { Conn, Svg } from "../components/Draw";
import { Icon } from "../components/Icon";
import { Loop } from "../components/Loop";
import { AgentCore, Card, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

// افتتاحية: من نظام يجيب إلى نظام يختار خطواته، ثم السؤال، ثم الوثيقة
export const S01Opening: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const tLoop = c(1, "بل يختار");
  const tQ = c(2);
  const tDoc = c(3, "أصدر");
  // المرحلة الأولى تنزاح لليسار عند ظهور السؤال، ثم يختفي كل شيء لصالح الغلاف
  const shift = prog(f, tQ, 30, easeInOut);
  const toDoc = prog(f, tDoc - 10, 24, easeInOut);
  const answerFade = prog(f, tLoop, 18);
  return (
    <SceneShell heading={false}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - toDoc, transform: `translateX(${-shift * 330}px) scale(${1 - shift * 0.12})` }}>
        {/* نظام يجيب فقط */}
        <div style={{ position: "absolute", inset: 0, opacity: 1 - answerFade }}>
          <Reveal at={8} kind="right" style={{ left: 1110, top: 470 }}>
            <Card style={{ padding: "26px 34px", display: "flex", gap: 16, alignItems: "center" }}>
              <Icon name="chat" size={44} color={C.blue} />
              <Text size={32} weight={600}>سؤال</Text>
            </Card>
          </Reveal>
          <Svg>
            <Conn d="M 1090 520 L 880 520" at={22} dur={20} color={C.lineStrong} arrow={{ x: 880, y: 520, angle: 180 }} />
          </Svg>
          <Reveal at={38} kind="left" style={{ left: 600, top: 470 }}>
            <Card style={{ padding: "26px 34px", display: "flex", gap: 16, alignItems: "center" }}>
              <Icon name="doc" size={44} color={C.muted} />
              <Text size={32} weight={600}>إجابة</Text>
            </Card>
          </Reveal>
        </div>
        {/* نظام يختار وينفذ ويراجع */}
        <Loop
          cx={960}
          cy={540}
          r={250}
          nodes={[
            { label: "يختار الخطوة", icon: "branch", at: tLoop },
            { label: "ينفّذها", icon: "send", at: c(1, "وينفّذها") },
            { label: "يراجع النتيجة", icon: "check", at: c(1, "ثم يراجع") },
          ]}
          arcAt={[c(1, "وينفّذها") - 4, c(1, "ثم يراجع") - 4, c(1, "ثم يراجع") + 14]}
          flowFrom={c(1, "ثم يراجع") + 30}
          cardW={250}
          cardH={130}
          center={
            <Reveal at={tLoop + 4} kind="scale" style={{ left: 960 - 70, top: 540 - 70 }}>
              <AgentCore size={140} />
            </Reveal>
          }
        />
        {/* حدّ متقطع يلمّح إلى سؤال الحدود */}
        <Svg>
          <Conn d="M 960 190 A 350 350 0 1 0 961 190" at={c(2, "ما الحدود")} dur={40} color={C.blue} dashed width={2.5} />
        </Svg>
      </div>
      {/* السؤالان */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - toDoc }}>
        <Reveal at={c(2, "حين يدخل")} kind="fade" style={{ right: 140, top: 250 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", color: C.muted, fontSize: 28, fontWeight: 600 }}>
            <Icon name="book" size={40} color={C.muted} /> الفصل الدراسي · قاعة التدريب
          </div>
        </Reveal>
        <Reveal at={c(2, "ما الحدود")} kind="right" style={{ right: 140, top: 370, width: 620 }}>
          <Card style={{ padding: "30px 36px", display: "flex", gap: 20, alignItems: "center" }} highlight={0}>
            <Icon name="question" size={54} color={C.blue} />
            <Text size={38} weight={700}>ما الحدود التي يعمل ضمنها؟</Text>
          </Card>
        </Reveal>
        <Reveal at={c(2, "ومن يبقى")} kind="right" style={{ right: 140, top: 560, width: 620 }}>
          <Card style={{ padding: "30px 36px", display: "flex", gap: 20, alignItems: "center" }}>
            <Icon name="user" size={54} color={C.blue} />
            <Text size={38} weight={700}>من يبقى مسؤولًا عن القرار؟</Text>
          </Card>
        </Reveal>
      </div>
      {/* غلاف الوثيقة */}
      <DocCover at={tDoc} />
    </SceneShell>
  );
};

const DocCover: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 30);
  if (p <= 0) return null;
  const nodes = [
    { x: 520, y: 300, icon: "book" as const },
    { x: 420, y: 620, icon: "doc" as const },
    { x: 1420, y: 290, icon: "clipboard" as const },
    { x: 1500, y: 640, icon: "chart" as const },
    { x: 700, y: 860, icon: "database" as const },
    { x: 1250, y: 860, icon: "users" as const },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p }}>
      <Svg>
        {nodes.map((n, i) => (
          <Conn key={i} d={`M 960 540 L ${n.x} ${n.y}`} at={at + 10 + i * 5} dur={26} color={C.cyanSoft} width={3} />
        ))}
      </Svg>
      {nodes.map((n, i) => (
        <Reveal key={i} at={at + 22 + i * 5} kind="scale" style={{ left: n.x - 46, top: n.y - 46 }}>
          <div style={{ width: 92, height: 92, borderRadius: 26, background: "#fff", boxShadow: shadow.card, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={n.icon} size={46} color={C.turquoiseDark} />
          </div>
        </Reveal>
      ))}
      <Reveal at={at + 4} kind="scale" style={{ left: 960 - 470, top: 540 - 200, width: 940 }}>
        <Card style={{ width: 940, padding: "44px 56px", textAlign: "center", fontFamily: FONT }} highlight={0}>
          <div style={{ fontSize: 26, color: C.turquoiseDark, fontWeight: 600 }}>المركز الوطني للتعليم الإلكتروني</div>
          <div style={{ fontSize: 56, fontWeight: 700, color: C.teal, lineHeight: 1.3, marginTop: 16 }}>
            معايير وكلاء الذكاء الاصطناعي
            <br />
            في التعليم والتدريب
          </div>
          <div style={{ height: 4, width: 140, background: C.turquoise, borderRadius: 2, margin: "22px auto 18px" }} />
          <div style={{ fontSize: 26, color: C.muted, fontWeight: 500 }}>الإصدار 1.0 • أكتوبر 2026م</div>
        </Card>
      </Reveal>
    </div>
  );
};
