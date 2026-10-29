import React from "react";
import { C } from "../theme";

// أيقونة مستوى الأثر: أعمدة متدرجة
export const Bars: React.FC<{ n: number; size?: number; color?: string }> = ({ n, size = 40, color = C.teal }) => (
  <svg width={size} height={size} viewBox="0 0 30 30">
    {[0, 1, 2].map((i) => (
      <rect key={i} x={20 - i * 9} y={22 - i * 7} width={6} height={8 + i * 7} rx={2} fill={i < n ? color : C.line} />
    ))}
  </svg>
);
