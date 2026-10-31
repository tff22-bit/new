import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../../SceneContext";
import { C } from "../../theme";
import { easeInOut, lerp, prog } from "../../components/anim";
import { Conn, FlowDot, Svg } from "../../components/Draw";
import { DIMS } from "../../data/dimensions";
import { Bubble, CountUp, Kinetic, Pill, Pop } from "../../components/Motion";
import { SceneShell } from "../../components/SceneShell";

// سبعة أبعاد و23 معيارًا، ثم دورة التحقق المستمر
export const Q07Framework: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const b2 = c(2);
  const collapse = prog(f, b2 - 4, 22, easeInOut);
  const cx = 960, cy = 520;
  const stations = [
    { label: "قبل الاستخدام", icon: "flag" as const, cue: "قبل", a: -90 },
    { label: "أثناءه", icon: "chart" as const, cue: "وأثناءه", a: 30 },
    { label: "عند التغيير", icon: "refresh" as const, cue: "وعند التغيير", a: 150 },
  ];
  const R = 270;
  const pt = (a: number, r = R) => ({ x: cx + Math.cos((a * Math.PI) / 180) * r, y: cy + Math.sin((a * Math.PI) / 180) * r });
  const spinFrom = c(2, "وعند التغيير") + 10;
  return (
    <SceneShell heading={false}>
      {/* الأبعاد السبعة تنطلق من المركز */}
      {DIMS.map((d, i) => {
        const a = -90 + (360 / 7) * i;
        const at = c(1, "سبعة") + i * 4;
        const burst = prog(f, at, 20, easeInOut) * (1 - collapse);
        const p = pt(a, lerp(0, 340, burst));
        if (f < at || collapse >= 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * burst})`, opacity: burst }}>
            <Bubble icon={d.icon} size={120} bg={i % 2 ? C.turquoise : C.blue} />
          </div>
        );
      })}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - collapse }}>
        <Pop at={c(1, "وثلاثة")} x={cx} y={cy - 20}>
          <CountUp at={c(1, "وثلاثة")} dur={24} to={23} size={170} />
        </Pop>
        <Kinetic at={c(1, "معيارا")} x={cx} y={cy + 110} text="معيارًا · ٧ أبعاد" size={42} color={C.muted} />
      </div>
      {/* دورة التحقق */}
      {f >= b2 - 2 && (
        <>
          <Svg>
            <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.cyanSoft} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" opacity={prog(f, b2, 14)} />
            {stations.map((s, i) => {
              const a1 = s.a + 20;
              let a2 = stations[(i + 1) % 3].a - 20;
              if (a2 < a1) a2 += 360;
              const p1 = pt(a1), p2 = pt(a2);
              return <Conn key={i} d={`M ${p1.x} ${p1.y} A ${R} ${R} 0 0 1 ${p2.x} ${p2.y}`} at={c(2, s.cue) + 4} dur={14} color={C.turquoise} width={6} />;
            })}
            {f > spinFrom && <FlowDot point={pt(-90 + ((f - spinFrom) / 50) * 360)} r={12} />}
          </Svg>
          <Pop at={c(2, "وتحقق")} x={cx} y={cy}>
            <Pill text="تحقّق مستمر" icon="shieldCheck" bg={C.teal} size={40} />
          </Pop>
          {stations.map((s, i) => {
            const p = pt(s.a);
            return (
              <Pop key={i} at={c(2, s.cue)} x={p.x} y={p.y}>
                <div style={{ textAlign: "center" }}>
                  <Bubble icon={s.icon} size={120} ring />
                  <div style={{ marginTop: 10 }}>
                    <Pill text={s.label} bg="#fff" color={C.teal} size={28} />
                  </div>
                </div>
              </Pop>
            );
          })}
        </>
      )}
    </SceneShell>
  );
};
