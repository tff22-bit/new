import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../../SceneContext";
import { C, FONT, shadow } from "../../theme";
import { easeInOut, lerp, prog } from "../../components/anim";
import { Conn, Svg } from "../../components/Draw";
import { Icon } from "../../components/Icon";
import { Kinetic, Pop } from "../../components/Motion";
import { AgentCore } from "../../components/UI";
import { SceneShell } from "../../components/SceneShell";

// سؤالان ثم الوثيقة
export const Q02Question: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const b2 = c(2);
  const shrink = prog(f, b2 - 6, 24, easeInOut);
  const docIn = prog(f, c(2, "أصدر"), 26, easeInOut);
  return (
    <SceneShell heading={false}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - shrink, transform: `scale(${1 - shrink * 0.25}) translateY(${-shrink * 120}px)` }}>
        <Svg>
          <Conn d="M 960 250 A 270 270 0 1 1 959 250" at={c(1, "حدوده") - 4} dur={22} color={C.turquoise} dashed width={5} />
        </Svg>
        <Pop at={4} x={960} y={520}>
          <AgentCore size={170} style={{ position: "relative" }} />
        </Pop>
        <Pop at={c(1, "فمن")} x={1430} y={420} rotate={-25}>
          <div style={{ fontFamily: FONT, fontSize: 220, fontWeight: 700, color: C.turquoise, lineHeight: 1 }}>؟</div>
        </Pop>
        <Kinetic at={c(1, "حدوده")} x={1430} y={640} text="مَن يضع الحدود؟" size={46} />
        <Pop at={c(1, "ومن")} x={490} y={420} rotate={25}>
          <div style={{ fontFamily: FONT, fontSize: 220, fontWeight: 700, color: C.blue, lineHeight: 1 }}>؟</div>
        </Pop>
        <Kinetic at={c(1, "القرار")} x={490} y={640} text="مَن يتحمّل القرار؟" size={46} />
      </div>
      {/* الوثيقة */}
      {docIn > 0 && (
        <>
          <Svg>
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              const r1 = 330, r2 = lerp(330, 460, prog(f, c(2, "أصدر") + 14, 20));
              return <line key={i} x1={960 + Math.cos(a) * r1} y1={540 + Math.sin(a) * r1} x2={960 + Math.cos(a) * r2} y2={540 + Math.sin(a) * r2} stroke={C.cyanSoft} strokeWidth={6} strokeLinecap="round" opacity={1 - prog(f, c(2, "أصدر") + 34, 16)} />;
            })}
          </Svg>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: lerp(1200, 540, docIn),
              transform: `translate(-50%, -50%) rotate(${(1 - docIn) * -12}deg)`,
              width: 820,
              background: "#fff",
              borderRadius: 32,
              boxShadow: shadow.lift,
              padding: "44px 52px",
              textAlign: "center",
              fontFamily: FONT,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 84, height: 84, borderRadius: 24, background: C.turquoise, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="doc" size={48} color="#fff" stroke={2} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, color: C.turquoiseDark, marginTop: 18, opacity: prog(f, c(2, "المركز"), 14) }}>المركز الوطني للتعليم الإلكتروني</div>
            <div style={{ fontSize: 50, fontWeight: 700, color: C.teal, lineHeight: 1.3, marginTop: 10, opacity: prog(f, c(2, "معايير"), 14) }}>
              معايير وكلاء الذكاء الاصطناعي
              <br />
              في التعليم والتدريب
            </div>
          </div>
        </>
      )}
    </SceneShell>
  );
};
