import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C, FONT } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, Svg } from "../components/Draw";
import { Icon } from "../components/Icon";
import { StepBox } from "../components/Node";
import { AgentCore, Card, Chip, IconBadge, Phase, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

export const S12Value: React.FC = () => {
  const { c } = useCues();
  return (
    <SceneShell>
      <Phase at={c(1)} out={c(3) - 8}>
        <WhyChain />
      </Phase>
      <Phase at={c(3)} out={c(4) - 8}>
        <ContextLens />
      </Phase>
      <Phase at={c(4)}>
        <RiskBalance />
      </Phase>
    </SceneShell>
  );
};

const WhyChain: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const b2 = c(2);
  const q = prog(f, c(1, "لماذا"), 20) * (1 - prog(f, b2, 20));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", opacity: q, transform: `scale(${0.9 + 0.1 * q})` }}>
        <div style={{ fontFamily: FONT, fontSize: 130, fontWeight: 700, color: C.teal }}>لماذا؟</div>
        <Text size={36} weight={500} color={C.muted}>لماذا نستخدم الوكيل أصلًا؟</Text>
      </div>
      <Svg>
        <Conn d="M 1380 420 L 1150 420" at={c(2, "قيمة يمكن") - 10} dur={14} arrow={{ x: 1150, y: 420, angle: 180 }} />
        <Conn d="M 790 420 L 560 420" at={c(2, "قيمة يمكن")} dur={14} arrow={{ x: 560, y: 420, angle: 180 }} />
      </Svg>
      <StepBox at={c(2, "بحاجة")} x={1530} y={420} w={300} h={110} label="حاجة محددة" icon="target" />
      <Reveal at={c(2, "بحاجة") + 10} kind="scale" style={{ left: 900, top: 350 }}>
        <AgentCore size={140} />
      </Reveal>
      <StepBox at={c(2, "قيمة يمكن")} x={400} y={420} w={320} h={110} label="قيمة قابلة للتحقق" icon="check" tone="ok" color={C.ok} />
      <Reveal at={c(2, "بمؤشرات")} kind="up" style={{ left: 290, top: 500 }}>
        <Chip icon="chart" label="مؤشرات لقياسها" size={24} />
      </Reveal>
      {/* الفخ الشائع */}
      <Reveal at={c(2, "ولا تُعدّ")} kind="up" style={{ left: 260, top: 650, width: 1400 }}>
        <Card style={{ width: 1400, height: 200, padding: "0 50px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 20 }}>
            <Chip icon="star" label="جودة المخرجات" size={30} />
            <Chip icon="speed" label="سرعة الإنجاز" size={30} />
          </div>
          <div style={{ position: "relative", width: 120, height: 80 }}>
            <div style={{ fontFamily: FONT, fontSize: 80, fontWeight: 700, color: C.alert, lineHeight: "80px", textAlign: "center" }}>=</div>
            <Svg style={{ width: 120, height: 80 }}>
              <line x1={30} y1={72} x2={90} y2={8} stroke={C.alert} strokeWidth={7} strokeLinecap="round" opacity={prog(f, c(2, "وحدهما"), 12)} />
            </Svg>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <IconBadge name="student" size={70} bg={C.okLight} color={C.ok} />
            <Text size={32} weight={700}>دليل على تحسن التعلم</Text>
          </div>
        </Card>
      </Reveal>
      <Reveal at={c(2, "وحدهما")} kind="fade" style={{ left: 0, right: 0, top: 870, textAlign: "center" }}>
        <Text size={26} weight={600} color={C.alert}>ليستا وحدهما دليلًا كافيًا</Text>
      </Reveal>
    </>
  );
};

const ContextLens: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const rings = [
    { label: "المهمة", r: 120, cue: "للمهمة" },
    { label: "الفئة المستفيدة", r: 210, cue: "والفئة" },
    { label: "السياق التعليمي والثقافي في المملكة", r: 300, cue: "والسياق" },
  ];
  const cx = 1180, cy = 590;
  const lensX = lerp(cx + 260, cx - 30, prog(f, c(3, "مع مراعاة"), 40, easeInOut));
  return (
    <>
      <Svg>
        {rings.map((r, i) => {
          const p = prog(f, c(3, r.cue), 24, easeInOut);
          return <circle key={i} cx={cx} cy={cy} r={r.r * p} fill={i === 0 ? "#EEFAFB" : "none"} stroke={[C.turquoise, C.blue, C.teal][i]} strokeWidth={3} opacity={p} />;
        })}
      </Svg>
      {rings.map((r, i) => (
        <Reveal key={i} at={c(3, r.cue) + 10} kind="fade" style={{ left: cx - 200, width: 400, top: i === 0 ? cy + 50 : cy - r.r - 46, textAlign: "center" }}>
          <span style={{ fontFamily: FONT, fontSize: 25, fontWeight: 700, color: [C.turquoiseDark, C.blue, C.teal][i], background: i === 0 ? "transparent" : C.bg, padding: "0 10px" }}>{r.label}</span>
        </Reveal>
      ))}
      <Reveal at={c(3) + 4} kind="scale" style={{ left: cx - 55, top: cy - 70 }}>
        <AgentCore size={110} />
      </Reveal>
      <Reveal at={c(3, "مع مراعاة")} kind="fade" style={{ left: lensX - 70, top: cy + 120 }}>
        <Icon name="search" size={140} color={C.teal} stroke={1.4} />
      </Reveal>
      <Reveal at={c(3, "مع مراعاة")} kind="left" style={{ left: 170, top: 360, width: 600 }}>
        <Card style={{ width: 600, padding: "26px 30px" }}>
          <Text size={28} weight={700}>مراعاة المستخدمين</Text>
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <Chip label="لغتهم" size={24} />
            <Chip label="مستواهم" size={24} />
          </div>
        </Card>
      </Reveal>
      <Reveal at={c(3, "والتحقق من صحة")} kind="left" style={{ left: 170, top: 600, width: 600 }}>
        <Card tone="cyan" style={{ width: 600, padding: "26px 30px", border: `2px solid ${C.turquoise}`, display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ fontFamily: FONT, fontSize: 64, fontWeight: 700, color: C.teal }}>ض</div>
          <div>
            <Text size={28} weight={700}>اللغة العربية</Text>
            <Text size={24} color={C.muted}>التحقق من صحتها ووضوحها</Text>
          </div>
          <div style={{ flex: 1 }} />
          <Icon name="check" size={48} color={C.ok} stroke={2.6} />
        </Card>
      </Reveal>
    </>
  );
};

// ميزان: أثر الاستخدام ومخاطره مقابل الصلاحيات وتدابير الحماية
const RiskBalance: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const riskUp = prog(f, c(4, "ومخاطره"), 30, easeInOut);
  const protUp = prog(f, c(4, "ومخاطره") + 30, 30, easeInOut);
  const exceed = prog(f, c(4, "إذا تجاوزت"), 30, easeInOut);
  const risk = 1 + riskUp * 0.6 + exceed * 1.2;
  const prot = 1 + protUp * 0.6;
  const tilt = Math.max(-16, Math.min(16, (risk - prot) * 14));
  const cx = 820, cy = 380;
  const L = 330;
  const rad = (tilt * Math.PI) / 180;
  const left = { x: cx - Math.cos(rad) * L, y: cy - Math.sin(rad) * L * -1 };
  const right = { x: cx + Math.cos(rad) * L, y: cy - Math.sin(rad) * L };
  return (
    <>
      <Svg>
        <path d={`M ${cx} ${cy} L ${cx} 800 M ${cx - 120} 800 L ${cx + 120} 800`} stroke={C.lineStrong} strokeWidth={6} strokeLinecap="round" />
        <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke={C.teal} strokeWidth={8} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={14} fill={C.teal} />
        {[left, right].map((p, i) => (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={p.x - 90} y2={p.y + 140} stroke={C.lineStrong} strokeWidth={2.5} />
            <line x1={p.x} y1={p.y} x2={p.x + 90} y2={p.y + 140} stroke={C.lineStrong} strokeWidth={2.5} />
            <path d={`M ${p.x - 120} ${p.y + 140} L ${p.x + 120} ${p.y + 140} Q ${p.x} ${p.y + 200} ${p.x - 120} ${p.y + 140}`} fill={i === 0 ? (exceed > 0.3 ? C.alertLight : "#EEFAFB") : "#EEFAFB"} stroke={i === 0 && exceed > 0.3 ? C.alert : C.turquoise} strokeWidth={3} />
          </g>
        ))}
      </Svg>
      {/* حمولة كل كفة */}
      <div style={{ position: "absolute", left: left.x - 110, top: left.y + 70 - 50 * (risk - 1), width: 220, textAlign: "center" }}>
        <Icon name="warning" size={56 + (risk - 1) * 30} color={exceed > 0.3 ? C.alert : C.turquoiseDark} />
      </div>
      <div style={{ position: "absolute", left: right.x - 110, top: right.y + 70 - 50 * (prot - 1), width: 220, textAlign: "center" }}>
        <Icon name="shield" size={56 + (prot - 1) * 30} color={C.turquoiseDark} />
      </div>
      <div style={{ position: "absolute", left: left.x - 150, top: left.y + 215, width: 300, textAlign: "center" }}>
        <Text size={26} weight={700}>أثر الاستخدام ومخاطره</Text>
      </div>
      <div style={{ position: "absolute", left: right.x - 150, top: right.y + 215, width: 300, textAlign: "center" }}>
        <Text size={26} weight={700}>الصلاحيات وتدابير الحماية</Text>
      </div>
      <Reveal at={c(4, "صاحب الصلاحية")} kind="left" style={{ left: 1290, top: 330, width: 460 }}>
        <Card style={{ width: 460, padding: "22px 26px", display: "flex", gap: 18, alignItems: "center" }}>
          <IconBadge name="user" size={64} round bg={C.blueLight} color={C.blue} />
          <Text size={26} weight={700}>صاحب الصلاحية في قبول المخاطر</Text>
        </Card>
      </Reveal>
      <Reveal at={c(4, "وتقيّد") + 6} kind="scale" style={{ left: 1290, top: 560, width: 460 }}>
        <Card tone="alert" style={{ width: 460, padding: "22px 26px", display: "flex", gap: 18, alignItems: "center", border: `2px solid ${C.alert}` }}>
          <Icon name="stop" size={56} color={C.alert} />
          <Text size={26} weight={700}>تقييد الاستخدام أو إيقافه إذا تجاوزت المخاطر ما يمكن معالجته</Text>
        </Card>
      </Reveal>
    </>
  );
};
