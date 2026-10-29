import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C, FONT } from "../theme";
import { Card, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";
import { Icon } from "../components/Icon";

// رسوم مصغرة تستعيد المشاهد السابقة
const MiniLoop: React.FC = () => {
  const f = useCurrentFrame();
  const a = (f / 60) * Math.PI * 2;
  return (
    <svg width={150} height={150} viewBox="-75 -75 150 150">
      <circle r={50} fill="none" stroke={C.cyanSoft} strokeWidth={3} strokeDasharray="4 7" />
      {[0, 1, 2].map((i) => {
        const t = (-Math.PI / 2) - (i * 2 * Math.PI) / 3;
        return <circle key={i} cx={Math.cos(t) * 50} cy={Math.sin(t) * 50} r={12} fill="#fff" stroke={C.turquoise} strokeWidth={3} />;
      })}
      <circle cx={Math.cos(-a - Math.PI / 2) * 50} cy={Math.sin(-a - Math.PI / 2) * 50} r={6} fill={C.turquoise} />
      <rect x={-18} y={-18} width={36} height={36} rx={11} fill={C.turquoise} />
    </svg>
  );
};
const MiniMatrix: React.FC = () => {
  const shades = ["#E6F7F9", "#C5EDF1", "#8FDAE2", "#3FB9C4", C.teal];
  return (
    <svg width={150} height={150} viewBox="0 0 150 150">
      {[0, 1, 2].map((r) => [0, 1, 2].map((col) => <rect key={`${r}${col}`} x={100 - col * 46} y={8 + r * 46} width={40} height={40} rx={9} fill={shades[r + col]} />))}
    </svg>
  );
};

export const S21Summary: React.FC = () => {
  const { c } = useCues();
  const items = [
    { at: c(1, "يتميز"), visual: <MiniLoop />, title: "الوكيل يختار خطواته ويراجع نتائجها", sub: "ضمن تفويض محدد" },
    { at: c(2), visual: <MiniMatrix />, title: "الاستقلالية × الأثر", sub: "يحددان مستوى الحماية والتحقق" },
    {
      at: c(3),
      visual: (
        <div style={{ display: "flex", gap: 14, fontFamily: FONT, fontWeight: 700, color: C.teal, fontSize: 52 }}>
          <span>23</span><span style={{ color: C.faint }}>·</span><span>7</span><span style={{ color: C.faint }}>·</span><span>8</span>
        </div>
      ),
      title: "23 معيارًا · 7 أبعاد · 8 مجالات",
      sub: "معايير مشتركة تُضاف إليها متطلبات المجالات",
    },
    {
      at: c(4),
      visual: (
        <div style={{ display: "flex", gap: 18 }}>
          <Icon name="teacher" size={84} color={C.blue} />
          <Icon name="refresh" size={84} color={C.turquoiseDark} />
        </div>
      ),
      title: "القرار الجوهري لصاحب الصلاحية",
      sub: "والتحقق مستمر: قبل الاستخدام وأثناءه وعند التغيير",
    },
  ];
  return (
    <SceneShell>
      {items.map((it, i) => (
        <Reveal key={i} at={it.at} kind="up" style={{ left: i % 2 === 0 ? 990 : 250, top: 260 + Math.floor(i / 2) * 330, width: 680 }}>
          <Card style={{ width: 680, height: 290, padding: "28px 34px", display: "flex", gap: 30, alignItems: "center" }}>
            <div style={{ width: 190, display: "flex", justifyContent: "center", flexShrink: 0 }}>{it.visual}</div>
            <div>
              <Text size={22} weight={700} color={C.turquoise}>{String(i + 1).padStart(2, "0")}</Text>
              <Text size={32} weight={700} style={{ lineHeight: 1.3 }}>{it.title}</Text>
              <Text size={24} color={C.muted} style={{ marginTop: 8 }}>{it.sub}</Text>
            </div>
          </Card>
        </Reveal>
      ))}
    </SceneShell>
  );
};
