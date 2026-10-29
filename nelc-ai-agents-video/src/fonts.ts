import { continueRender, delayRender, staticFile } from "remotion";

const weights = [400, 500, 600, 700];
const subsets = ["arabic", "latin"];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Loading IBM Plex Sans Arabic");
  const faces = weights.flatMap((w) =>
    subsets.map((s) => {
      const face = new FontFace(
        "IBM Plex Sans Arabic",
        `url(${staticFile(`fonts/ibm-plex-sans-arabic-${s}-${w}-normal.woff2`)}) format('woff2')`,
        {
          weight: String(w),
          unicodeRange:
            s === "arabic"
              ? "U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0898-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC"
              : "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
        },
      );
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
      return face.load();
    }),
  );
  Promise.all(faces)
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
