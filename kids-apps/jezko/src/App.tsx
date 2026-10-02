import { useEffect, useRef, useState } from "react";
import { Bath, CircleStop, Heart, Mic, Trash2, Utensils, Volume2, Waves, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import garden from "@/assets/woodland-garden.jpg";
import hedgehog from "@/assets/hedgehog.png";
import bathtub from "@/assets/bathtub.png";
import foodBasket from "@/assets/food-basket.png";


type Activity = "rest" | "swing" | "bath" | "eat";

const activityMessages: Record<Activity, string> = {
  rest: "Čo dnes spolu podnikneme?",
  swing: "Jupííí! Ešte vyššie!",
  bath: "Bublinky ma šteklia!",
  eat: "Mňam! To je dobrota!",
};

export function HedgehogGame() {
  const [activity, setActivity] = useState<Activity>("rest");
  const [hearts, setHearts] = useState(0);
  const [showVoice, setShowVoice] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [micError, setMicError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const urlRef = useRef<string | null>(null);
  const actionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!recording) return;
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [recording]);

  useEffect(() => () => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  function doActivity(next: Activity) {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    setActivity(next);
    setHearts((value) => value + 1);
    actionTimeoutRef.current = setTimeout(() => setActivity("rest"), next === "swing" ? 4200 : 3200);
  }

  function clearRecording() {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setRecordedUrl(null);
    setSeconds(0);
  }

  async function startRecording() {
    setMicError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMicError("Tento prehliadač nepodporuje nahrávanie hlasu.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      clearRecording();
      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        if (chunks.length > 0) {
          const url = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
          urlRef.current = url;
          setRecordedUrl(url);
        }
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        recorderRef.current = null;
      };
      recorder.start();
      setSeconds(0);
      setRecording(true);
    } catch {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setMicError("Mikrofón nie je dostupný. Povoľ ho v nastaveniach prehliadača.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setRecording(false);
  }

  function closeVoice() {
    if (recording) stopRecording();
    setShowVoice(false);
  }

  return (
    <main className="game-page">
      <div className="game-shell">
        <header className="game-header">
          <div className="brand">
            <span className="brand-sun" aria-hidden="true">✳</span>
            <div>
              <span className="brand-overline">malý lesný svet</span>
              <h1>Ježkove dobrodružstvá</h1>
            </div>
          </div>
          <div className="love-count" aria-label={`${hearts} radostných chvíľ`}>
            <Heart size={19} fill="currentColor" strokeWidth={2.5} />
            <span>{hearts}</span>
          </div>
        </header>

        <section className={`game-scene activity-${activity}`} aria-label="Lesná záhrada s ježkom">
          <img className="scene-background" src={garden} width={1536} height={1024} alt="Slnečná lesná lúka s veľkým stromom" />
          <div className="scene-vignette" />

          <div className={`swing ${activity === "swing" ? "swing-active" : ""}`} aria-hidden="true">
            <div className="swing-rope swing-rope-left" />
            <div className="swing-rope swing-rope-right" />
            <div className="swing-seat" />
          </div>

          <img className="scene-food" src={foodBasket} width={816} height={816} alt="" />
          <img className="scene-bath" src={bathtub} width={816} height={816} alt="" />

          <div className={`hedgehog-position hedgehog-${activity}`}>
            <div className="speech-bubble" role="status" key={activity}>{activityMessages[activity]}</div>
            <img className="hedgehog-image" src={hedgehog} width={816} height={816} alt="Usmiaty ježko" />
            {activity === "bath" && <span className="bath-sparkles" aria-hidden="true">✧ ✦ ✧</span>}
            {activity === "eat" && <span className="eat-heart" aria-hidden="true">♥</span>}
          </div>
          <div className="scene-bottom-label"><span className="label-dot" /> Naša lesná lúka</div>
        </section>

        <section className="play-area" aria-label="Čo chceš robiť s ježkom?">
          <div className="play-heading">
            <div>
              <span className="section-eyebrow">VYBER SI DOBRODRUŽSTVO</span>
              <h2>Čo dnes zažijeme?</h2>
            </div>
            <p>Stačí si vybrať a ježko sa hneď poteší.</p>
          </div>
          <div className="action-grid">
            <Button className="action-card action-swing" variant="outline" onClick={() => doActivity("swing")} title="Pohojdať ježka na strome">
              <span className="action-icon"><Waves size={27} strokeWidth={2.1} /></span>
              <span className="action-copy"><strong>Pohojdať</strong><small>na strome</small></span>
              <span className="action-arrow" aria-hidden="true">↗</span>
            </Button>
            <Button className="action-card action-bath" variant="outline" onClick={() => doActivity("bath")} title="Dopriať ježkovi kúpeľ">
              <span className="action-icon"><Bath size={27} strokeWidth={2.1} /></span>
              <span className="action-copy"><strong>Okúpať</strong><small>v bublinkách</small></span>
              <span className="action-arrow" aria-hidden="true">↗</span>
            </Button>
            <Button className="action-card action-eat" variant="outline" onClick={() => doActivity("eat")} title="Nakŕmiť ježka">
              <span className="action-icon"><Utensils size={25} strokeWidth={2.1} /></span>
              <span className="action-copy"><strong>Nakŕmiť</strong><small>niečím dobrým</small></span>
              <span className="action-arrow" aria-hidden="true">↗</span>
            </Button>
            <Button className="action-card action-voice" variant="outline" onClick={() => setShowVoice(true)} title="Nahrať hlasovku pre ježka">
              <span className="action-icon"><Mic size={26} strokeWidth={2.1} /></span>
              <span className="action-copy"><strong>Hlasovka</strong><small>povedz mu niečo</small></span>
              <span className="action-arrow" aria-hidden="true">↗</span>
            </Button>
          </div>
        </section>
        <footer className="game-footer"><span>✿</span> Každý deň je s kamarátom krajší. <span>✿</span></footer>
      </div>

      {showVoice && (
        <div className="voice-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeVoice(); }}>
          <section className="voice-panel" role="dialog" aria-modal="true" aria-labelledby="voice-title">
            <Button variant="ghost" size="icon" className="voice-close" onClick={closeVoice} aria-label="Zavrieť hlasovku"><X size={20} /></Button>
            <div className="voice-illustration"><Volume2 size={31} /></div>
            <span className="section-eyebrow">ODKAZ PRE JEŽKA</span>
            <h2 id="voice-title">Povedz mu niečo milé</h2>
            <p className="voice-description">Nahraj hlasovku a potom si ju môžete spolu vypočuť.</p>
            <div className="recording-display">
              <span className={`recording-light ${recording ? "is-recording" : ""}`} />
              <span>{recording ? "Nahrávam..." : recordedUrl ? "Hlasovka je pripravená" : "Pripravené na nahrávanie"}</span>
              <span className="recording-time">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span>
            </div>
            {micError && <p className="mic-error" role="alert">{micError}</p>}
            {recordedUrl && <audio className="voice-audio" controls src={recordedUrl} aria-label="Prehrať nahranú hlasovku" />}
            <div className="voice-controls">
              {recording ? (
                <Button className="record-button stop-button" onClick={stopRecording}><CircleStop size={19} /> Zastaviť nahrávanie</Button>
              ) : (
                <Button className="record-button" onClick={startRecording}><Mic size={19} /> {recordedUrl ? "Nahrať znova" : "Začať nahrávať"}</Button>
              )}
              {recordedUrl && !recording && <Button className="delete-button" variant="outline" size="icon" onClick={clearRecording} title="Vymazať hlasovku" aria-label="Vymazať hlasovku"><Trash2 size={18} /></Button>}
            </div>
            <p className="voice-note">Hlasovka zostáva len v tomto prehliadači, kým je hra otvorená.</p>
          </section>
        </div>
      )}
    </main>
  );
}