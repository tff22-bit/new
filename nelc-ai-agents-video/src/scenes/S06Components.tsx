import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, FlowDot, Svg } from "../components/Draw";
import { Icon, type IconName } from "../components/Icon";
import { Loop } from "../components/Loop";
import { AgentCore, Card, Chip, IconBadge, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

const RES: { label: string; sub: string; icon: IconName; cue: string }[] = [
  { label: "مصادر معلومات", sub: "للاستناد إلى معرفة مناسبة", icon: "search", cue: "بمصادر" },
  { label: "ذاكرة", sub: "للاحتفاظ بمعلومات المهمة", icon: "layers", cue: "بذاكرة" },
  { label: "أدوات الوكيل", sub: "للبحث والتنفيذ وتبادل البيانات", icon: "tool", cue: "بأدوات" },
  { label: "وكلاء آخرون", sub: "للتعاون في إنجاز المهمة", icon: "chat", cue: "بوكلاء" },
];

export const S06Components: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const cx = 900, cy = 575;
  const inner = prog(f, c(4, "أوامر النظام"), 30, easeInOut);
  const outer = prog(f, c(4, "والصلاحيات"), 30, easeInOut);
  // محاولة خروج عن الحدود: تتجاوز طبقة التعليمات وتتوقف عند الصلاحيات التقنية
  const tryAt = c(4, "حتى حين");
  const tr = prog(f, tryAt, 36, easeInOut);
  const blocked = f > tryAt + 36;
  return (
    <SceneShell>
      <Loop
        cx={cx}
        cy={cy}
        r={215}
        startAngle={-90}
        nodes={[
          { label: "اختيار الخطوة", sub: "ما يلزم لتحقيق الهدف", icon: "branch", at: c(1, "يختار") },
          { label: "تنفيذ الخطوة", sub: "الفعل المسموح به", icon: "send", at: c(1, "فينفذها") },
          { label: "مراجعة النتيجة", sub: "الخطوة التالية أو الإنهاء", icon: "check", at: c(1, "ثم يراجع") },
        ]}
        arcAt={[c(1, "فينفذها") - 6, c(1, "ثم يراجع") - 6, c(1, "ليحدد")]}
        flowFrom={c(1, "ليحدد") + 20}
        cardW={260}
        cardH={136}
        center={
          <Reveal at={c(2)} kind="scale" style={{ left: cx - 60, top: cy - 40 }}>
            <AgentCore size={120} />
            <div style={{ position: "absolute", top: -62, left: -90, width: 300, textAlign: "center" }}>
              <Text size={24} weight={700} color={C.teal}>النموذج</Text>
              <Text size={20} color={C.muted}>محرّك القرار</Text>
            </div>
          </Reveal>
        }
      />
      <Reveal at={c(1, "بهدف")} kind="down" style={{ left: cx - 80, top: 240 }}>
        <Chip icon="flag" label="هدف محدد" size={24} color="#fff" bg={C.teal} />
      </Reveal>

      {/* الموارد بحسب الحاجة */}
      <Svg>
        {RES.map((_, i) => (
          <Conn key={i} d={`M 470 ${330 + i * 150} C 560 ${330 + i * 150} 560 ${cy} ${cx - 150} ${cy}`} at={c(3, RES[i].cue) + 4} dur={20} color={C.cyanSoft} dashed width={2.5} />
        ))}
      </Svg>
      {RES.map((r, i) => (
        <Reveal key={i} at={c(3, r.cue)} kind="left" style={{ left: 100, top: 330 + i * 150 - 58, width: 370 }}>
          <Card tone="soft" style={{ width: 370, height: 116, padding: "0 20px", display: "flex", gap: 16, alignItems: "center", border: `1.5px dashed ${C.lineStrong}` }}>
            <IconBadge name={r.icon} size={58} />
            <div>
              <Text size={27} weight={700}>{r.label}</Text>
              <Text size={20} color={C.muted}>{r.sub}</Text>
            </div>
          </Card>
        </Reveal>
      ))}
      <Reveal at={c(3, "دون اشتراط")} kind="fade" style={{ left: 100, top: 900, width: 370, textAlign: "center" }}>
        <Text size={23} weight={600} color={C.muted}>بحسب الحاجة — لا يُشترط توافرها جميعًا</Text>
      </Reveal>

      {/* طبقتا الحدود */}
      <Svg>
        <rect x={lerp(cx, 560, inner)} y={lerp(cy, 240, inner)} width={lerp(0, 680, inner)} height={lerp(0, 680, inner)} rx={50} fill="none" stroke={C.blue} strokeWidth={2.5} strokeDasharray="10 9" opacity={inner * (blocked ? 0.5 : 1)} />
        <rect x={lerp(cx, 520, outer)} y={lerp(cy, 205, outer)} width={lerp(0, 760, outer)} height={lerp(0, 750, outer)} rx={60} fill="none" stroke={C.teal} strokeWidth={6} opacity={outer} />
        {tr > 0 && (
          <>
            <path d={`M ${cx + 80} ${cy} L ${lerp(cx + 80, 1272, tr)} ${cy}`} stroke={C.alert} strokeWidth={4} strokeDasharray="6 7" />
            <FlowDot point={{ x: lerp(cx + 80, 1272, tr), y: cy }} color={C.alert} r={9} />
          </>
        )}
      </Svg>
      <Reveal at={c(4, "أوامر النظام")} kind="fade" style={{ left: 1300, top: 300, width: 400 }}>
        <Card style={{ padding: "16px 22px", borderRight: `6px solid ${C.blue}` }}>
          <Text size={27} weight={700}>أوامر النظام</Text>
          <Text size={21} color={C.muted}>توجّه النموذج: الدور والحدود والتعليمات</Text>
        </Card>
      </Reveal>
      <Reveal at={c(4, "والصلاحيات")} kind="fade" style={{ left: 1300, top: 450, width: 400 }}>
        <Card style={{ padding: "16px 22px", borderRight: `6px solid ${C.teal}` }}>
          <Text size={27} weight={700}>الصلاحيات التقنية</Text>
          <Text size={21} color={C.muted}>تفرض حدود الوصول والتنفيذ فعليًا</Text>
        </Card>
      </Reveal>
      {blocked && (
        <Reveal at={tryAt + 36} kind="scale" style={{ left: 1250, top: cy - 30 }}>
          <Icon name="ban" size={60} color={C.alert} stroke={2.4} />
        </Reveal>
      )}
      <Reveal at={tryAt + 30} kind="up" style={{ left: 1300, top: 640, width: 400 }}>
        <Text size={23} weight={600} color={C.alert}>حتى لو لم يلتزم النموذج بالتعليمات… تبقى القيود مفروضة</Text>
      </Reveal>

      {/* إشراف بشري */}
      <Reveal at={c(5)} kind="down" style={{ left: 1440, top: 780, width: 420 }}>
        <Card tone="cyan" style={{ padding: "18px 24px", display: "flex", gap: 16, alignItems: "center", border: `2px solid ${C.blue}` }}>
          <IconBadge name="eye" size={60} bg={C.blueLight} color={C.blue} round />
          <Text size={25} weight={700}>إشراف بشري يتناسب مع أثر الاستخدام</Text>
        </Card>
      </Reveal>
      {f > c(5) && (
        <Svg>
          <Conn d={`M 1440 840 L 1290 840`} at={c(5) + 10} dur={14} color={C.blue} dashed width={2.5} />
        </Svg>
      )}
    </SceneShell>
  );
};
