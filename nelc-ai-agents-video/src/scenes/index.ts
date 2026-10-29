import type React from "react";
import { S01Opening } from "./S01Opening";
import { S02Purpose } from "./S02Purpose";
import { S03Scope } from "./S03Scope";
import { S04Concepts } from "./S04Concepts";
import { S05Terms } from "./S05Terms";
import { S06Components } from "./S06Components";
import { S07MathExample } from "./S07MathExample";
import { S08Domains } from "./S08Domains";
import { S09AutonomyImpact } from "./S09AutonomyImpact";
import { S10Matrix } from "./S10Matrix";
import { S11Framework } from "./S11Framework";
import { S12Value } from "./S12Value";
import { S13Human } from "./S13Human";
import { S14Accountability } from "./S14Accountability";
import { S15Protection } from "./S15Protection";
import { S16Data } from "./S16Data";
import { S17Security } from "./S17Security";
import { S18Verification } from "./S18Verification";
import { S19DomainReqs } from "./S19DomainReqs";
import { S20Apply } from "./S20Apply";
import { S21Summary } from "./S21Summary";
import { S22Closing } from "./S22Closing";

export const SCENES: Record<string, React.FC> = {
  s01: S01Opening,
  s02: S02Purpose,
  s03: S03Scope,
  s04: S04Concepts,
  s05: S05Terms,
  s06: S06Components,
  s07: S07MathExample,
  s08: S08Domains,
  s09: S09AutonomyImpact,
  s10: S10Matrix,
  s11: S11Framework,
  s12: S12Value,
  s13: S13Human,
  s14: S14Accountability,
  s15: S15Protection,
  s16: S16Data,
  s17: S17Security,
  s18: S18Verification,
  s19: S19DomainReqs,
  s20: S20Apply,
  s21: S21Summary,
  s22: S22Closing,
};
