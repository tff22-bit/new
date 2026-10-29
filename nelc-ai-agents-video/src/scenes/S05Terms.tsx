import React from "react";
import { useCurrentFrame } from "remotion";
import { useCues } from "../SceneContext";
import { C } from "../theme";
import { easeInOut, lerp, prog } from "../components/anim";
import { Conn, FlowDot, Svg } from "../components/Draw";
import { Icon } from "../components/Icon";
import { AgentCore, Card, Chip, IconBadge, Phase, Reveal, Text } from "../components/UI";
import { SceneShell } from "../components/SceneShell";

export const S05Terms: React.FC = () => {
  const { c } = useCues();
  return (
    <SceneShell>
      <Phase at={c(1)} out={c(3) - 10}>
        <Delegation />
      </Phase>
      <Phase at={c(3)} out={c(4) - 10}>
        <UserBeneficiary />
      </Phase>
      <Phase at={c(4)}>
        <PractitionerEntity />
      </Phase>
    </SceneShell>
  );
};

const Delegation: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const frameAt = c(1, "التفويض:");
  const b2 = c(2);
  // الاستقلالية: تختفي نقاط الموافقة تدريجيًا داخل الإطار نفسه
  const aut = prog(f, c(2, "دون"), 70, easeInOut);
  const tasks = 6;
  const wander = Math.sin(f / 35) * 120;
  return (
    <>
      <Reveal at={c(1)} kind="right" style={{ left: 1480, top: 440 }}>
        <IconBadge name="user" size={120} round bg="#fff" color={C.blue} />
        <Text size={26} weight={700} style={{ width: 200, marginRight: -40, textAlign: "center", marginTop: 10 }}>من يملك المنح</Text>
      </Reveal>
      <Svg>
        <Conn d="M 1460 500 L 1340 500" at={frameAt} dur={14} color={C.blue} arrow={{ x: 1340, y: 500, angle: 180 }} />
        <rect x={300} y={270} width={1020} height={560} rx={44} fill="rgba(34,179,191,0.04)" stroke={C.teal} strokeWidth={3} strokeDasharray="16 12" pathLength={1} opacity={prog(f, frameAt, 20)} />
      </Svg>
      <Reveal at={frameAt + 6} kind="fade" style={{ left: 340, top: 230 }}>
        <Chip icon="lock" label="التفويض = حدود العمل" size={28} color="#fff" bg={C.teal} />
      </Reveal>
      {["المهمة", "الصلاحيات", "الحدود"].map((l, i) => (
        <Reveal key={l} at={c(1, ["المهمة", "والصلاحيات", "والحدود"][i])} kind="up" style={{ left: 1020 - i * 230, top: 320 }}>
          <Chip label={l} icon={["target", "key", "shield"][i] as "target"} size={26} />
        </Reveal>
      ))}
      <div style={{ position: "absolute", left: 760 + (f < b2 ? wander : 0), top: 450, opacity: f >= b2 ? 0 : 1 }}>
        <AgentCore size={110} />
      </div>
      {/* الاستقلالية */}
      {f >= b2 && (
        <>
          <Reveal at={b2} kind="fade" style={{ left: 380, top: 430 }}>
            <Text size={30} weight={700} color={C.teal}>الاستقلالية</Text>
          </Reveal>
          <Svg>
            <line x1={420} y1={620} x2={1220} y2={620} stroke={C.line} strokeWidth={3} />
          </Svg>
          {Array.from({ length: tasks }).map((_, i) => {
            const x = lerp(1180, 460, i / (tasks - 1));
            // كل نقطة موافقة تختفي عند عتبة مختلفة
            const gone = aut > (i + 1) / (tasks + 1);
            return (
              <React.Fragment key={i}>
                <Reveal at={b2 + i * 4} kind="scale" style={{ left: x - 34, top: 586 }}>
                  <div style={{ width: 68, height: 68, borderRadius: 18, background: C.turquoise, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="check" size={36} color="#fff" stroke={2.2} />
                  </div>
                </Reveal>
                {i < tasks - 1 && (
                  <div style={{ position: "absolute", left: x - 72 - 22, top: 680, opacity: gone ? 0.12 : 1 }}>
                    <Icon name="teacher" size={44} color={C.blue} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          <Reveal at={c(2, "دون")} kind="up" style={{ left: 380, top: 750, width: 880, textAlign: "center" }}>
            <Text size={27} weight={600} color={C.muted}>
              تقلّ الموافقات المسبقة… <span style={{ color: C.teal }}>وتبقى حدود التفويض كما هي</span>
            </Text>
          </Reveal>
        </>
      )}
    </>
  );
};

const UserBeneficiary: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const out = c(3, "والمستفيد");
  const ripple = prog(f, out, 40);
  const impacts = ["تعلّمه", "حقوقه", "فرصه", "سلامته", "بياناته"];
  return (
    <>
      <Reveal at={c(3)} kind="right" style={{ left: 1420, top: 440 }}>
        <IconBadge name="user" size={140} round bg="#fff" color={C.blue} />
        <Text size={32} weight={700} style={{ textAlign: "center", width: 140, marginTop: 12 }}>المستخدم</Text>
        <Text size={22} color={C.muted} style={{ textAlign: "center", width: 240, marginRight: -50 }}>يتفاعل أو يكلّف بمهمة</Text>
      </Reveal>
      <Reveal at={c(3) + 8} kind="scale" style={{ left: 900, top: 450 }}>
        <AgentCore size={130} />
      </Reveal>
      <Svg>
        <Conn d="M 1400 500 L 1050 500" at={c(3) + 12} dur={16} color={C.blue} arrow={{ x: 1050, y: 500, angle: 180 }} />
        <Conn d="M 1050 540 L 1400 540" at={c(3) + 22} dur={16} color={C.blue} arrow={{ x: 1400, y: 540, angle: 0 }} />
        {ripple > 0 &&
          [0, 1, 2].map((k) => {
            const t = ((f - out) / 50 + k / 3) % 1;
            return <circle key={k} cx={965} cy={515} r={70 + t * 300} fill="none" stroke={C.turquoise} strokeWidth={2.5} opacity={(1 - t) * 0.35 * ripple} />;
          })}
        {f > out + 10 && <FlowDot point={{ x: lerp(880, 520, ((f - out - 10) / 50) % 1), y: 515 }} r={7} />}
      </Svg>
      <Reveal at={out} kind="left" style={{ left: 330, top: 430 }}>
        <IconBadge name="student" size={140} round bg="#fff" color={C.turquoiseDark} />
        <Text size={32} weight={700} style={{ textAlign: "center", width: 140, marginTop: 12 }}>المستفيد</Text>
      </Reveal>
      {impacts.map((im, i) => (
        <Reveal key={im} at={c(3, ["في تعلمه", "أو حقوقه", "أو فرصه", "أو سلامته", "أو بياناته"][i])} kind="scale" style={[{ left: 150, top: 300 }, { left: 420, top: 300 }, { left: 110, top: 700 }, { left: 400, top: 700 }, { left: 580, top: 370 }][i]}>
          <Chip label={im} size={24} />
        </Reveal>
      ))}
      <Reveal at={c(3, "حتى وإن")} kind="up" style={{ left: 260, top: 860, width: 600 }}>
        <Card tone="cyan" style={{ padding: "16px 24px", textAlign: "center" }}>
          <Text size={26} weight={600} color={C.teal}>يتأثر… حتى وإن لم يستخدم الوكيل بنفسه</Text>
        </Card>
      </Reveal>
    </>
  );
};

const PractitionerEntity: React.FC = () => {
  const f = useCurrentFrame();
  const { c } = useCues();
  const ent = c(4, "أما الجهة");
  return (
    <>
      <Svg>
        <rect x={260} y={250} width={1400} height={640} rx={44} fill="rgba(13,92,104,0.03)" stroke={C.teal} strokeWidth={3} opacity={prog(f, ent, 24)} />
      </Svg>
      <Reveal at={ent} kind="fade" style={{ left: 300, top: 280 }}>
        <Chip icon="building" label="الجهة: تستخدم الوكلاء أو تتيحها" size={28} color="#fff" bg={C.teal} />
      </Reveal>
      <Reveal at={c(4, "وتتحمل")} kind="scale" style={{ left: 300, top: 780 }}>
        <Chip icon="shieldCheck" label="وتتحمل مسؤولية استخدامها" size={28} />
      </Reveal>
      <Reveal at={c(4)} kind="right" style={{ left: 1000, top: 380, width: 560 }}>
        <Card style={{ width: 560, padding: 30 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <IconBadge name="teacher" size={90} round color={C.blue} bg={C.blueLight} />
            <Text size={36} weight={700}>الممارس</Text>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            {["المعلم", "عضو هيئة التدريس", "المدرب"].map((r, i) => (
              <Reveal key={r} at={c(4, ["المعلم", "وعضو", "والمدرب"][i])} kind="scale" style={{ position: "relative" }}>
                <Chip label={r} size={24} />
              </Reveal>
            ))}
          </div>
          <Reveal at={c(4, "وكل من")} kind="fade" style={{ position: "relative", marginTop: 18 }}>
            <Text size={24} color={C.muted}>وكل من يصمم التعلم أو يقوّمه أو يدعم المتعلم</Text>
          </Reveal>
        </Card>
      </Reveal>
      <Reveal at={ent + 10} kind="scale" style={{ left: 520, top: 470 }}>
        <AgentCore size={130} label="الوكلاء" />
      </Reveal>
    </>
  );
};
