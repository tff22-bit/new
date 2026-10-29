"""توليد السرد العربي لكل مقطع في ملف مستقل، مع علامات توقيت الكلمات إن أتاحها المزوّد.

الاستخدام:
  python scripts/tts.py --provider polly   [--voice Zayd]           # AWS Polly (Neural, ar-AE)
  python scripts/tts.py --provider azure   [--voice ar-SA-HamedNeural]
  python scripts/tts.py --provider elevenlabs --voice <VOICE_ID>
  python scripts/tts.py --provider google  [--voice ar-XA-Chirp3-HD-...]
  خيارات: --only s07  (مشهد واحد)  --force  (إعادة التوليد)

بيانات الاعتماد تُقرأ من متغيرات البيئة فقط، ولا تُكتب في المشروع:
  polly:      AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION
  azure:      AZURE_SPEECH_KEY / AZURE_SPEECH_REGION
  elevenlabs: ELEVENLABS_API_KEY
  google:     GOOGLE_APPLICATION_CREDENTIALS
بعد التوليد: npm run timing  (لتحديث مدد المشاهد من الملفات الفعلية)
"""
import argparse
import json
import os
import sys
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "public" / "audio"


def polly(text, voice, out, marks_out):
    import boto3

    region = os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION") or "us-east-1"
    client = boto3.client("polly", region_name=region)
    ssml = f'<speak><prosody rate="95%">{escape(text)}</prosody></speak>'
    common = dict(Text=ssml, TextType="ssml", VoiceId=voice, Engine="neural", LanguageCode="ar-AE")
    audio = client.synthesize_speech(OutputFormat="mp3", SampleRate="24000", **common)
    out.write_bytes(audio["AudioStream"].read())
    marks = client.synthesize_speech(OutputFormat="json", SpeechMarkTypes=["word"], **common)
    raw = marks["AudioStream"].read().decode("utf-8").strip().splitlines()
    # إزاحات Polly بالبايت داخل نص SSML؛ تُحوَّل إلى موضع حرف داخل النص الأصلي
    prefix = len('<speak><prosody rate="95%">'.encode("utf-8"))
    escaped = escape(text).encode("utf-8")
    result = []
    for line in raw:
        m = json.loads(line)
        byte = max(0, m["start"] - prefix)
        char = len(escaped[:byte].decode("utf-8", errors="ignore"))
        char = len(text[: max(0, char)])  # تقريب آمن عند وجود رموز مهرّبة
        result.append({"t": m["time"] / 1000.0, "c": char})
    marks_out.write_text(json.dumps(result, ensure_ascii=False))


def azure(text, voice, out, marks_out):
    import azure.cognitiveservices.speech as speechsdk

    cfg = speechsdk.SpeechConfig(subscription=os.environ["AZURE_SPEECH_KEY"], region=os.environ["AZURE_SPEECH_REGION"])
    cfg.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3)
    synth = speechsdk.SpeechSynthesizer(speech_config=cfg, audio_config=speechsdk.audio.AudioOutputConfig(filename=str(out)))
    marks = []
    synth.synthesis_word_boundary.connect(lambda e: marks.append({"t": e.audio_offset / 1e7, "c": e.text_offset}))
    ssml = (
        '<speak version="1.0" xml:lang="ar-SA" xmlns="http://www.w3.org/2001/10/synthesis">'
        f'<voice name="{voice}"><prosody rate="-5%">{escape(text)}</prosody></voice></speak>'
    )
    res = synth.speak_ssml_async(ssml).get()
    if res.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
        raise RuntimeError(res.cancellation_details.error_details)
    offset = ssml.index(escape(text))
    marks_out.write_text(json.dumps([{"t": m["t"], "c": max(0, m["c"] - offset)} for m in marks]))


def elevenlabs(text, voice, out, marks_out):
    import base64
    import requests

    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps",
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"]},
        json={"text": text, "model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.55, "similarity_boost": 0.75}},
        timeout=120,
    )
    r.raise_for_status()
    data = r.json()
    out.write_bytes(base64.b64decode(data["audio_base64"]))
    al = data["alignment"]
    marks = [{"t": t, "c": i} for i, t in enumerate(al["character_start_times_seconds"]) if i == 0 or al["characters"][i - 1] == " "]
    marks_out.write_text(json.dumps(marks))


def google(text, voice, out, marks_out):
    from google.cloud import texttospeech as tts

    client = tts.TextToSpeechClient()
    res = client.synthesize_speech(
        input=tts.SynthesisInput(text=text),
        voice=tts.VoiceSelectionParams(language_code="ar-XA", name=voice),
        audio_config=tts.AudioConfig(audio_encoding=tts.AudioEncoding.MP3, speaking_rate=0.95),
    )
    out.write_bytes(res.audio_content)


PROVIDERS = {
    "polly": (polly, "Zayd"),
    "azure": (azure, "ar-SA-HamedNeural"),
    "elevenlabs": (elevenlabs, None),
    "google": (google, "ar-XA-Wavenet-B"),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=PROVIDERS)
    ap.add_argument("--voice")
    ap.add_argument("--only")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    fn, default_voice = PROVIDERS[a.provider]
    voice = a.voice or default_voice
    if not voice:
        sys.exit("--voice is required for this provider")
    AUDIO.mkdir(parents=True, exist_ok=True)
    narration = json.loads((ROOT / "src/data/narration.json").read_text(encoding="utf-8"))
    for s in narration["scenes"]:
        if a.only and s["id"] != a.only:
            continue
        for b in s["beats"]:
            out = AUDIO / f"{s['id']}_{b['id']}.mp3"
            marks = AUDIO / f"{s['id']}_{b['id']}.marks.json"
            if out.exists() and not a.force:
                continue
            print(f"{s['id']} {b['id']} …", flush=True)
            fn(b["text"], voice, out, marks)
    print("done — now run: npm run timing")


if __name__ == "__main__":
    main()
