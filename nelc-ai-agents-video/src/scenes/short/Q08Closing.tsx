import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../../SceneContext";
import { C, FONT } from "../../theme";
import { easeInOut, lerp, prog } from "../../components/anim";
import { Conn, Svg } from "../../components/Draw";
import { Bubble, Pop } from "../../components/Motion";
import { AgentCore } from "../../components/UI";
import { SceneShell } from "../../components/SceneShell";

// الرسالة الختامية: المسؤولية تبقى للإنسان
export const Q08Closing: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const but = c(1, "لكن");
  const step = prog(f, c(1, "خطوته"), 30, easeInOut);
  const hero = prog(f, but, 26, easeInOut);
  return (
    <SceneShell heading={false}>
      <Svg>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={lerp(1320, 1120, step) - i * 90} cy={420} r={10} fill={C.cyanSoft} opacity={prog(f, c(1, "خطوته") + i * 6, 10) * (1 - hero * 0.6)} />
        ))}
        <Conn d="M 1220 420 L 760 420" at={but} dur={20} color={C.blue} dashed width={5} arrow={{ x: 760, y: 420, angle: 180 }} />
      </Svg>
      <Pop at={4} x={1420} y={420}>
        <div style={{ opacity: 1 - hero * 0.4 }}>
          <AgentCore size={170} style={{ position: "relative" }} />
        </div>
      </Pop>
      <Pop at={but} x={600} y={420}>
        <div style={{ transform: `scale(${1 + hero * 0.25})` }}>
          <Bubble icon="teacher" size={170} bg={C.blue} ring />
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: C.teal, opacity: prog(f, 6, 14), transform: `translateY(${(1 - prog(f, 6, 18)) * 30}px)` }}>
          قد يختار الوكيل خطوته التالية…
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, color: C.turquoise, marginTop: 10, opacity: hero, transform: `scale(${0.9 + 0.1 * hero})` }}>
          لكن المسؤولية تبقى للإنسان
        </div>
        <div style={{ fontSize: 22, color: C.muted, marginTop: 40, opacity: prog(f, but + 40, 16) }}>
          المصدر: المركز الوطني للتعليم الإلكتروني — معايير وكلاء الذكاء الاصطناعي في التعليم والتدريب، الإصدار 1.0، أكتوبر 2026م
        </div>
        <div style={{ fontSize: 18, color: C.faint, opacity: prog(f, but + 40, 16) }}>محتوى توعوي مبني على وثيقة مرخّصة بموجب CC BY-NC-SA 4.0</div>
      </div>
    </SceneShell>
  );
};
