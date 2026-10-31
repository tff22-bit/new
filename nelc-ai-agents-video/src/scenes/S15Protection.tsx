import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, FlowDot, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { AgentCore, Card, Chip, IconBadge, Phase, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

export const S15Protection: React.FC = () => {
  const { c } = useCues();
  return (
    <SceneShell>
      <Phase at={c(1)} out={c(2) - 8}>
        <Safety />
      </Phase>
      <Phase at={c(2)} out={c(3) - 8}>
        <Autonomy />
      </Phase>
      <Phase at={c(3)} out={c(4) - 8}>
        <Fairness />
      </Phase>
      <Phase at={c(4)}>
        <Access />
      </Phase>
    </SceneShell>
  );
};

const Safety: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const dome = prog(f, c(1, "يراعي"), 34, easeInOut);
  const ref = c(1, "والإحالة");
  const specs = ["أخصائي نفسي", "أخصائي صحي", "أخصائي اجتماعي"];
  return (
    <>
      <Svg>
        <path d={`M 560 820 A 340 340 0 0 1 1240 820`} fill="rgba(139,92,246,0.06)" stroke={C.turquoise} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - dome} />
        <line x1={520} y1={820} x2={1280} y2={820} stroke={C.lineStrong} strokeWidth={3} opacity={dome} />
        {specs.map((_, i) => (
          <Conn key={i} d={`M 1000 640 C 1150 640 1250 ${360 + i * 180} 1400 ${360 + i * 180}`} at={ref + i * 8} dur={20} color={C.blue} dashed arrow={{ x: 1400, y: 360 + i * 180, angle: 0 }} />
        ))}
      </Svg>
      <Reveal at={c(1)} kind="scale" style={{ left: 830, top: 600 }}>
        <IconBadge name="student" size={140} round bg="#fff" color={C.turquoiseDark} />
      </Reveal>
      <Reveal at={c(1, "وعمرهما")} kind="fade" style={{ left: 640, top: 520, display: "flex", gap: 10 }}>
        {["السلامة", "العمر", "الاحتياجات"].map((x) => <Chip key={x} label={x} size={22} />)}
      </Reveal>
      <Reveal at={c(1) + 10} kind="scale" style={{ left: 640, top: 640 }}>
        <AgentCore size={110} />
      </Reveal>
      <Reveal at={c(1, "مع حدود")} kind="fade" style={{ left: 600, top: 840 }}>
        <Chip icon="shield" label="حدود واضحة للدعم" size={24} />
      </Reveal>
      {specs.map((s, i) => (
        <Reveal key={i} at={ref + 12 + i * 8} kind="left" style={{ left: 1420, top: 360 + i * 180 - 50, width: 330 }}>
          <Card style={{ width: 330, height: 100, display: "flex", alignItems: "center", gap: 16, padding: "0 22px" }}>
            <IconBadge name="heart" size={56} bg={C.blueLight} color={C.blue} round />
            <Text size={26} weight={700}>{s}</Text>
          </Card>
        </Reveal>
      ))}
      <Reveal at={c(1, "ولا يُستخدم")} kind="up" style={{ left: 200, top: 320, width: 480 }}>
        <Card tone="alert" style={{ padding: "20px 26px", display: "flex", gap: 16, alignItems: "center", border: `2px solid ${C.alert}` }}>
          <Icon name="ban" size={44} color={C.alert} stroke={2.2} />
          <Text size={26} weight={700}>الوكيل ليس بديلًا عن المختص المؤهل</Text>
        </Card>
      </Reveal>
    </>
  );
};

const Autonomy: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const bad: { icon: IconName; label: string; cue: string }[] = [
    { icon: "heart", label: "إيهام بوعي بشري أو علاقة شخصية", cue: "فلا يوهمه" },
    { icon: "clock", label: "ضغط عاطفي لإطالة الاستخدام", cue: "ولا يستخدم" },
  ];
  const wall = prog(f, c(2, "وتُفصل"), 30, easeInOut);
  return (
    <>
      <Reveal at={c(2)} kind="fade" style={{ left: 1210, top: 250 }}>
        <Chip icon="user" label="خيارات المستخدم محترمة" size={26} color="#fff" bg={C.teal} />
      </Reveal>
      {bad.map((b, i) => (
        <Reveal key={i} at={c(2, b.cue)} kind="right" style={{ left: 1060, top: 360 + i * 170, width: 600 }}>
          <Card style={{ width: 600, height: 130, padding: "0 26px", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative" }}>
              <IconBadge name={b.icon} size={70} bg={C.alertLight} color={C.alert} />
              <div style={{ position: "absolute", left: -8, top: -8 }}>
                <Icon name="ban" size={34} color={C.alert} stroke={2.6} />
              </div>
            </div>
            <Text size={27} weight={700}>{b.label}</Text>
          </Card>
        </Reveal>
      ))}
      {/* جدار فاصل بين التوصية التعليمية والإعلان */}
      <Reveal at={c(2, "وتُفصل")} kind="up" style={{ left: 660, top: 360, width: 300 }}>
        <Card tone="ok" style={{ width: 300, height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Icon name="book" size={70} color={C.ok} />
          <Text size={28} weight={700} style={{ textAlign: "center" }}>توصية تعليمية</Text>
        </Card>
      </Reveal>
      <Svg>
        <rect x={600} y={lerp(830, 330, wall)} width={22} height={lerp(0, 360, wall)} rx={8} fill={C.teal} />
      </Svg>
      <Reveal at={c(2, "وتُفصل") + 12} kind="left" style={{ left: 260, top: 360, width: 300 }}>
        <Card tone="soft" style={{ width: 300, height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, border: `2px dashed ${C.lineStrong}` }}>
          <Icon name="megaphone" size={70} color={C.muted} />
          <Text size={26} weight={700} color={C.muted} style={{ textAlign: "center" }}>الإعلان والمصالح التجارية</Text>
        </Card>
      </Reveal>
    </>
  );
};

const Fairness: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const groups = ["فئة أ", "فئة ب", "لغة أ", "لغة ب"];
  const before = [0.85, 0.5, 0.8, 0.45];
  const fix = prog(f, c(3, "فتُفحص") + 40, 50, easeInOut);
  const unlock = prog(f, c(3, "فلا تتحول"), 30, easeInOut);
  return (
    <>
      <Reveal at={c(3, "فتُفحص")} kind="fade" style={{ left: 1110, top: 260 }}>
        <Chip icon="search" label="فحص الفروق المؤثرة في الأداء" size={24} />
      </Reveal>
      <Svg>
        <line x1={1060} y1={800} x2={1680} y2={800} stroke={C.lineStrong} strokeWidth={3} opacity={prog(f, c(3), 20)} />
      </Svg>
      {groups.map((g, i) => {
        const h = 400 * lerp(before[i], 0.82, fix) * prog(f, c(3, "فتُفحص") + i * 6, 24);
        const low = before[i] < 0.6 && fix < 0.5;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 1600 - i * 150, top: 800 - h, width: 90, height: h, borderRadius: "16px 16px 4px 4px", background: low ? C.alert : C.turquoise, opacity: 0.9 }} />
            <div style={{ position: "absolute", left: 1580 - i * 150, top: 815, width: 130, textAlign: "center" }}>
              <Text size={23} weight={600} color={C.muted}>{g}</Text>
            </div>
          </React.Fragment>
        );
      })}
      {/* حكم دائم ← قابل للتصحيح */}
      <Reveal at={c(3, "وتبقى")} kind="left" style={{ left: 240, top: 360, width: 620 }}>
        <Card style={{ width: 620, padding: "30px 34px" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <IconBadge name={unlock > 0.5 ? "refresh" : "lock"} size={76} bg={unlock > 0.5 ? C.okLight : C.alertLight} color={unlock > 0.5 ? C.ok : C.alert} />
            <div>
              <Text size={24} color={C.muted}>استنتاج الوكيل عن المستفيد</Text>
              <Text size={32} weight={700} color={unlock > 0.5 ? C.ok : C.alert}>{unlock > 0.5 ? "قابل للتصحيح والمراجعة" : "حكم دائم؟"}</Text>
            </div>
          </div>
        </Card>
      </Reveal>
      <Reveal at={c(3, "فلا تتحول") + 20} kind="up" style={{ left: 240, top: 600, width: 620 }}>
        <Text size={25} weight={600} color={C.teal}>لا يتحول إلى حكم دائم يقيّد فرص المستفيد</Text>
      </Reveal>
    </>
  );
};

const Access: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const ys = [380, 560, 740];
  return (
    <>
      <Reveal at={c(4)} kind="scale" style={{ left: 1430, top: 470 }}>
        <IconBadge name="users" size={170} round bg="#fff" color={C.blue} />
        <Text size={27} weight={700} style={{ textAlign: "center", width: 300, marginRight: -65, marginTop: 10 }}>المستخدمون جميعًا</Text>
      </Reveal>
      <Reveal at={c(4, "بمن فيهم")} kind="scale" style={{ left: 1550, top: 430 }}>
        <IconBadge name="access" size={70} round bg={C.blue} color="#fff" />
      </Reveal>
      <Svg>
        {ys.map((y, i) => (
          <Conn key={i} d={`M 1410 555 C 1200 555 1100 ${y} 860 ${y} L 700 555`} at={c(4, "الوصول") + i * 8} dur={30} color={C.turquoise} width={3} />
        ))}
        {f > c(4, "الوصول") + 40 &&
          ys.map((y, i) => {
            const t = ((f - c(4, "الوصول") - 40 + i * 25) / 70) % 1;
            const x = lerp(1410, 700, t);
            return <FlowDot key={i} point={{ x, y: t < 0.77 ? lerp(555, y, Math.min(1, t * 3)) : lerp(y, 555, (t - 0.77) / 0.23) }} r={6} />;
          })}
      </Svg>
      <Reveal at={c(4, "الوصول") + 20} kind="fade" style={{ left: 920, top: 300 }}>
        <Text size={23} weight={600} color={C.muted}>وسائل مساندة مناسبة</Text>
      </Reveal>
      <Reveal at={c(4, "الوظائف")} kind="left" style={{ left: 310, top: 440, width: 400 }}>
        <Card highlight={1} style={{ width: 400, height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Icon name="check" size={60} color={C.ok} stroke={2.4} />
          <Text size={29} weight={700} style={{ textAlign: "center" }}>الوظائف الأساسية والمشاركة المنصفة</Text>
        </Card>
      </Reveal>
    </>
  );
};
