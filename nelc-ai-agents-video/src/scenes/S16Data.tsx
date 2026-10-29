import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C, FONT } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, FlowDot, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { AgentCore, Card, Chip, IconBadge, Phase, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

export const S16Data: React.FC = () => {
  const { c } = useCues();
  return (
    <SceneShell>
      <Phase at={c(1)} out={c(2) - 8}>
        <PurposeFilter />
      </Phase>
      <Phase at={c(2)} out={c(3) - 8}>
        <Inspection />
      </Phase>
      <Phase at={c(3)} out={c(4) - 8}>
        <Memory />
      </Phase>
      <Phase at={c(4)}>
        <Rights />
      </Phase>
    </SceneShell>
  );
};

// بيانات كثيرة تمر عبر مرشح الغرض، فلا يصل إلى الوكيل إلا القدر اللازم
const PurposeFilter: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const start = c(1, "تُعالَج");
  const tokens = Array.from({ length: 14 });
  return (
    <>
      <Reveal at={c(1)} kind="right" style={{ left: 1500, top: 420 }}>
        <IconBadge name="database" size={150} />
        <Text size={25} weight={700} style={{ width: 150, textAlign: "center", marginTop: 10 }}>البيانات</Text>
      </Reveal>
      <Svg>
        <path d="M 1180 380 L 1300 380 L 1260 520 L 1260 640 L 1220 660 L 1220 520 Z" fill="#EEFAFB" stroke={C.teal} strokeWidth={3} opacity={prog(f, c(1, "لغرض"), 20)} transform="translate(-20 0)" />
        {f > start &&
          tokens.map((_, i) => {
            const t = ((f - start) / 90 + i / tokens.length) % 1;
            const pass = i % 3 === 0;
            const x = lerp(1480, pass ? 820 : 1230, Math.min(1, t * (pass ? 1 : 1.6)));
            const y = 480 + ((i * 37) % 120) - 60;
            const yy = x < 1260 && pass ? lerp(y, 530, Math.min(1, (1260 - x) / 120)) : y;
            const o = pass ? 1 : 1 - Math.max(0, (t * 1.6 - 0.85) / 0.15);
            return <rect key={i} x={x - 9} y={yy - 9} width={18} height={18} rx={5} fill={pass ? C.turquoise : C.lineStrong} opacity={Math.max(0, o)} />;
          })}
      </Svg>
      <Reveal at={c(1, "لغرض")} kind="down" style={{ left: 1110, top: 290, width: 260, textAlign: "center" }}>
        <Text size={24} weight={700} color={C.teal}>غرض محدد ومشروع</Text>
      </Reveal>
      <Reveal at={c(1, "وبالقدر")} kind="up" style={{ left: 1100, top: 690, width: 280, textAlign: "center" }}>
        <Chip icon="filter" label="بالقدر اللازم" size={24} />
      </Reveal>
      <Reveal at={c(1, "وفق الأنظمة")} kind="up" style={{ left: 1080, top: 790, width: 320, textAlign: "center" }}>
        <Text size={22} color={C.muted}>وفق الأنظمة ذات العلاقة</Text>
      </Reveal>
      <Reveal at={c(1) + 10} kind="scale" style={{ left: 700, top: 460 }}>
        <AgentCore size={130} />
      </Reveal>
      {/* الموافقة ليست إذنًا مفتوحًا */}
      <Reveal at={c(1, "ولا تُعدّ")} kind="left" style={{ left: 170, top: 330, width: 430 }}>
        <Card style={{ width: 430, padding: "22px 26px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Icon name="check" size={36} color={C.ok} stroke={2.4} />
            <Text size={27} weight={700}>الموافقة</Text>
          </div>
          <Text size={23} color={C.muted} style={{ marginTop: 6 }}>ليست إذنًا مفتوحًا بـ:</Text>
          {["المشاركة", "تدريب النماذج"].map((x, i) => (
            <Reveal key={x} at={c(1, i === 0 ? "بالمشاركة" : "أو تدريب")} kind="right" style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12, background: C.alertLight, borderRadius: 12, padding: "10px 14px" }}>
                <Icon name="ban" size={30} color={C.alert} stroke={2.2} />
                <Text size={25} weight={600}>{x}</Text>
              </div>
            </Reveal>
          ))}
        </Card>
      </Reveal>
    </>
  );
};

const Inspection: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const inAt = c(2, "ما يصل");
  const outAt = c(2, "وما يرسله");
  const borderAt = c(2, "وشروط النقل");
  const targets: { label: string; icon: IconName; y: number }[] = [
    { label: "موردون", icon: "building", y: 360 },
    { label: "أدوات", icon: "tool", y: 560 },
    { label: "وكلاء آخرون", icon: "chat", y: 760 },
  ];
  const t = (s: number) => ((f - s) / 70) % 1;
  return (
    <>
      <Reveal at={c(2)} kind="scale" style={{ left: 890, top: 490 }}>
        <AgentCore size={140} />
      </Reveal>
      {/* الوارد */}
      <Reveal at={inAt} kind="right" style={{ left: 1500, top: 490 }}>
        <IconBadge name="doc" size={120} />
        <Text size={24} weight={700} style={{ width: 120, textAlign: "center", marginTop: 8 }}>مصادر</Text>
      </Reveal>
      <Svg>
        <Conn d="M 1490 560 L 1050 560" at={inAt + 6} dur={20} color={C.blue} arrow={{ x: 1050, y: 560, angle: 180 }} />
        {f > inAt + 30 && <FlowDot point={{ x: lerp(1490, 1050, t(inAt + 30)), y: 560 }} color={C.blue} r={7} />}
        {targets.map((tg, i) => (
          <Conn key={i} d={`M 880 560 C 760 560 720 ${tg.y} 560 ${tg.y}`} at={outAt + i * 6} dur={20} color={C.turquoise} arrow={{ x: 560, y: tg.y, angle: 180 }} />
        ))}
        {/* حد النقل خارج المملكة */}
        <line x1={300} y1={250} x2={300} y2={900} stroke={C.teal} strokeWidth={3} strokeDasharray="12 10" opacity={prog(f, borderAt, 20)} />
      </Svg>
      <Reveal at={inAt + 14} kind="scale" style={{ left: 1240, top: 510 }}>
        <IconBadge name="search" size={90} round bg="#fff" color={C.blue} />
      </Reveal>
      <Reveal at={outAt + 14} kind="scale" style={{ left: 640, top: 375 }}>
        <IconBadge name="search" size={74} round bg="#fff" color={C.turquoiseDark} />
      </Reveal>
      {targets.map((tg, i) => (
        <Reveal key={i} at={outAt + 10 + i * 6} kind="left" style={{ left: 340, top: tg.y - 45, width: 210 }}>
          <Card style={{ width: 210, height: 90, display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }}>
            <Icon name={tg.icon} size={36} color={C.turquoiseDark} />
            <Text size={24} weight={700}>{tg.label}</Text>
          </Card>
        </Reveal>
      ))}
      <Reveal at={borderAt} kind="fade" style={{ left: 90, top: 470, width: 200, textAlign: "center" }}>
        <Icon name="globe" size={60} color={C.teal} />
        <Text size={22} weight={600} color={C.teal}>النقل خارج المملكة</Text>
        <Text size={19} color={C.muted}>تُفحص شروطه حيث تنطبق</Text>
      </Reveal>
      <Reveal at={c(2, "قبل تمكين")} kind="up" style={{ left: 640, top: 880, width: 800, textAlign: "center" }}>
        <Text size={27} weight={600} color={C.teal}>الفحص يسبق تمكين الوصول أو المشاركة</Text>
      </Reveal>
    </>
  );
};

const Memory: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const people = ["متعلم (أ)", "متعلم (ب)", "متعلم (ج)"];
  const mixAt = c(3, "ويُمنع");
  const mix = prog(f, mixAt, 30, easeInOut);
  return (
    <>
      <Reveal at={c(3)} kind="fade" style={{ left: 1260, top: 250 }}>
        <Chip icon="layers" label="ذاكرة الوكيل" size={26} color="#fff" bg={C.teal} />
      </Reveal>
      {people.map((p, i) => (
        <Reveal key={i} at={c(3) + i * 8} kind="up" style={{ left: 1260 - i * 420, top: 340, width: 380 }}>
          <Card style={{ width: 380, height: 360, padding: 24, border: mix > 0.5 ? `3px solid ${C.teal}` : `1px solid ${C.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text size={27} weight={700}>{p}</Text>
              <Icon name="lock" size={32} color={mix > 0.5 ? C.teal : C.faint} />
            </div>
            {[
              { k: "ما يُحفظ", cue: "ما يُحفظ" },
              { k: "سبب حفظه", cue: "وسبب" },
              { k: "مدته", cue: "ومدته" },
            ].map((row, k) => (
              <Reveal key={k} at={c(3, row.cue)} kind="right" style={{ position: "relative" }}>
                <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 12, background: "#F4F8FA", fontFamily: FONT, fontSize: 23, fontWeight: 600, color: C.charcoal }}>{row.k}</div>
              </Reveal>
            ))}
            <Reveal at={c(3, "تصحيحه")} kind="fade" style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
                <Chip icon="pencil" label="تصحيح" size={20} />
                <Chip icon="trash" label="حذف" size={20} />
              </div>
            </Reveal>
          </Card>
        </Reveal>
      ))}
      <Reveal at={mixAt + 10} kind="up" style={{ left: 0, right: 0, top: 760, display: "flex", justifyContent: "center" }}>
        <Card tone="cyan" style={{ padding: "18px 30px", display: "flex", gap: 16, alignItems: "center" }}>
          <Icon name="ban" size={40} color={C.teal} stroke={2.2} />
          <Text size={27} weight={600} color={C.teal}>لا اختلاط بين بيانات الأفراد</Text>
        </Card>
      </Reveal>
    </>
  );
};

const Rights: React.FC = () => {
  const { c } = useCues();
  return (
    <>
      <Reveal at={c(4)} kind="right" style={{ left: 1150, top: 290, width: 500 }}>
        <Card style={{ width: 500, padding: 28 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <IconBadge name="book" size={70} />
            <div>
              <Text size={28} weight={700}>مصادر ومحتوى</Text>
              <Text size={22} color={C.muted}>الملكية الفكرية وشروط الاستخدام</Text>
            </div>
          </div>
          <Reveal at={c(4, "وشروط")} kind="up" style={{ position: "relative", marginTop: 18 }}>
            <Chip icon="check" label="ترخيص أو مسوّغ نظامي" size={22} color={C.ok} />
          </Reveal>
        </Card>
      </Reveal>
      <Reveal at={c(4, "دون افتراض")} kind="left" style={{ left: 280, top: 290, width: 560 }}>
        <Card style={{ width: 560, padding: 28 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <IconBadge name="sparkle" size={70} />
            <Text size={28} weight={700}>مخرج مولّد آليًا</Text>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 18, background: C.alertLight, borderRadius: 12, padding: "10px 14px" }}>
            <Icon name="copyright" size={34} color={C.alert} />
            <Text size={24} weight={600}>لا افتراض لملكية حصرية</Text>
          </div>
        </Card>
      </Reveal>
      <Reveal at={c(4, "فإمكانية")} kind="up" style={{ left: 280, top: 640, width: 1370 }}>
        <Card tone="cyan" style={{ width: 1370, height: 150, padding: "0 50px", display: "flex", alignItems: "center", justifyContent: "center", gap: 40, border: `2px solid ${C.turquoise}` }}>
          <Chip icon="key" label="إمكانية الوصول التقني" size={28} />
          <div style={{ fontFamily: FONT, fontSize: 64, fontWeight: 700, color: C.alert }}>≠</div>
          <Chip icon="scale" label="الحق في الاستخدام" size={28} />
        </Card>
      </Reveal>
    </>
  );
};
