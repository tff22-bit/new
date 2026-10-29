import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import { TIMELINE } from "./timeline";
import { FPS, H, W } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition id="AIAgentsStandards" component={Video} durationInFrames={TIMELINE.total} fps={FPS} width={W} height={H} />
);
