import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setBrowserExecutable("/opt/pw-browsers/chromium");
Config.setChromiumOpenGlRenderer("swangle");
Config.setConcurrency(4);
