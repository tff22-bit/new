import { FONT_DATA } from "./fontData";

// الخط مضمّن في الحزمة نفسها، فلا يعتمد تحميله على طلب شبكة قد يتعطل أثناء التصيير
const RANGES = {
  arabic:
    "U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0898-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC",
  latin:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
};

const toBuffer = (b64: string) => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
};

let started = false;

// يُضاف الخط كبيانات ثنائية مضمّنة فيصبح متاحًا فورًا دون أي طلب شبكة
export const loadFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  for (const f of FONT_DATA) {
    const face = new FontFace("IBM Plex Sans Arabic", toBuffer(f.b64), { weight: String(f.weight), unicodeRange: RANGES[f.subset] });
    (document.fonts as unknown as { add: (x: FontFace) => void }).add(face);
  }
};
