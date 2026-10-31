import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Bars } from "../components/Bars";
import { Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { AUTONOMY, CELLS, COL_X, IMPACT, ROW_Y } from "../data/matrix";
import { Card, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

// تدرّج لون الخلية بحسب مستوى الحماية والتحقق
const SHADES = ["#E6F7F9", "#C5EDF1", "#8FDAE2", "#3FB9C4", C.teal];
const CW = 300, CH = 168;

const SHORT = [...CELLS.map((r) => [...r])];
SHORT[2][2] = "لا تنفيذ ذاتي لما يمس القرارات الجوهرية";

const DETAIL: { icon: IconName; label: string; cue: string }[] = [
  { icon: "refresh", label: "إجراءات قابلة للتراجع فقط", cue: "القابلة للتراجع" },
  { icon: "key", label: "تفويض محدود", cue: "تفويض محدود" },
  { icon: "eye", label: "رقابة مستمرة", cue: "ورقابة" },
  { icon: "stop", label: "إمكانية الإيقاف الفوري", cue: "وإمكانية" },
];

export const S10Matrix: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const cellAt = [
    [c(2, "يكفيه"), c(2, "بينما"), c(2, "تحققًا أعمق")],
    [c(3, "تتدرج"), c(3, "حتى تصل") - 20, c(3, "اعتماد من")],
    [c(4, "فيبدأ"), c(4, "ثم أدلة"), c(5, "لا يُنفِّذ")],
  ];
  const wash = prog(f, c(1, "فكلما"), 50, easeInOut);
  const zoom = prog(f, c(5, "ويقتصر") - 10, 30, easeInOut);
  const rowHl = (i: number) => {
    const s = [c(2), c(3), c(4)][i];
    const e = [c(3), c(4), c(5)][i];
    return f >= s && f < e ? 1 : 0;
  };
  return (
    <SceneShell>
      {/* رؤوس الصفوف والأعمدة */}
      {AUTONOMY.map((a, i) => (
        <Reveal key={i} at={4 + i * 6} kind="right" style={{ left: 1280, top: ROW_Y[i] - CH / 2, width: 440 }}>
          <Card highlight={rowHl(i)} style={{ width: 440, height: CH, padding: "0 24px", display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: C.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 26 }}>{i + 1}</div>
            <div>
              <Text size={27} weight={700}>{a.label}</Text>
              <Text size={21} color={C.muted}>({a.who})</Text>
            </div>
          </Card>
        </Reveal>
      ))}
      {IMPACT.map((im, j) => (
        <Reveal key={j} at={8 + j * 6} kind="down" style={{ left: COL_X[j] - CW / 2, top: 245, width: CW, textAlign: "center" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
            <Bars n={im.bars} size={40} />
            <Text size={30} weight={700}>{im.label}</Text>
          </div>
        </Reveal>
      ))}
      {/* سهم الاتجاه العام */}
      <Svg>
        <defs>
          <linearGradient id="washg" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.cyanLight} stopOpacity="0.2" />
            <stop offset="1" stopColor={C.turquoise} stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <rect x={COL_X[2] - CW / 2 - 20} y={ROW_Y[0] - CH / 2 - 20} width={COL_X[0] - COL_X[2] + CW + 40} height={ROW_Y[2] - ROW_Y[0] + CH + 40} rx={30} fill="url(#washg)" opacity={wash * (1 - prog(f, c(2), 20))} />
        {wash > 0 && (
          <g opacity={wash * (1 - prog(f, c(2), 20))}>
            <path d={`M ${COL_X[0] + 60} ${ROW_Y[0] - 20} L ${lerp(COL_X[0] + 60, COL_X[2] - 40, wash)} ${lerp(ROW_Y[0] - 20, ROW_Y[2] + 30, wash)}`} stroke={C.teal} strokeWidth={6} strokeLinecap="round" />
          </g>
        )}
      </Svg>
      <Reveal at={c(1, "فكلما") + 30} kind="fade" out={c(2)} style={{ left: COL_X[1] - 230, top: ROW_Y[1] - 30, width: 460, textAlign: "center" }}>
        <Text size={32} weight={700} color={C.teal}>حماية وتحقق أعلى</Text>
      </Reveal>
      {/* الخلايا */}
      {CELLS.map((row, i) =>
        row.map((_, j) => {
          const lvl = i + j;
          const dark = lvl >= 3;
          const crit = i === 2 && j === 2;
          return (
            <Reveal key={`${i}${j}`} at={cellAt[i][j]} kind="scale" style={{ left: COL_X[j] - CW / 2, top: ROW_Y[i] - CH / 2 }}>
              <div
                style={{
                  width: CW,
                  height: CH,
                  borderRadius: 20,
                  background: SHADES[lvl],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                  boxSizing: "border-box",
                  textAlign: "center",
                  boxShadow: crit ? `0 0 0 4px ${C.alert}` : "none",
                  opacity: zoom > 0 && !crit ? 1 - zoom * 0.6 : 1,
                }}
              >
                <Text size={crit ? 25 : 26} weight={700} color={dark ? "#fff" : C.charcoal} style={{ lineHeight: 1.35 }}>{SHORT[i][j]}</Text>
              </div>
            </Reveal>
          );
        }),
      )}
      {/* تفصيل الخلية الأعلى حساسية */}
      {zoom > 0 && (
        <div style={{ position: "absolute", left: 140, top: lerp(ROW_Y[2], 330, zoom), width: 820, opacity: zoom, transform: `scale(${0.8 + 0.2 * zoom})`, transformOrigin: "0% 100%" }}>
          <Card highlight={1} accent={C.alert} style={{ width: 820, padding: "28px 34px" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Icon name="shield" size={50} color={C.alert} stroke={2} />
              <Text size={29} weight={700}>لا يُنفِّذ ذاتيًا ما يمس القرارات الجوهرية (م5)</Text>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 22 }}>
              {DETAIL.map((d, k) => (
                <Reveal key={k} at={c(5, d.cue)} kind="up" style={{ position: "relative" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", background: "#F8F5FE", borderRadius: 16, padding: "14px 18px" }}>
                    <Icon name={d.icon} size={40} color={C.teal} />
                    <Text size={25} weight={600}>{d.label}</Text>
                  </div>
                </Reveal>
              ))}
            </div>
          </Card>
        </div>
      )}
    </SceneShell>
  );
};
