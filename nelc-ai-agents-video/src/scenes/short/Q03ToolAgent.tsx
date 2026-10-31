import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../../SceneContext";
import { C } from "../../theme";
import { easeInOut, polyPath, polyPoint, prog, pulse, type P } from "../../components/anim";
import { Conn, FlowDot, Svg } from "../../components/Draw";
import { Icon } from "../../components/Icon";
import { Bubble, Kinetic, Pill, Pop } from "../../components/Motion";
import { AgentCore } from "../../components/UI";
import { SceneShell } from "../../components/SceneShell";

const PATH: P[] = [
  { x: 820, y: 640 }, { x: 680, y: 640 }, { x: 640, y: 480 }, { x: 470, y: 480 }, { x: 420, y: 330 }, { x: 250, y: 330 },
];

// الأداة تجيب وتنتظر، والوكيل يسعى نحو هدف ضمن صلاحيات
export const Q03ToolAgent: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const wait = c(1, "تنتظرك");
  const go = c(2, "خطوة");
  const t = prog(f, go, 70, easeInOut);
  const box = c(2, "ضمن صلاحيات");
  return (
    <SceneShell heading={false}>
      <Svg>
        <Conn d="M 960 170 L 960 930" at={2} dur={18} color={C.line} width={3} />
      </Svg>
      {/* الأداة */}
      <Pop at={c(1)} x={1440} y={200}>
        <Pill text="أداة" icon="tool" bg={C.blue} />
      </Pop>
      <Pop at={c(1, "تجيب")} x={1660} y={520} from="right">
        <Bubble icon="chat" size={130} bg={C.blue} />
      </Pop>
      <Svg>
        <Conn d="M 1580 520 L 1330 520" at={c(1, "طلبا")} dur={12} color={C.blue} width={5} arrow={{ x: 1330, y: 520, angle: 180 }} />
      </Svg>
      <Pop at={c(1, "طلبا") + 8} x={1240} y={520}>
        <Bubble icon="doc" size={130} bg={C.blueLight} color={C.blue} />
      </Pop>
      <Pop at={wait} x={1440} y={740}>
        <div style={{ transform: `scale(${1 + 0.06 * pulse(f, wait, 30)})` }}>
          <Bubble icon="pause" size={110} bg="#fff" color={C.blue} />
        </div>
      </Pop>
      <Kinetic at={wait + 4} x={1440} y={860} text="ثم تنتظرك" size={44} color={C.blue} />

      {/* الوكيل */}
      <Pop at={c(2)} x={480} y={200}>
        <Pill text="وكيل" icon="sparkle" />
      </Pop>
      <Svg>
        <rect x={150} y={250} width={760} height={470} rx={40} fill="none" stroke={C.turquoise} strokeWidth={4} strokeDasharray="14 12" opacity={prog(f, box, 16)} />
        <path d={polyPath(PATH)} fill="none" stroke={C.line} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={prog(f, c(2), 12)} />
        <path d={polyPath(PATH)} fill="none" stroke={C.turquoise} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} />
        {t > 0 && t < 1 && <FlowDot point={polyPoint(PATH, t)} r={12} />}
      </Svg>
      {[1, 3].map((k, i) => (
        <Pop key={k} at={go + 18 + i * 22} x={PATH[k].x} y={PATH[k].y - 50}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.ok, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check" size={24} color="#fff" stroke={2.8} />
          </div>
        </Pop>
      ))}
      <Pop at={c(2, "فيسعى")} x={860} y={640}>
        <AgentCore size={110} style={{ position: "relative" }} />
      </Pop>
      <Pop at={c(2, "هدف")} x={220} y={330}>
        <Bubble icon="flag" size={110} bg={C.teal} />
      </Pop>
      <Pop at={c(2, "يحددها")} x={540} y={830} from="up">
        <Pill text="صلاحيات يحددها الإنسان" icon="key" bg={C.teal} size={30} />
      </Pop>
    </SceneShell>
  );
};
