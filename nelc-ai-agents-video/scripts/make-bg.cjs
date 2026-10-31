// يولّد صورة شبكة النقاط الثابتة للخلفية مرة واحدة (أسرع في التصيير من رسمها لكل إطار)
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.setContent(`<html><body style="margin:0;background:transparent">
  <div style="position:absolute;inset:0;background-image:radial-gradient(#B5CDD4 1.3px, transparent 1.6px);background-size:36px 36px;
  -webkit-mask-image:radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.5) 75%)"></div></body></html>`);
  await p.screenshot({ path: process.argv[2], omitBackground: true });
  await b.close();
})();
