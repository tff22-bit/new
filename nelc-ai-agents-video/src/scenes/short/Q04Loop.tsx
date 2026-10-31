import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../../SceneContext";
import { C } from "../../theme";
import { lerp, prog, pulse } from "../../components/anim";
import { Conn, FlowDot, Svg } from "../../components/Draw";
import { Bubble, Kinetic, Pill, Pop } from "../../components/Motion";
import { AgentCore } from "../../components/UI";
import { SceneShell } from "../../components/SceneShell";

// المعلم يحدد الأهداف، والوكيل يدعم الطالب ويرجع إلى المعلم عند الحاجة
export const Q04Loop: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const T = { x: 960, y: 260 }, A = { x: 1300, y: 700 }, S = { x: 620, y: 700 };
  const loopAt = c(1, "خطوة");
  const back = c(2, "ويعود");
  const hitl = c(2, "فالإنسان");
  const paused = f >= back && f < hitl + 20;
  const k = ((f - loopAt) / 55) % 1;
  const half = k < 0.5;
  const u = half ? k * 2 : (k - 0.5) * 2;
  const dot = half ? { x: lerp(A.x - 110, S.x + 110, u), y: A.y - 30 } : { x: lerp(S.x + 110, A.x - 110, u), y: A.y + 30 };
  const ring = prog(f, hitl, 24);
  return (
    <SceneShell heading={false}>
      <Svg>
        <Conn d={`M ${T.x + 60} ${T.y + 70} L ${A.x - 70} ${A.y - 90}`} at={c(1, "الأهداف")} dur={16} color={C.blue} width={5} arrow={{ x: A.x - 70, y: A.y - 90, angle: 52 }} />
        <Conn d={`M ${A.x - 110} ${A.y - 30} L ${S.x + 110} ${S.y - 30}`} at={c(1, "ويدعم")} dur={16} color={C.turquoise} width={5} arrow={{ x: S.x + 110, y: S.y - 30, angle: 180 }} />
        <Conn d={`M ${S.x + 110} ${S.y + 30} L ${A.x - 110} ${A.y + 30}`} at={c(1, "ويدعم") + 10} dur={16} color={C.turquoise} width={5} arrow={{ x: A.x - 110, y: A.y + 30, angle: 0 }} />
        {f > loopAt && !paused && <FlowDot point={dot} r={10} />}
        <Conn d={`M ${A.x - 20} ${A.y - 110} C ${A.x + 60} ${A.y - 300} ${T.x + 260} ${T.y} ${T.x + 90} ${T.y}`} at={back} dur={20} color={C.blue} dashed width={5} arrow={{ x: T.x + 90, y: T.y, angle: 180 }} />
        <ellipse cx={960} cy={570} rx={lerp(380, 620, ring)} ry={lerp(300, 450, ring)} fill="none" stroke={C.turquoise} strokeWidth={5} opacity={ring * 0.8} />
      </Svg>
      <Pop at={c(1)} x={T.x} y={T.y}>
        <Bubble icon="teacher" size={150} bg={C.blue} ring={f >= back} />
      </Pop>
      <Kinetic at={c(1)} x={T.x} y={T.y + 120} text="المعلم" size={38} color={C.blue} />
      <Pop at={c(1, "الأهداف")} x={T.x - 300} y={T.y}>
        <Pill text="الأهداف" icon="target" bg={C.blue} size={30} />
      </Pop>
      <Pop at={c(1, "الوكيل")} x={A.x} y={A.y}>
        <AgentCore size={170} style={{ position: "relative" }} halted={paused} />
      </Pop>
      <Pop at={c(1, "الطالب")} x={S.x} y={S.y}>
        <Bubble icon="student" size={150} bg={C.turquoise} />
      </Pop>
      <Kinetic at={c(1, "الطالب")} x={S.x} y={S.y + 120} text="الطالب" size={38} color={C.turquoiseDark} />
      {paused && (
        <Pop at={back + 4} x={A.x + 130} y={A.y - 110}>
          <div style={{ transform: `scale(${1 + 0.08 * pulse(f, back, 24)})` }}>
            <Bubble icon="pause" size={80} bg="#fff" color={C.blue} />
          </div>
        </Pop>
      )}
      <Pop at={hitl} x={960} y={940} from="up">
        <Pill text="الإنسان في الحلقة" icon="user" bg={C.teal} size={40} />
      </Pop>
    </SceneShell>
  );
};
