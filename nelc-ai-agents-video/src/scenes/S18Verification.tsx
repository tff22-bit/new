import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C, FONT } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { Card, Chip, IconBadge, Phase, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const ST: { label: string; icon: IconName; x: number }[] = [
  { label: "قبل الإتاحة", icon: "flag", x: 1400 },
  { label: "أثناء الاستخدام", icon: "chart", x: 960 },
  { label: "عند التغيير", icon: "refresh", x: 520 },
];
const TY = 330;

export const S18Verification: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const active = f >= c(4) ? 2 : f >= c(3) ? 1 : f >= c(2) ? 0 : -1;
  return (
    <SceneShell>
      <Svg>
        <Conn d={`M ${ST[0].x} ${TY} L ${ST[2].x} ${TY}`} at={c(1, "لا يحدث")} dur={30} color={C.lineStrong} width={4} />
        <Conn d={`M ${ST[2].x} ${TY - 60} C ${ST[2].x} ${TY - 150} ${ST[0].x} ${TY - 150} ${ST[0].x} ${TY - 60}`} at={c(1, "بل يرافق")} dur={36} color={C.turquoise} dashed width={3} arrow={{ x: ST[0].x, y: TY - 60, angle: 90 }} />
      </Svg>
      {ST.map((s, i) => (
        <Reveal key={i} at={c(1, "لا يحدث") + i * 10} kind="scale" style={{ left: s.x - 150, top: TY - 50, width: 300, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: active === i ? C.teal : "#fff", border: `3px solid ${C.teal}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: active === i ? `0 0 0 10px ${C.teal}22` : "none" }}>
              <Icon name={s.icon} size={48} color={active === i ? "#fff" : C.teal} />
            </div>
          </div>
          <Text size={28} weight={700} style={{ marginTop: 10 }}>{s.label}</Text>
        </Reveal>
      ))}
      <Phase at={c(2)} out={c(3) - 6}>
        <Before />
      </Phase>
      <Phase at={c(3)} out={c(4) - 6}>
        <During />
      </Phase>
      <Phase at={c(4)}>
        <OnChange />
      </Phase>
    </SceneShell>
  );
};

const PANEL_TOP = 510;

const Before: React.FC = () => {
  const { c } = useCues();
  return (
    <>
      <Reveal at={c(2, "تحدد")} kind="up" style={{ left: 1100, top: PANEL_TOP, width: 560 }}>
        <Card style={{ width: 560, padding: 26 }}>
          <Text size={27} weight={700}>معايير القبول والأدلة اللازمة</Text>
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            {["الأداء", "السلامة", "الحقوق", "الفئة المستفيدة"].map((x) => <Chip key={x} label={x} size={21} />)}
          </div>
        </Card>
      </Reveal>
      <Reveal at={c(2, "ولا يُكتفى")} kind="up" style={{ left: 1100, top: PANEL_TOP + 220, width: 560 }}>
        <Card tone="alert" style={{ width: 560, padding: "20px 26px", display: "flex", gap: 16, alignItems: "center", border: `2px solid ${C.alert}` }}>
          <Icon name="ban" size={44} color={C.alert} stroke={2.2} />
          <Text size={25} weight={700}>لا يكفي: تجربة منفردة أو عرض توضيحي</Text>
        </Card>
      </Reveal>
      <Reveal at={c(2, "ويُميَّز")} kind="left" style={{ left: 260, top: PANEL_TOP, width: 760 }}>
        <Card style={{ width: 760, height: 330, padding: 28, display: "flex", gap: 26, alignItems: "stretch" }}>
          <div style={{ flex: 1, background: "#F4F8FA", borderRadius: 18, padding: 20, textAlign: "center" }}>
            <Icon name="megaphone" size={56} color={C.muted} />
            <Text size={25} weight={700} style={{ marginTop: 8 }}>ما يعلنه المورّد</Text>
            <Text size={21} color={C.muted}>منافع مُعلنة</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontFamily: FONT, fontSize: 50, fontWeight: 700, color: C.faint }}>≠</div>
          <div style={{ flex: 1, background: C.okLight, borderRadius: 18, padding: 20, textAlign: "center" }}>
            <Icon name="chart" size={56} color={C.ok} />
            <Text size={25} weight={700} style={{ marginTop: 8 }}>أدلة مستقلة</Text>
            <Text size={21} color={C.muted}>اختبارات مستقلة · تجارب ميدانية</Text>
          </div>
        </Card>
      </Reveal>
    </>
  );
};

const During: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const draw = prog(f, c(3, "تُتابع"), 60, easeInOut);
  const inc = c(3, "ولا يعوّض");
  const pts = Array.from({ length: 12 }).map((_, i) => ({ x: lerp(1560, 560, i / 11), y: 760 - (60 + Math.sin(i * 1.3) * 18 + i * 6) }));
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
  return (
    <>
      <Reveal at={c(3)} kind="up" style={{ left: 470, top: PANEL_TOP - 20, width: 1180 }}>
        <Card style={{ width: 1180, height: 390 }} />
      </Reveal>
      <Svg>
        <line x1={560} y1={760} x2={1560} y2={760} stroke={C.line} strokeWidth={2} opacity={prog(f, c(3), 20)} />
        <path d={d} fill="none" stroke={C.turquoise} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
        {f > inc && (
          <g opacity={prog(f, inc, 14)}>
            <circle cx={pts[7].x} cy={pts[7].y} r={20} fill={C.alert} opacity={0.2} />
            <circle cx={pts[7].x} cy={pts[7].y} r={10} fill={C.alert} />
          </g>
        )}
      </Svg>
      <Reveal at={c(3, "تُتابع")} kind="fade" style={{ left: 1290, top: PANEL_TOP + 10 }}>
        <Chip icon="chart" label="مؤشرات تحقق الغرض" size={22} />
      </Reveal>
      <Reveal at={c(3, "وتُرصد")} kind="fade" style={{ left: 1000, top: PANEL_TOP + 10 }}>
        <Chip icon="eye" label="رصد الأضرار والفروق" size={22} />
      </Reveal>
      <Reveal at={c(3, "ارتفاع")} kind="fade" style={{ left: 560, top: PANEL_TOP + 10 }}>
        <Chip icon="star" label="متوسط الأداء والرضا: مرتفع" size={22} color={C.ok} />
      </Reveal>
      <Reveal at={inc + 10} kind="up" style={{ left: pts[7].x - 230, top: 790, width: 460 }}>
        <Card tone="alert" style={{ padding: "14px 20px", textAlign: "center", border: `2px solid ${C.alert}` }}>
          <Text size={23} weight={700} color={C.alert}>إخفاق جوهري في السلامة أو الحقوق… لا يعوّضه المتوسط</Text>
        </Card>
      </Reveal>
    </>
  );
};

const OnChange: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const sw = prog(f, c(4, "إذا تغيّر") + 20, 24, easeInOut);
  const items = ["النموذج", "المورّد", "مصدر البيانات", "الصلاحيات"];
  return (
    <>
      <div style={{ position: "absolute", left: 1150, top: PANEL_TOP, display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((x, i) => (
          <Reveal key={x} at={c(4, ["النموذج", "أو المورّد", "أو مصدر", "أو الصلاحيات"][i])} kind="right" style={{ position: "relative" }}>
            <Card style={{ width: 480, height: 76, padding: "0 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text size={25} weight={700}>{x}</Text>
              <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: FONT, fontSize: 22, fontWeight: 700 }}>
                <span style={{ color: C.faint, textDecoration: sw > 0.5 ? "line-through" : "none" }}>v1</span>
                <span style={{ color: C.faint }}>←</span>
                <span style={{ color: C.turquoiseDark, opacity: sw }}>v2</span>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
      <Svg>
        <Conn d="M 1140 700 L 980 700" at={c(4, "تُعاد")} dur={16} color={C.teal} arrow={{ x: 980, y: 700, angle: 180 }} />
      </Svg>
      <Reveal at={c(4, "تُعاد")} kind="scale" style={{ left: 640, top: 590, width: 330 }}>
        <Card highlight={1} style={{ width: 330, height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center" }}>
          <IconBadge name="refresh" size={70} />
          <Text size={26} weight={700}>إعادة مراجعة الملاءمة</Text>
        </Card>
      </Reveal>
      <Reveal at={c(4, "ولا يُجري")} kind="up" style={{ left: 240, top: 840, width: 900 }}>
        <Card tone="cyan" style={{ padding: "16px 24px", display: "flex", gap: 14, alignItems: "center" }}>
          <Icon name="megaphone" size={38} color={C.teal} />
          <Text size={24} weight={600} color={C.teal}>لا تغيير مؤثر من المورّد دون إشعار يتيح التحقق منه</Text>
        </Card>
      </Reveal>
    </>
  );
};
