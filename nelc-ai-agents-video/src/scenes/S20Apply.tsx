import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { AgentCore, Card, ExampleTag, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const XS = [1440, 1040, 640, 240];
const SY = 430;
const STEPS: { n: number; title: string; desc: string; icon: IconName; out: string }[] = [
  { n: 1, title: "التحقق", desc: "هل يُصنَّف النظام وكيلًا وفق مفاهيم الوثيقة؟", icon: "search", out: "وكيل: يعدّل خطوته وفق استجابة الطالب" },
  { n: 2, title: "التصنيف", desc: "المجال · خصائص الاستخدام · الاستقلالية · الأثر", icon: "layers", out: "المجال: التعلم والممارسة والتخصيص" },
  { n: 3, title: "تطبيق المعايير", desc: "الأبعاد السبعة بما يتناسب مع الأثر، وبيان سبب عدم الانطباق", icon: "list", out: "مراجعة الأبعاد السبعة" },
  { n: 4, title: "تطبيق متطلبات المجال", desc: "إضافة متطلبات كل مجال ينطبق على الاستخدام", icon: "doc", out: "إضافة متطلبات مجاله" },
];

export const S20Apply: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const stepAt = [c(2), c(3), c(4), c(4, "ورابعًا")];
  const b5 = c(5);
  const visitAt = [c(5, "فهو يعدّل"), c(5, "ويقع في"), c(5, "فتُراجَع"), c(5, "وتُضاف")];
  // موضع رمز الوكيل التوضيحي بين الخطوات
  let x = XS[0] + 260;
  for (let i = 0; i < 4; i++) {
    const p = prog(f, visitAt[i] - 16, 20, easeInOut);
    x = lerp(x, XS[i], p);
  }
  return (
    <SceneShell>
      <Svg>
        {XS.slice(0, 3).map((sx, i) => (
          <Conn key={i} d={`M ${sx - 180} ${SY} L ${XS[i + 1] + 182} ${SY}`} at={stepAt[i + 1] - 8} dur={12} color={C.turquoise} arrow={{ x: XS[i + 1] + 182, y: SY, angle: 180 }} />
        ))}
      </Svg>
      {STEPS.map((s, i) => {
        const on = f >= visitAt[i] && (i === 3 || f < visitAt[i + 1]);
        return (
          <Reveal key={i} at={stepAt[i]} kind="up" style={{ left: XS[i] - 170, top: SY - 140 }}>
            <Card highlight={on ? 1 : 0} tone={i >= 2 ? "cyan" : "white"} style={{ width: 340, height: 280, padding: 26, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: i >= 2 ? C.turquoiseDark : C.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28 }}>{s.n}</div>
                <Icon name={s.icon} size={44} color={C.turquoiseDark} />
              </div>
              <Text size={31} weight={700}>{s.title}</Text>
              <Text size={22} color={C.muted} style={{ lineHeight: 1.4 }}>{s.desc}</Text>
            </Card>
          </Reveal>
        );
      })}
      {/* تطبيق توضيحي على مساعد الرياضيات */}
      <ExampleTag at={b5} text="تطبيق توضيحي · مساعد الرياضيات" style={{ left: 96, top: 80 }} />
      {f >= b5 && (
        <div style={{ position: "absolute", left: x - 45, top: 610, opacity: prog(f, b5, 16) }}>
          <AgentCore size={90} />
        </div>
      )}
      {STEPS.map((s, i) => (
        <Reveal key={i} at={visitAt[i] + 8} kind="up" style={{ left: XS[i] - 170, top: 730, width: 340 }}>
          <Card tone="ok" style={{ width: 340, minHeight: 110, padding: "16px 20px", display: "flex", gap: 12, alignItems: "center", border: `1.5px solid ${C.ok}66` }}>
            <Icon name="check" size={34} color={C.ok} stroke={2.6} />
            <Text size={23} weight={700}>{s.out}</Text>
          </Card>
        </Reveal>
      ))}
      <Reveal at={c(5, "أما التصنيف")} kind="fade" style={{ left: 0, right: 0, top: 900, textAlign: "center" }}>
        <Text size={26} weight={600} color={C.blue}>التصنيف الفعلي — ومنه الاستقلالية والأثر — تحدده الجهة وفق خصائص استخدامها</Text>
      </Reveal>
    </SceneShell>
  );
};
