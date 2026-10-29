import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Bars } from "../components/Bars";
import { Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { AUTONOMY, COL_X, IMPACT, ROW_Y } from "../data/matrix";
import { Card, Chip, IconBadge, Phase, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const CHARS: { label: string; icon: IconName }[] = [
  { label: "الغرض والمجال", icon: "target" },
  { label: "الأشخاص وبيئة الاستخدام", icon: "users" },
  { label: "البيانات والأنظمة", icon: "database" },
  { label: "الاستقلالية والتفويض", icon: "key" },
  { label: "الأثر المحتمل", icon: "chart" },
];

export const S09AutonomyImpact: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const b2 = c(2), b3 = c(3), b4 = c(4), b5 = c(5);
  const rowCue = [c(2, "وكيلٌ يقدّم"), c(2, "ووكيلٌ ينفّذ بعد"), c(2, "ووكيلٌ ينفّذ ضمن")];
  const colCue = [c(4, "محدود"), c(4, "ومتوسط"), c(4, "ومرتفع")];
  const grid = prog(f, b4, 30);
  // مثال التوصية برفض القبول يهبط في خلية: استقلالية منخفضة + أثر مرتفع
  const drop = prog(f, b5 + 10, 34, easeInOut);
  return (
    <SceneShell>
      <Phase at={c(1)} out={b2 - 6}>
        <Reveal at={c(1)} kind="fade" style={{ left: 0, right: 0, top: 330, textAlign: "center" }}>
          <Text size={32} weight={600} color={C.muted}>خصائص الاستخدام (ص 9)</Text>
        </Reveal>
        <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
          {CHARS.map((ch, i) => {
            const key = i >= 3;
            const hl = key && f > c(1, "ومن أهمها");
            return (
              <Reveal key={i} at={c(1) + 8 + i * 7} kind="up" style={{ position: "relative" }}>
                <Card highlight={hl ? 1 : 0} style={{ width: 300, height: 170, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 16, opacity: f > c(1, "ومن أهمها") && !key ? 0.4 : 1 }}>
                  <IconBadge name={ch.icon} size={62} />
                  <Text size={26} weight={700} style={{ textAlign: "center" }}>{ch.label}</Text>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Phase>

      {/* صفوف: درجات الاستقلالية */}
      {f >= b2 && (
        <>
          <Reveal at={b2} kind="fade" style={{ left: 1330, top: 300 }}>
            <Chip icon="key" label="درجة الاستقلالية" size={26} color="#fff" bg={C.teal} />
          </Reveal>
          {AUTONOMY.map((a, i) => (
            <Reveal key={i} at={rowCue[i]} kind="right" style={{ left: 1280, top: ROW_Y[i] - 75, width: 440 }}>
              <Card style={{ width: 440, height: 150, padding: "0 24px", display: "flex", gap: 18, alignItems: "center" }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: C.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 26 }}>{i + 1}</div>
                <div>
                  <Text size={28} weight={700}>{a.label}</Text>
                  <Text size={21} color={C.muted}>{a.who}</Text>
                </div>
                <div style={{ flex: 1 }} />
                <Icon name={a.icon} size={44} color={C.turquoiseDark} />
              </Card>
            </Reveal>
          ))}
          <Svg>
            <path d={`M 1745 ${ROW_Y[0] - 40} L 1745 ${ROW_Y[2] + 40}`} stroke={C.turquoise} strokeWidth={4} strokeLinecap="round" opacity={prog(f, rowCue[2], 20)} />
            <path d={`M 1733 ${ROW_Y[2] + 26} L 1745 ${ROW_Y[2] + 44} L 1757 ${ROW_Y[2] + 26}`} stroke={C.turquoise} strokeWidth={4} fill="none" strokeLinecap="round" opacity={prog(f, rowCue[2], 20)} />
          </Svg>
        </>
      )}

      {/* ملاحظة: ما يُسمح بتنفيذه، لا اختيار الخطوات */}
      <Phase at={b3} out={b4 - 6}>
        <Reveal at={b3} kind="left" style={{ left: 220, top: 400, width: 900 }}>
          <Card style={{ width: 900, padding: "30px 36px" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <Icon name="check" size={46} color={C.ok} stroke={2.4} />
              <Text size={30} weight={700}>تقيس: ما يُسمح بتنفيذه دون تحقق بشري مسبق</Text>
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 18, opacity: prog(f, c(3, "لا اختياره"), 16) }}>
              <Icon name="ban" size={46} color={C.alert} stroke={2.2} />
              <Text size={30} weight={700} color={C.muted}>لا تقيس: اختياره للخطوات أثناء المهمة</Text>
            </div>
          </Card>
        </Reveal>
        <Reveal at={c(3, "وقد يجمع")} kind="up" style={{ left: 220, top: 700, width: 900 }}>
          <Card tone="cyan" style={{ padding: "22px 30px", display: "flex", alignItems: "center", gap: 20 }}>
            <Text size={27} weight={600} color={C.teal}>استخدام واحد ←</Text>
            <Chip label="مهمة: الدرجة 1" size={23} />
            <Chip label="مهمة: الدرجة 3" size={23} />
          </Card>
        </Reveal>
      </Phase>

      {/* أعمدة: مستويات الأثر */}
      {f >= b4 && (
        <>
          <Svg>
            {COL_X.map((x, j) => (
              <rect key={j} x={x - 150} y={ROW_Y[0] - 85} width={300} height={ROW_Y[2] - ROW_Y[0] + 170} rx={22} fill={C.surface} stroke={C.line} opacity={grid * 0.7} />
            ))}
          </Svg>
          {IMPACT.map((im, j) => (
            <Reveal key={j} at={colCue[j]} kind="down" style={{ left: COL_X[j] - 150, top: 220, width: 300, textAlign: "center" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
                <Bars n={im.bars} size={40} />
                <Text size={30} weight={700}>{im.label}</Text>
              </div>
              <Text size={20} color={C.muted} style={{ marginTop: 4, lineHeight: 1.35 }}>{im.sub}</Text>
            </Reveal>
          ))}
          <Reveal at={b4 + 6} kind="fade" style={{ left: 250, top: 160 }}>
            <Text size={24} weight={600} color={C.turquoiseDark}>يُقدَّر الأثر بصورة مستقلة عن الاستقلالية ←</Text>
          </Reveal>
        </>
      )}
      {f >= b5 && (
        <div
          style={{
            position: "absolute",
            left: lerp(780, COL_X[2] - 140, drop),
            top: lerp(980, ROW_Y[0] - 62, drop),
            width: 280,
            opacity: prog(f, b5, 14),
          }}
        >
          <Card highlight={drop >= 1 ? 1 : 0} accent={C.alert} style={{ width: 280, padding: "16px 18px", textAlign: "center" }}>
            <Text size={24} weight={700}>توصية برفض قبول متعلم</Text>
            <Text size={19} color={C.muted}>الدرجة 1 · أثر مرتفع</Text>
          </Card>
        </div>
      )}
    </SceneShell>
  );
};
