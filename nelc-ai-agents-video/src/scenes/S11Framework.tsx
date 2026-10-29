import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { DIMS } from "../data/dimensions";
import { Card, IconBadge, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const PARTS: { label: string; icon: IconName; cue: string }[] = [
  { label: "وصف المعيار", icon: "doc", cue: "وصفٍ" },
  { label: "متطلبات الاستيفاء", icon: "list", cue: "ومتطلبات" },
  { label: "المسؤول عن التطبيق", icon: "user", cue: "ومسؤولٍ" },
  { label: "نطاق التطبيق", icon: "target", cue: "ونطاق" },
  { label: "أدلة التحقق", icon: "search", cue: "وأدلة" },
];

export const S11Framework: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const cues = ["القيمة", "والدور", "والمسؤولية", "وحماية", "والبيانات", "والأمن", "والتحقق"];
  const shift = prog(f, c(3) - 36, 34, easeInOut);
  const cx = lerp(960, 640, shift), cy = 580, R = lerp(330, 300, shift), s = lerp(1, 0.9, shift);
  const pos = (i: number) => {
    const a = ((-90 + (360 / 7) * i) * Math.PI) / 180;
    return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R };
  };
  const reviewAt = c(4, "تُراجَع");
  return (
    <SceneShell>
      <Svg>
        {DIMS.map((_, i) => {
          const p = pos(i);
          return <Conn key={i} d={`M ${cx} ${cy} L ${p.x} ${p.y}`} at={c(2, cues[i]) - 4} dur={14} color={C.lineStrong} width={2} />;
        })}
      </Svg>
      <Reveal at={c(1, "يتوسطها")} kind="scale" style={{ left: cx - 140 * s, top: cy - 140 * s }}>
        <div style={{ width: 280 * s, height: 280 * s, borderRadius: "50%", background: "#EEFAFB", border: `2px solid ${C.cyanSoft}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <Text size={34 * s} weight={700} color={C.teal}>استخدامٌ مسؤول</Text>
          <Text size={24 * s} color={C.muted}>وقيمة قابلة للتحقق</Text>
        </div>
      </Reveal>
      <Reveal at={c(1, "ثلاثة")} kind="fade" style={{ left: 96, top: 230 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
          <Text size={80} weight={700} color={C.turquoise}>23</Text>
          <Text size={28} weight={600} color={C.muted}>معيارًا · 7 أبعاد</Text>
        </div>
      </Reveal>
      {DIMS.map((d, i) => {
        const p = pos(i);
        const checked = f > reviewAt + i * 6;
        return (
          <Reveal key={i} at={c(2, cues[i])} kind="scale" style={{ left: p.x - 150 * s, top: p.y - 62 * s }}>
            <Card style={{ width: 300 * s, height: 124 * s, padding: `0 ${16 * s}px`, display: "flex", alignItems: "center", gap: 12 * s }}>
              <div style={{ position: "relative" }}>
                <IconBadge name={d.icon} size={58 * s} />
                <div style={{ position: "absolute", top: -10, right: -10, width: 30 * s, height: 30 * s, borderRadius: 9, background: C.teal, color: "#fff", fontSize: 18 * s, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              </div>
              <Text size={24 * s} weight={700} style={{ lineHeight: 1.3 }}>{d.name}</Text>
              {checked && (
                <div style={{ position: "absolute", left: -14, top: -14, width: 36, height: 36, borderRadius: "50%", background: C.ok, display: "flex", alignItems: "center", justifyContent: "center", opacity: prog(f, reviewAt + i * 6, 8) }}>
                  <Icon name="check" size={24} color="#fff" stroke={2.6} />
                </div>
              )}
            </Card>
          </Reveal>
        );
      })}
      {/* بنية المعيار الواحد */}
      <Reveal at={c(3)} kind="left" style={{ left: 1170, top: 260, width: 580 }}>
        <Card style={{ width: 580, padding: "26px 30px" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
            <div style={{ background: C.cyanLight, color: C.teal, fontWeight: 700, fontSize: 28, borderRadius: 14, padding: "4px 16px" }}>م</div>
            <Text size={30} weight={700}>بنية كل معيار</Text>
          </div>
          {PARTS.map((p, k) => (
            <Reveal key={k} at={c(3, p.cue)} kind="right" style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "12px 16px", marginTop: 10, borderRadius: 14, background: k === 4 ? C.okLight : "#F4F8FA" }}>
                <Icon name={p.icon} size={34} color={C.turquoiseDark} />
                <Text size={27} weight={600}>{p.label}</Text>
              </div>
            </Reveal>
          ))}
        </Card>
      </Reveal>
      <Reveal at={c(4, "مع بيان")} kind="up" style={{ left: 1170, top: 860, width: 580 }}>
        <Card tone="cyan" style={{ padding: "16px 24px", display: "flex", gap: 14, alignItems: "center", border: `2px dashed ${C.turquoise}` }}>
          <Icon name="doc" size={36} color={C.teal} />
          <Text size={24} weight={600} color={C.teal}>متطلب غير منطبق ← يُبيَّن سبب عدم انطباقه</Text>
        </Card>
      </Reveal>
    </SceneShell>
  );
};
