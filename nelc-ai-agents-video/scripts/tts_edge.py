"""توليد التعليق الصوتي بمكتبة Edge TTS المجانية (بلا مفتاح API): ملف MP3 مستقل لكل مشهد.

لكل مشهد يُكتب:
  public/audio/<scene>.mp3          الصوت
  public/audio/<scene>.words.json   توقيت كل كلمة: [{"t": ثوانٍ, "c": موضع الحرف في نص المشهد}]
ثم يستخرج build-timing.mjs بداية كل مقطع (beat) من توقيت أول كلماته.

الاستخدام:
  python scripts/tts_edge.py [--voice ar-SA-HamedNeural] [--rate=+0%] [--only s07] [--force]
يمر الاتصال عبر الوسيط المعرّف في HTTPS_PROXY إن وُجد.
"""
import argparse
import asyncio
import json
import os
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "public" / "audio"
SEP = " "  # فاصل المقاطع داخل نص المشهد؛ علامات الترقيم في النص تمنح الوقفات الطبيعية


async def synth(text: str, voice: str, rate: str, out: Path, words_out: Path) -> float:
    comm = edge_tts.Communicate(
        text, voice, rate=rate, boundary="WordBoundary", proxy=os.environ.get("HTTPS_PROXY") or None
    )
    audio = bytearray()
    words = []
    cursor = 0
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            w = chunk["text"]
            idx = text.find(w, cursor)
            if idx >= 0:
                cursor = idx + len(w)
            words.append({"t": chunk["offset"] / 1e7, "d": chunk["duration"] / 1e7, "c": idx if idx >= 0 else cursor, "w": w})
    if not audio:
        raise RuntimeError(f"no audio returned for {out.name}")
    out.write_bytes(bytes(audio))
    words_out.write_text(json.dumps(words, ensure_ascii=False))
    return words[-1]["t"] + words[-1]["d"] if words else 0.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="ar-SA-HamedNeural")
    ap.add_argument("--rate", default="+0%")
    ap.add_argument("--only")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    AUDIO.mkdir(parents=True, exist_ok=True)
    narration = json.loads((ROOT / "src/data/narration.json").read_text(encoding="utf-8"))
    for s in narration["scenes"]:
        if a.only and s["id"] != a.only:
            continue
        out = AUDIO / f"{s['id']}.mp3"
        words = AUDIO / f"{s['id']}.words.json"
        if out.exists() and words.exists() and not a.force:
            continue
        text = SEP.join(b["text"] for b in s["beats"])
        end = asyncio.run(synth(text, a.voice, a.rate, out, words))
        print(f"{s['id']}: {end:.1f}s", flush=True)
    print("done — now run: npm run timing")


if __name__ == "__main__":
    main()
