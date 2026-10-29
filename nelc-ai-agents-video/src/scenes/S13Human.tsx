import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { AgentCore, Card, Chip, IconBadge, Phase, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

export const S13Human: React.FC = () => {
  const { c } = useCues();
  return (
    <SceneShell>
      <Phase at={c(1)} out={c(3) - 8}>
        <DelegationBox />
      </Phase>
      <Phase at={c(3)} out={c(4) - 8}>
        <DecisionGate />
      </Phase>
      <Phase at={c(4)}>
        <RoleSplit />
      </Phase>
    </SceneShell>
  );
};

const DelegationBox: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const box = prog(f, c(1, "ضمن مهمة"), 26, easeInOut);
  const inj = c(2, "ولا توسّعها");
  const ip = prog(f, inj, 40, easeInOut);
  const bounce = prog(f, inj + 40, 24, easeInOut);
  const injX = lerp(1560, 1290, ip) + bounce * 140;
  return (
    <>
      <Reveal at={c(1, "صادرة")} kind="right" style={{ left: 1560, top: 300 }}>
        <IconBadge name="user" size={110} round bg="#fff" color={C.blue} />
        <Text size={24} weight={700} style={{ width: 200, marginRight: -45, textAlign: "center", marginTop: 8 }}>من يملك المنح</Text>
      </Reveal>
      <Svg>
        <Conn d="M 1540 360 L 1290 360" at={c(1, "صادرة") + 8} dur={16} color={C.blue} arrow={{ x: 1290, y: 360, angle: 180 }} />
        <rect x={400} y={260} width={860} height={620} rx={44} fill="rgba(34,179,191,0.05)" stroke={C.teal} strokeWidth={4} opacity={box} />
        <Conn d="M 790 650 L 610 710" at={c(2, "أدوات")} dur={16} color={C.turquoise} arrow={{ x: 610, y: 710, angle: 162 }} />
        <Conn d="M 880 650 L 950 730" at={c(2, "وكلاء آخرين")} dur={16} color={C.turquoise} arrow={{ x: 950, y: 730, angle: 49 }} />
      </Svg>
      <Reveal at={c(1, "ضمن مهمة")} kind="fade" style={{ left: 440, top: 290, display: "flex", gap: 12 }}>
        {["مهمة", "صلاحيات", "حدود واضحة"].map((l) => (
          <Chip key={l} label={l} size={24} />
        ))}
      </Reveal>
      <Reveal at={c(1)} kind="scale" style={{ left: 760, top: 440 }}>
        <AgentCore size={150} label="الصلاحية الأساسية" />
      </Reveal>
      <Reveal at={c(2, "أدوات")} kind="scale" style={{ left: 510, top: 700 }}>
        <IconBadge name="tool" size={86} />
      </Reveal>
      <Reveal at={c(2, "وكلاء آخرين")} kind="scale" style={{ left: 930, top: 720 }}>
        <AgentCore size={86} />
      </Reveal>
      {/* تعليمات خارجية تحاول توسيع الصلاحية */}
      {f > inj && (
        <div style={{ position: "absolute", left: injX, top: 520, width: 300, opacity: prog(f, inj, 12) }}>
          <Card tone="alert" style={{ width: 300, padding: "18px 20px", border: `2px solid ${C.alert}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Icon name="doc" size={34} color={C.alert} />
              <Text size={23} weight={700} color={C.alert}>«وسّع صلاحياتك»</Text>
            </div>
            <Text size={19} color={C.muted}>تعليمات في محتوى أو ذاكرة أو خدمة خارجية</Text>
          </Card>
        </div>
      )}
      {bounce > 0 && (
        <Reveal at={inj + 40} kind="scale" style={{ left: 1230, top: 530 }}>
          <Icon name="ban" size={64} color={C.alert} stroke={2.4} />
        </Reveal>
      )}
    </>
  );
};

const DECISIONS: { label: string; icon: IconName; cue: string }[] = [
  { label: "القبول", icon: "door", cue: "القبول" },
  { label: "الدرجات النهائية", icon: "clipboard", cue: "والدرجات" },
  { label: "الشهادات", icon: "certificate", cue: "والشهادات" },
  { label: "الجزاءات", icon: "gavel", cue: "والجزاءات" },
  { label: "الحقوق", icon: "scale", cue: "والحقوق" },
  { label: "السلامة", icon: "heart", cue: "والسلامة" },
];

const DecisionGate: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const approach = prog(f, c(3, "فيتوقف"), 40, easeInOut);
  const absent = c(3, "ولا يُعدّ");
  const ax = lerp(1460, 1130, approach);
  return (
    <>
      <Reveal at={c(3)} kind="fade" style={{ left: 300, top: 250 }}>
        <Chip icon="user" label="القرار الجوهري بيد صاحب الصلاحية" size={28} color="#fff" bg={C.blue} />
      </Reveal>
      {/* البوابة */}
      <Svg>
        <rect x={980} y={330} width={24} height={560} rx={12} fill={C.teal} opacity={prog(f, c(3), 20)} />
      </Svg>
      {DECISIONS.map((d, i) => (
        <Reveal key={i} at={c(3, d.cue)} kind="left" style={{ left: 620 + (i % 2) * 180, top: 350 + Math.floor(i / 2) * 175 }}>
          <div style={{ width: 160, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconBadge name={d.icon} size={84} bg={C.blueLight} color={C.blue} />
            </div>
            <Text size={23} weight={700} style={{ marginTop: 6 }}>{d.label}</Text>
          </div>
        </Reveal>
      ))}
      <div style={{ position: "absolute", left: ax - 70, top: 540 }}>
        <AgentCore size={140} halted={approach >= 1} />
      </div>
      <Reveal at={c(3, "فيتوقف") + 40} kind="scale" style={{ left: 1030, top: 460 }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="pause" size={36} color="#fff" stroke={2.6} />
        </div>
      </Reveal>
      <Reveal at={c(3, "فيتوقف") + 44} kind="fade" style={{ left: 1300, top: 740, width: 420 }}>
        <Text size={25} weight={600} color={C.teal}>يتوقف قبل العمل الذي يتطلب اعتمادًا</Text>
      </Reveal>
      {/* مقعد المراجع الفارغ */}
      <Reveal at={absent} kind="up" style={{ left: 240, top: 370, width: 330 }}>
        <Card style={{ width: 330, padding: 24, textAlign: "center", border: `2px dashed ${C.lineStrong}` }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            <Icon name="user" size={60} color={C.faint} />
            <Icon name="clock" size={60} color={C.faint} />
          </div>
          <Text size={24} weight={600} color={C.muted}>المراجع غائب</Text>
        </Card>
      </Reveal>
      <Reveal at={absent + 24} kind="scale" style={{ left: 240, top: 640, width: 330 }}>
        <Card tone="alert" style={{ width: 330, padding: "18px 20px", textAlign: "center", border: `2px solid ${C.alert}` }}>
          <Text size={27} weight={700} color={C.alert}>غياب المراجع ≠ موافقة</Text>
        </Card>
      </Reveal>
      <Reveal at={absent + 34} kind="scale" style={{ left: 960, top: 290 }}>
        <IconBadge name="lock" size={68} round bg={C.teal} color="#fff" />
      </Reveal>
    </>
  );
};

const RoleSplit: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const skill = prog(f, c(4, "وتراجع"), 30);
  return (
    <>
      <Reveal at={c(4, "ما يتولاه")} kind="right" style={{ left: 1000, top: 290, width: 640 }}>
        <Card style={{ width: 640, height: 400, padding: 34 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <AgentCore size={80} style={{ position: "relative" }} />
            <Text size={32} weight={700}>ما يتولاه الوكيل</Text>
          </div>
          <Text size={25} color={C.muted} style={{ marginTop: 26 }}>تحدده الجهة وتوضّحه</Text>
          <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["مهام موضّحة", "ضمن التفويض"].map((x) => <Chip key={x} label={x} size={24} />)}
          </div>
        </Card>
      </Reveal>
      <Reveal at={c(4, "وما يبقى")} kind="left" style={{ left: 290, top: 290, width: 640 }}>
        <Card highlight={1} accent={C.blue} style={{ width: 640, height: 400, padding: 34 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <IconBadge name="users" size={80} round bg={C.blueLight} color={C.blue} />
            <Text size={32} weight={700}>ما يبقى على الفرد</Text>
          </div>
          <div style={{ marginTop: 34, display: "flex", gap: 14 }}>
            {["تعلم", "تقدير", "مسؤولية"].map((x, i) => (
              <Reveal key={x} at={c(4, ["من تعلم", "أو تقدير", "أو مسؤولية"][i])} kind="scale" style={{ position: "relative" }}>
                <Chip label={x} size={30} color={C.blue} />
              </Reveal>
            ))}
          </div>
          <Text size={22} color={C.muted} style={{ marginTop: 26 }}>المتعلم · الممارس · صاحب القرار</Text>
        </Card>
      </Reveal>
      <Reveal at={c(4, "وتراجع")} kind="up" style={{ left: 290, top: 740, width: 1350 }}>
        <Card tone="cyan" style={{ width: 1350, padding: "22px 34px", display: "flex", alignItems: "center", gap: 24 }}>
          <Icon name="eye" size={44} color={C.teal} />
          <Text size={27} weight={600}>تراجع الجهة: هل يُضعف الاستخدام المهارات المطلوبة؟</Text>
          <div style={{ flex: 1 }} />
          <div style={{ width: 260, height: 18, borderRadius: 9, background: C.line, overflow: "hidden" }}>
            <div style={{ width: `${lerp(90, 55, skill)}%`, height: "100%", background: skill > 0.5 ? C.alert : C.turquoise, borderRadius: 9 }} />
          </div>
        </Card>
      </Reveal>
    </>
  );
};
