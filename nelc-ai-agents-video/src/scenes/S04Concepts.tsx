import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, polyPoint, prog } from "../components/anim";
import { Conn, FlowDot, Svg } from "../components/Draw";
import { Icon } from "../components/Icon";
import { StepBox } from "../components/Node";
import { Card, Chip, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const LANES = [
  { y: 330, title: "سير العمل المؤتمت", sub: "مسار محدد مسبقًا", color: C.blue },
  { y: 555, title: "أداة الذكاء الاصطناعي", sub: "تستجيب لطلب محدد", color: C.blue },
  { y: 780, title: "وكيل الذكاء الاصطناعي", sub: "يُكلَّف بهدف", color: C.turquoise },
];
const X = [1250, 940, 630];

export const S04Concepts: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const b2 = c(2), b3 = c(3), b4 = c(4), b5 = c(5);
  const focus = (i: number) => {
    const t = [b2, b3, b4][i];
    const next = [b3, b4, 1e9][i];
    return f >= t && f < next ? 1 : f >= b5 && i === 2 ? 1 : 0;
  };
  const dimOthers = (i: number) => (f >= b2 && focus(i) === 0 ? 0.45 : 1);
  const meter = prog(f, c(1, "تختلف"), 40, easeInOut);
  const loopPts = [
    { x: X[2], y: 830 }, { x: X[2], y: 880 }, { x: X[1], y: 880 }, { x: X[1], y: 830 },
  ];
  return (
    <SceneShell>
      {/* مقياس الاستقلالية */}
      <Svg>
        <defs>
          <linearGradient id="aut" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={C.cyanLight} />
            <stop offset="1" stopColor={C.turquoise} />
          </linearGradient>
        </defs>
        <rect x={150} y={250} width={22} height={620} rx={11} fill={C.line} opacity={meter > 0 ? 1 : 0} />
        <rect x={150} y={250 + 620 * (1 - meter)} width={22} height={620 * meter} rx={11} fill="url(#aut)" />
      </Svg>
      <Reveal at={c(1, "تختلف")} kind="fade" style={{ left: 196, top: 236 }}>
        <Text size={24} weight={600} color={C.turquoiseDark}>أعلى</Text>
      </Reveal>
      <Reveal at={c(1, "تختلف")} kind="fade" style={{ left: 196, top: 840 }}>
        <Text size={24} weight={600} color={C.muted}>أقل</Text>
      </Reveal>
      <Reveal at={c(1, "تختلف")} kind="fade" style={{ left: 40, top: 930, width: 250, textAlign: "center" }}>
        <Text size={26} weight={700} color={C.teal}>الاستقلالية</Text>
      </Reveal>

      {LANES.map((l, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: dimOthers(i) }}>
          <Reveal at={c(1, ["سير العمل", "وأداة", "والوكيل"][i])} kind="right" style={{ left: 1430, top: l.y - 82, width: 400 }}>
            <Card highlight={focus(i)} accent={l.color} style={{ width: 400, height: 164, padding: "20px 26px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: `8px solid ${l.color}` }}>
              <Text size={32} weight={700}>{l.title}</Text>
              <Text size={24} color={C.muted}>{l.sub}</Text>
            </Card>
          </Reveal>
        </div>
      ))}

      {/* سير العمل المؤتمت */}
      <div style={{ position: "absolute", inset: 0, opacity: dimOthers(0) }}>
        <Svg>
          <Conn d={`M ${X[0] - 120} 330 L ${X[1] + 120} 330`} at={b2 + 10} dur={14} color={C.blue} arrow={{ x: X[1] + 120, y: 330, angle: 180 }} />
          <Conn d={`M ${X[1] - 120} 330 C ${X[1] - 170} 330 ${X[1] - 170} 282 ${X[2] + 110} 282`} at={c(2, "نشاط مراجعة")} dur={14} color={C.blue} arrow={{ x: X[2] + 110, y: 282, angle: 180 }} />
          <Conn d={`M ${X[1] - 120} 330 C ${X[1] - 170} 330 ${X[1] - 170} 378 ${X[2] + 110} 378`} at={c(2, "ونشاطًا")} dur={14} color={C.blue} arrow={{ x: X[2] + 110, y: 378, angle: 180 }} />
        </Svg>
        <StepBox at={b2} x={X[0]} y={330} label="خطوة أولى" icon="doc" color={C.blue} />
        <StepBox at={b2 + 14} x={X[1]} y={330} label="شرط مبرمج" icon="branch" color={C.blue} />
        <StepBox at={c(2, "نشاط مراجعة")} x={X[2] - 30} y={282} w={290} h={64} size={24} label="درجة أقل ← مراجعة" icon="refresh" color={C.blue} />
        <StepBox at={c(2, "ونشاطًا")} x={X[2] - 30} y={378} w={290} h={64} size={24} label="درجة أعلى ← إثراء" icon="star" color={C.blue} />
        <Reveal at={c(2, "لا يختار")} kind="fade" style={{ left: 300, top: 300 }}>
          <Icon name="lock" size={54} color={C.blue} />
        </Reveal>
      </div>

      {/* أداة الذكاء الاصطناعي */}
      <div style={{ position: "absolute", inset: 0, opacity: dimOthers(1) }}>
        <Svg>
          <Conn d={`M ${X[0] - 120} 555 L ${X[1] + 120} 555`} at={c(3, "وتنتج")} dur={14} color={C.blue} arrow={{ x: X[1] + 120, y: 555, angle: 180 }} />
          <Conn d={`M ${X[1] - 120} 555 L ${X[2] + 120} 555`} at={c(3, "ويبقى")} dur={14} color={C.blue} arrow={{ x: X[2] + 120, y: 555, angle: 180 }} />
        </Svg>
        <StepBox at={b3} x={X[0]} y={555} label="طلب المستخدم" icon="chat" color={C.blue} />
        <StepBox at={c(3, "وتنتج")} x={X[1]} y={555} label="استجابة" icon="doc" color={C.blue} />
        <StepBox at={c(3, "ويبقى")} x={X[2]} y={555} label="الإنسان يختار التالي" icon="user" color={C.blue} highlight={f > c(3, "ويبقى") && f < b4 ? 1 : 0} />
      </div>

      {/* الوكيل */}
      <div style={{ position: "absolute", inset: 0, opacity: dimOthers(2) }}>
        <Svg>
          <Conn d={`M ${X[0] - 120} 780 L ${X[1] + 120} 780`} at={c(4, "ويحدد")} dur={14} color={C.turquoise} arrow={{ x: X[1] + 120, y: 780, angle: 180 }} />
          <Conn d={`M ${X[1] - 120} 780 L ${X[2] + 120} 780`} at={c(4, "وينفذها")} dur={14} color={C.turquoise} arrow={{ x: X[2] + 120, y: 780, angle: 180 }} />
          <Conn d={`M ${X[2]} 822 L ${X[2]} 880 L ${X[1]} 880 L ${X[1]} 826`} at={c(4, "ويعدّل")} dur={24} color={C.turquoise} arrow={{ x: X[1], y: 826, angle: -90 }} />
          {f > c(4, "فالنتيجة") && <FlowDot point={polyPoint(loopPts, ((f - c(4, "فالنتيجة")) / 60) % 1)} r={7} />}
        </Svg>
        <StepBox at={b4} x={X[0]} y={780} label="هدف" icon="flag" />
        <StepBox at={c(4, "ويحدد")} x={X[1]} y={780} label="اختيار خطوة" icon="branch" />
        <StepBox at={c(4, "وينفذها")} x={X[2]} y={780} label="تنفيذ ومراجعة" icon="check" />
        <Reveal at={c(4, "فالنتيجة")} kind="up" style={{ left: X[1] - 40, top: 892, width: 400 }}>
          <Text size={24} weight={600} color={C.turquoiseDark}>النتيجة تحدد الخطوة التالية</Text>
        </Reveal>
        <Reveal at={c(5, "ولا يُشترط")} kind="up" style={{ left: 300, top: 650 }}>
          <Chip icon="sparkle" label="لا يُشترط نموذج لغوي" size={24} color={C.turquoiseDark} />
        </Reveal>
      </div>
    </SceneShell>
  );
};
