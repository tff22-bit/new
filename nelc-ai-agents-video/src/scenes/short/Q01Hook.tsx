import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../../SceneContext";
import { C } from "../../theme";
import { easeInOut, prog } from "../../components/anim";
import { Conn, FlowDot, Svg } from "../../components/Draw";
import { Bubble, Kinetic, Pop } from "../../components/Motion";
import { AgentCore } from "../../components/UI";
import { SceneShell } from "../../components/SceneShell";

// افتتاحية: من سؤال وإجابة إلى وكيل يختار وينفّذ ويراجع
export const Q01Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const tAgent = c(1, "بل يختار");
  const steps = [
    { cue: "يختار", icon: "branch" as const, label: "يختار", a: -90 },
    { cue: "وينفذها", icon: "send" as const, label: "ينفّذ", a: 30 },
    { cue: "ويراجع", icon: "check" as const, label: "يراجع", a: 150 },
  ];
  const cx = 960, cy = 520, r = 230;
  const pt = (a: number) => ({ x: cx + Math.cos((a * Math.PI) / 180) * r, y: cy + Math.sin((a * Math.PI) / 180) * r });
  const flow = c(1, "ويراجع") + 12;
  const spin = f > flow ? ((f - flow) / 70) * 360 : 0;
  const zoom = 1 + prog(f, tAgent, 60, easeInOut) * 0.04;
  return (
    <SceneShell heading={false} camera={() => ({ scale: zoom })}>
      {/* سؤال ← إجابة: ما تفعله الأداة */}
      <Pop at={6} out={tAgent - 4} x={1250} y={520} from="right">
        <Bubble icon="chat" size={150} bg={C.blue} />
      </Pop>
      <Svg>{f < tAgent && <Conn d="M 1150 520 L 790 520" at={c(1, "بالإجابة") - 8} dur={14} color={C.lineStrong} width={5} arrow={{ x: 790, y: 520, angle: 180 }} />}</Svg>
      <Pop at={c(1, "بالإجابة")} out={tAgent - 4} x={680} y={520} from="left">
        <Bubble icon="doc" size={150} bg={C.cyanSoft} color={C.teal} />
      </Pop>
      <Kinetic at={c(1, "لا يكتفي")} out={tAgent - 4} x={960} y={300} text="لا يكتفي بالإجابة…" size={58} color={C.muted} />

      {/* الوكيل ودورته */}
      <Svg>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.cyanSoft} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" opacity={prog(f, tAgent, 20)} />
        {steps.map((s, i) => {
          const a1 = s.a + 22;
          let a2 = steps[(i + 1) % 3].a - 22;
          if (a2 < a1) a2 += 360;
          const p1 = pt(a1), p2 = pt(a2);
          return <Conn key={i} d={`M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`} at={c(1, s.cue) + 6} dur={16} color={C.turquoise} width={5} />;
        })}
        {f > flow && <FlowDot point={pt(-90 + spin)} r={11} color={C.turquoise} />}
      </Svg>
      <Pop at={tAgent} x={cx} y={cy}>
        <AgentCore size={190} style={{ position: "relative" }} />
      </Pop>
      {steps.map((s, i) => {
        const p = pt(s.a);
        return (
          <Pop key={i} at={c(1, s.cue)} x={p.x} y={p.y}>
            <Bubble icon={s.icon} size={124} ring />
          </Pop>
        );
      })}
      {steps.map((s, i) => (
        <Kinetic key={i} at={c(1, s.cue) + 3} x={1180 - i * 220} y={870} text={s.label} size={64} color={i === 2 ? C.turquoiseDark : C.teal} />
      ))}
    </SceneShell>
  );
};
