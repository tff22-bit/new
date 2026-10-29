import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, FlowDot, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { AgentCore, Card, Chip, IconBadge, Phase, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

export const S14Accountability: React.FC = () => {
  const { c } = useCues();
  return (
    <SceneShell>
      <Phase at={c(1)} out={c(2) - 8}>
        <ResponsibilityMap />
      </Phase>
      <Phase at={c(2)} out={c(3) - 8}>
        <Disclosure />
      </Phase>
      <Phase at={c(3)}>
        <TraceLog />
      </Phase>
    </SceneShell>
  );
};

const ResponsibilityMap: React.FC = () => {
  const { c } = useCues();
  const parties: { label: string; icon: IconName | "agent"; x: number }[] = [
    { label: "الجهة", icon: "building", x: 1400 },
    { label: "مورّد", icon: "code", x: 1100 },
    { label: "مورّد آخر", icon: "code", x: 800 },
    { label: "وكيل", icon: "agent", x: 500 },
  ];
  const duties = ["التصميم", "التوفير", "القرار", "المتابعة", "معالجة الأخطاء"];
  const ownerAt = c(1, "إذ تعيّن");
  return (
    <>
      <Svg>
        {parties.slice(1).map((p, i) => (
          <Conn key={i} d={`M ${parties[i].x - 80} 420 L ${p.x + 80} 420`} at={c(1, "أكثر من") + i * 6} dur={12} color={C.lineStrong} width={2.5} />
        ))}
      </Svg>
      {parties.map((p, i) => (
        <Reveal key={i} at={c(1, "أكثر من") + i * 6} kind="scale" style={{ left: p.x - 70, top: 350 }}>
          {p.icon === "agent" ? <AgentCore size={140} style={{ position: "relative" }} /> : <IconBadge name={p.icon} size={140} round bg="#fff" color={i === 0 ? C.blue : C.turquoiseDark} />}
          <Text size={26} weight={700} style={{ textAlign: "center", width: 140, marginTop: 10 }}>{p.label}</Text>
        </Reveal>
      ))}
      <Reveal at={ownerAt} kind="down" style={{ left: 1300, top: 250 }}>
        <Chip icon="user" label="مسؤول عن الاستخدام" size={24} color="#fff" bg={C.blue} />
      </Reveal>
      <Svg>
        {duties.map((_, i) => {
          const x = 1420 - i * 230;
          return <Conn key={i} d={`M ${x} 720 L ${x} 640 L ${lerp(1420, 500, i / 4)} 640 L ${lerp(1420, 500, i / 4)} 590`} at={c(1, duties[i]) + 8} dur={16} color={C.turquoise} width={2.5} />;
        })}
      </Svg>
      {duties.map((d, i) => (
        <Reveal key={i} at={c(1, d)} kind="up" style={{ left: 1420 - i * 230 - 105, top: 720, width: 210 }}>
          <Card style={{ width: 210, height: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Icon name="check" size={30} color={C.ok} stroke={2.4} />
            <Text size={25} weight={700}>{d}</Text>
          </Card>
        </Reveal>
      ))}
      <Reveal at={c(1, "معالجة الأخطاء") + 20} kind="fade" style={{ left: 0, right: 0, top: 870, textAlign: "center" }}>
        <Text size={26} weight={600} color={C.teal}>مسؤوليات محددة وموزّعة بوضوح بين الأطراف</Text>
      </Reveal>
    </>
  );
};

const Disclosure: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const why = prog(f, c(2, "مع تفسير"), 30, easeInOut);
  return (
    <>
      {/* بطاقة نتيجة كما يراها المستخدم */}
      <Reveal at={c(2)} kind="right" style={{ left: 1000, top: 250, width: 660 }}>
        <Card style={{ width: 660, padding: 30 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <IconBadge name="sparkle" size={54} />
            <div>
              <Text size={27} weight={700}>هذا وكيل ذكاء اصطناعي</Text>
              <Text size={21} color={C.muted}>طبيعته · غرضه · حدود الاعتماد عليه</Text>
            </div>
          </div>
          <div style={{ height: 1, background: C.line, margin: "22px 0" }} />
          <Reveal at={c(2, "ويُميَّز")} kind="up" style={{ position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F4F8FA", borderRadius: 14, padding: "14px 18px" }}>
                <Text size={25} weight={600}>توصية بنشاط إضافي</Text>
                <Chip icon="sparkle" label="أنتجه الوكيل" size={20} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F4F8FA", borderRadius: 14, padding: "14px 18px" }}>
                <Text size={25} weight={600}>خطة الوحدة المعتمدة</Text>
                <Chip icon="teacher" label="اعتماد بشري" size={20} color={C.blue} />
              </div>
            </div>
          </Reveal>
        </Card>
      </Reveal>
      <Reveal at={c(2, "بلغة")} kind="fade" style={{ left: 1000, top: 740 }}>
        <Chip icon="chat" label="بلغة تناسب المستخدم والمستفيد" size={22} />
      </Reveal>
      {/* التفسير */}
      <div style={{ position: "absolute", left: 260, top: 250, width: 640, opacity: why, transform: `translateX(${(1 - why) * -30}px)` }}>
        <Card tone="cyan" style={{ width: 640, padding: 30, border: `2px solid ${C.turquoise}` }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Icon name="question" size={44} color={C.teal} />
            <Text size={28} weight={700}>لماذا هذه النتيجة؟</Text>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            {["المصادر", "البيانات", "القواعد", "الخطوات المنفّذة"].map((x) => <Chip key={x} label={x} size={22} />)}
          </div>
        </Card>
      </div>
      <Reveal at={c(2, "دون اشتراط")} kind="up" style={{ left: 260, top: 560, width: 640 }}>
        <Card style={{ width: 640, padding: "24px 30px", display: "flex", gap: 20, alignItems: "center", border: `2px dashed ${C.lineStrong}` }}>
          <IconBadge name="lock" size={66} bg="#EEF2F4" color={C.muted} />
          <div>
            <Text size={25} weight={700} color={C.muted}>خطوات الاستدلال الداخلية للنموذج</Text>
            <Text size={21} color={C.faint}>لا يُشترط كشفها</Text>
          </div>
        </Card>
      </Reveal>
    </>
  );
};

const TraceLog: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const items: { label: string; icon: IconName; cue: string }[] = [
    { label: "المدخلات", icon: "doc", cue: "للمدخلات" },
    { label: "المصادر", icon: "search", cue: "والمصادر" },
    { label: "التفويض", icon: "key", cue: "والتفويض" },
  ];
  const req = c(3, "ووسيلة");
  const flow = prog(f, req + 20, 40, easeInOut);
  return (
    <>
      <Reveal at={c(3)} kind="fade" style={{ left: 1300, top: 250 }}>
        <Chip icon="list" label="سجلات قابلة للتتبع" size={26} color="#fff" bg={C.teal} />
      </Reveal>
      <Svg>
        <Conn d="M 1259 330 L 1259 760" at={c(3) + 6} dur={40} color={C.lineStrong} width={3} />
      </Svg>
      {items.map((it, i) => (
        <Reveal key={i} at={c(3, it.cue)} kind="right" style={{ left: 1200, top: 360 + i * 150, width: 400 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexDirection: "row" }}>
            <Card style={{ width: 310, height: 100, padding: "0 22px", display: "flex", alignItems: "center", gap: 14 }}>
              <Icon name={it.icon} size={38} color={C.turquoiseDark} />
              <Text size={27} weight={700}>{it.label}</Text>
            </Card>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.turquoise, border: "5px solid #fff", boxShadow: `0 0 0 2px ${C.turquoise}` }} />
          </div>
        </Reveal>
      ))}
      {/* طلب المراجعة */}
      <Reveal at={req} kind="scale" style={{ left: 830, top: 440 }}>
        <IconBadge name="student" size={120} round bg="#fff" color={C.turquoiseDark} />
        <Text size={24} weight={700} style={{ textAlign: "center", width: 120, marginTop: 8 }}>المستفيد</Text>
      </Reveal>
      <Reveal at={req + 10} kind="up" style={{ left: 760, top: 640 }}>
        <Chip icon="refresh" label="طلب التصحيح أو المراجعة" size={24} color="#fff" bg={C.blue} />
      </Reveal>
      <Svg>
        <Conn d="M 810 500 L 520 500" at={req + 20} dur={30} color={C.blue} arrow={{ x: 520, y: 500, angle: 180 }} />
        {flow > 0 && flow < 1 && <FlowDot point={{ x: lerp(810, 520, flow), y: 500 }} color={C.blue} r={8} />}
      </Svg>
      <Reveal at={req + 40} kind="scale" style={{ left: 380, top: 440 }}>
        <IconBadge name="teacher" size={120} round bg={C.blueLight} color={C.blue} />
        <Text size={24} weight={700} style={{ textAlign: "center", width: 160, marginRight: -20, marginTop: 8 }}>مسؤول بشري</Text>
      </Reveal>
      <Reveal at={c(3, "دون تحميل")} kind="up" style={{ left: 330, top: 780, width: 700 }}>
        <Card tone="cyan" style={{ padding: "18px 26px", textAlign: "center" }}>
          <Text size={26} weight={600} color={C.teal}>وسيلة معروفة… دون عبء فني على المستفيد</Text>
        </Card>
      </Reveal>
    </>
  );
};
