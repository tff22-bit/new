import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C, FONT } from "../theme";
import { easeInOut, prog } from "../components/anim";
import { Conn, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { AgentCore, Card, IconBadge, Phase, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const CARDS: { title: string; icon: IconName; body: string; beat: number }[] = [
  { title: "القيمة والمسؤولية", icon: "target", body: "مرجع استرشادي يدعم القيمة، ويحافظ على مسؤولية الإنسان، ويحمي حقوق المستفيدين", beat: 1 },
  { title: "التطبيق والتحقق", icon: "search", body: "بحسب طبيعة الاستخدام ومستوى أثره، مع مراجعة مستمرة ومعالجة القصور", beat: 2 },
  { title: "التطوير المستمر", icon: "refresh", body: "قابلة للتطوير في ضوء الأدلة والخبرات، بما يواكب التقنيات واحتياجات التعليم", beat: 3 },
];

export const S22Closing: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const fin = c(4);
  const handoff = prog(f, c(4, "لكن"), 30, easeInOut);
  return (
    <SceneShell heading={f < fin}>
      <Phase at={c(1)} out={fin - 10}>
        {CARDS.map((k, i) => (
          <Reveal key={i} at={c(k.beat)} kind="up" style={{ left: 1210 - i * 480, top: 330, width: 440 }}>
            <Card highlight={f >= c(k.beat) && (i === 2 || f < c(k.beat + 1)) ? 1 : 0} style={{ width: 440, height: 440, padding: 34, display: "flex", flexDirection: "column", gap: 20 }}>
              <IconBadge name={k.icon} size={86} />
              <Text size={34} weight={700}>{k.title}</Text>
              <Text size={26} color={C.muted} style={{ lineHeight: 1.5 }}>{k.body}</Text>
            </Card>
          </Reveal>
        ))}
      </Phase>
      <Phase at={fin}>
        <Svg>
          <Conn d="M 1060 470 L 860 470" at={c(4, "لكن")} dur={24} color={C.blue} dashed width={3} arrow={{ x: 860, y: 470, angle: 180 }} />
        </Svg>
        <Reveal at={fin} kind="scale" style={{ left: 1100, top: 390 }}>
          <AgentCore size={160} />
        </Reveal>
        <Reveal at={c(4, "لكن")} kind="scale" style={{ left: 660, top: 390 }}>
          <div style={{ width: 160, height: 160, borderRadius: "50%", background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${14 * handoff}px ${C.blue}22` }}>
            <Icon name="teacher" size={84} color={C.blue} />
          </div>
        </Reveal>
        <Reveal at={fin + 6} kind="up" style={{ left: 0, right: 0, top: 640, textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 700, color: C.teal, lineHeight: 1.4 }}>
            قد يختار الوكيل خطوته التالية…
            <br />
            <span style={{ color: C.blue, opacity: handoff }}>لكن المسؤولية تبقى للإنسان</span>
          </div>
        </Reveal>
        <Reveal at={c(4, "لكن") + 40} kind="fade" style={{ left: 0, right: 0, top: 880, textAlign: "center" }}>
          <Text size={22} color={C.muted}>
            المصدر: المركز الوطني للتعليم الإلكتروني — معايير وكلاء الذكاء الاصطناعي في التعليم والتدريب، الإصدار 1.0، أكتوبر 2026م
          </Text>
          <Text size={18} color={C.faint}>محتوى تعليمي مبني على وثيقة مرخّصة بموجب CC BY-NC-SA 4.0</Text>
        </Reveal>
      </Phase>
    </SceneShell>
  );
};
