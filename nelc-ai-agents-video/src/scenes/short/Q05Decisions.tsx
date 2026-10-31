import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../../SceneContext";
import { C, FONT } from "../../theme";
import { easeInOut, lerp, prog } from "../../components/anim";
import { Svg } from "../../components/Draw";
import { Icon, type IconName } from "../../components/Icon";
import { Bubble, Pill, Pop } from "../../components/Motion";
import { AgentCore } from "../../components/UI";
import { SceneShell } from "../../components/SceneShell";

const ITEMS: { label: string; icon: IconName; cue: string }[] = [
  { label: "القبول", icon: "door", cue: "كالقبول" },
  { label: "الدرجات", icon: "clipboard", cue: "والدرجات" },
  { label: "الشهادات", icon: "certificate", cue: "والشهادات" },
];

// القرارات الجوهرية تبقى بيد صاحب الصلاحية
export const Q05Decisions: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const keep = c(1, "تبقى");
  const absent = c(2);
  const approach = prog(f, keep - 10, 30, easeInOut);
  const ax = lerp(1700, 1380, approach);
  const gone = prog(f, absent, 16);
  return (
    <SceneShell heading={false}>
      <Svg>
        <circle cx={760} cy={520} r={290} fill={C.cyanLight} opacity={prog(f, 4, 16)} />
        <rect x={1180} y={300} width={22} height={440} rx={11} fill={C.teal} opacity={prog(f, keep, 12)} />
      </Svg>
      {/* صاحب الصلاحية */}
      <Pop at={4} x={760} y={520}>
        <div style={{ opacity: 1 - gone * 0.75 }}>
          <Bubble icon="user" size={170} bg={C.teal} ring />
        </div>
      </Pop>
      {gone > 0 && (
        <div style={{ position: "absolute", left: 760 - 85, top: 520 - 85, width: 170, height: 170, borderRadius: "50%", border: `5px dashed ${C.faint}`, opacity: gone }} />
      )}
      {ITEMS.map((it, i) => {
        const a = (-150 + i * 60) * (Math.PI / 180);
        const at = c(1, it.cue);
        const fly = prog(f, at, 18, easeInOut);
        const x = lerp(1500, 760 + Math.cos(a) * 230, fly), y = lerp(150 + i * 120, 520 + Math.sin(a) * 230, fly);
        if (f < at) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <Bubble icon={it.icon} size={110} bg="#fff" color={C.turquoiseDark} />
            <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.teal, marginTop: 6 }}>{it.label}</div>
          </div>
        );
      })}
      <Pop at={keep} x={760} y={880} from="up">
        <Pill text="بيد صاحب الصلاحية" icon="user" bg={C.teal} size={36} />
      </Pop>
      {/* الوكيل يتوقف عند البوابة */}
      <div style={{ position: "absolute", left: ax, top: 520, transform: "translate(-50%,-50%)", opacity: prog(f, 8, 14) }}>
        <AgentCore size={150} style={{ position: "relative" }} halted={approach >= 1} />
      </div>
      <Pop at={keep + 14} x={1191} y={250}>
        <Bubble icon="lock" size={90} bg={C.teal} />
      </Pop>
      <Pop at={absent + 6} x={1470} y={800} from="up">
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.alertLight, border: `3px solid ${C.alert}`, borderRadius: 26, padding: "18px 30px" }}>
          <Icon name="ban" size={46} color={C.alert} stroke={2.4} />
          <span style={{ fontFamily: FONT, fontSize: 38, fontWeight: 700, color: C.alert, whiteSpace: "nowrap" }}>غياب المراجع ≠ موافقة</span>
        </div>
      </Pop>
    </SceneShell>
  );
};
