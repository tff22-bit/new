import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../../SceneContext";
import { C } from "../../theme";
import { easeInOut, lerp, prog } from "../../components/anim";
import { Svg } from "../../components/Draw";
import { Icon, type IconName } from "../../components/Icon";
import { Bubble, Kinetic, Pill, Pop } from "../../components/Motion";
import { AgentCore } from "../../components/UI";
import { SceneShell } from "../../components/SceneShell";

// احترام خيارات المتعلم، ثم تقليل البيانات
export const Q06Protect: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const b2 = c(2);
  const out1 = prog(f, b2 - 6, 18);
  const shield = prog(f, c(1, "ويحترم"), 24, easeInOut);
  const bans: { icon: IconName; label: string; cue: string; x: number }[] = [
    { icon: "heart", label: "ضغط عاطفي", cue: "ضغط", x: 1380 },
    { icon: "megaphone", label: "خلط بالإعلان", cue: "والإعلان", x: 540 },
  ];
  const purpose = c(2, "لغرض");
  const need = c(2, "بالقدر");
  return (
    <SceneShell heading={false}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out1, transform: `translateX(${out1 * 80}px)` }}>
        <Svg>
          <path d="M 700 760 A 260 260 0 0 1 1220 760" fill="rgba(139,92,246,0.08)" stroke={C.turquoise} strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - shield} />
        </Svg>
        <Pop at={c(1)} x={960} y={640}>
          <Bubble icon="student" size={170} bg={C.turquoise} ring />
        </Pop>
        <Kinetic at={c(1, "خيارات")} x={960} y={870} text="خيارات المتعلّم محترمة" size={44} />
        {bans.map((b, i) => (
          <Pop key={i} at={c(1, b.cue)} x={b.x} y={450} rotate={i ? 20 : -20}>
            <div style={{ position: "relative", textAlign: "center" }}>
              <Bubble icon={b.icon} size={140} bg={C.alertLight} color={C.alert} />
              <div style={{ position: "absolute", left: -14, top: -14 }}>
                <Icon name="ban" size={70} color={C.alert} stroke={2.6} />
              </div>
              <Pill text={b.label} bg={C.alert} size={28} />
            </div>
          </Pop>
        ))}
      </div>
      {/* البيانات: غرض مشروع وبالقدر اللازم */}
      {f >= b2 - 4 && (
        <>
          <Pop at={b2} x={1580} y={520} from="right">
            <Bubble icon="database" size={170} bg={C.blue} />
          </Pop>
          <Svg>
            <path d="M 1180 360 L 1340 360 L 1290 500 L 1290 680 L 1230 700 L 1230 500 Z" fill={C.cyanLight} stroke={C.turquoise} strokeWidth={5} opacity={prog(f, purpose, 14)} transform="translate(-60 0)" />
            {f > b2 + 10 &&
              Array.from({ length: 16 }).map((_, i) => {
                const t = ((f - b2 - 10) / 60 + i / 16) % 1;
                const pass = i % 4 === 0;
                const x = lerp(1480, pass ? 560 : 1190, Math.min(1, t * (pass ? 1 : 1.7)));
                const y0 = 520 + ((i * 47) % 160) - 80;
                const y = x < 1220 && pass ? lerp(y0, 560, Math.min(1, (1220 - x) / 120)) : y0;
                const o = pass ? 1 : Math.max(0, 1 - Math.max(0, (t * 1.7 - 0.85) / 0.15));
                return <rect key={i} x={x - 11} y={y - 11} width={22} height={22} rx={6} fill={pass ? C.turquoise : C.lineStrong} opacity={o} />;
              })}
          </Svg>
          <Pop at={purpose} x={1200} y={290} from="up">
            <Pill text="غرض مشروع" icon="target" bg={C.teal} size={30} />
          </Pop>
          <Pop at={need} x={1200} y={790} from="up">
            <Pill text="بالقدر اللازم فقط" icon="filter" size={30} />
          </Pop>
          <Pop at={b2 + 8} x={460} y={560}>
            <AgentCore size={160} style={{ position: "relative" }} />
          </Pop>
        </>
      )}
    </SceneShell>
  );
};
