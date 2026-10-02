import { Check, Mic, Play, RotateCcw, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MUMO_TUNING } from "@/game/config";
import { useMumo } from "@/game/store";
import {
  applyVoiceFilter,
  getVoiceFilter,
  isRecordingSupported,
  pickRecorderMimeType,
  VOICE_FILTERS,
} from "@/game/voiceFilters";
import { cn } from "@/lib/utils";
import { ActionButton } from "./ActionButton";
import { MumoCharacter } from "./MumoCharacter";
import { SceneDecor } from "./SceneDecor";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

type Phase = "idle" | "recording" | "processing" | "ready" | "denied" | "unsupported";

const MAX_SECONDS = Math.round(MUMO_TUNING.sing.maxDurationMs / 1000);

export function SingScene({ onClose }: { onClose: () => void }) {
  const { actions, state } = useMumo();
  const [phase, setPhase] = useState<Phase>(() => (isRecordingSupported() ? "idle" : "unsupported"));
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [level, setLevel] = useState(0);
  const [filterId, setFilterId] = useState("detsky");
  const filterRef = useRef(filterId);
  filterRef.current = filterId;

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  /** Recording lives only here, in memory, for as long as this scene is open. */
  const bufferRef = useRef<AudioBuffer | null>(null);
  /** Pôvodná nahrávka bez filtra — umožní prefarbiť ju iným hlasom. */
  const rawBufferRef = useRef<AudioBuffer | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const stopTimerRef = useRef<number | null>(null);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stopPlayback = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    try {
      sourceRef.current?.stop();
    } catch {
      /* already stopped */
    }
    sourceRef.current = null;
    setPlaying(false);
    setLevel(0);
  }, []);

  /** Full cleanup when the child leaves the activity. */
  useEffect(
    () => () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try {
        recorderRef.current?.state === "recording" && recorderRef.current.stop();
      } catch {
        /* ignore */
      }
      try {
        sourceRef.current?.stop();
      } catch {
        /* ignore */
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      chunksRef.current = [];
      bufferRef.current = null;
      rawBufferRef.current = null;
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [],
  );

  const audioCtx = () => {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctxRef.current = ctxRef.current ?? new Ctor();
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  };

  const stopRecording = useCallback(() => {
    if (tickRef.current) window.clearInterval(tickRef.current);
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    try {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    } catch {
      releaseStream();
      setPhase("idle");
    }
  }, [releaseStream]);

  const startRecording = async () => {
    if (!isRecordingSupported()) {
      setPhase("unsupported");
      return;
    }
    stopPlayback();
    bufferRef.current = null;
    rawBufferRef.current = null;
    chunksRef.current = [];
    setSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickRecorderMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        releaseStream();
        setPhase("processing");
        try {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
          chunksRef.current = [];
          const array = await blob.arrayBuffer();
          const ctx = audioCtx();
          if (!ctx) throw new Error("no audio context");
          const decoded = await ctx.decodeAudioData(array);
          rawBufferRef.current = decoded;
          bufferRef.current = await applyVoiceFilter(decoded, getVoiceFilter(filterRef.current));
          setPhase("ready");
          actions.finishSinging();
        } catch {
          bufferRef.current = null;
          rawBufferRef.current = null;
          setPhase("idle");
        }
      };
      recorder.start();
      setPhase("recording");
      const startedAt = Date.now();
      tickRef.current = window.setInterval(() => {
        setSeconds(Math.min(MAX_SECONDS, Math.floor((Date.now() - startedAt) / 1000)));
      }, 200);
      stopTimerRef.current = window.setTimeout(stopRecording, MUMO_TUNING.sing.maxDurationMs);
    } catch {
      releaseStream();
      setPhase("denied");
    }
  };

  /** Zmena hlasu; hotovú nahrávku hneď prefarbi novým filtrom. */
  const chooseFilter = async (id: string) => {
    setFilterId(id);
    if (phase !== "ready" || !rawBufferRef.current) return;
    stopPlayback();
    setPhase("processing");
    try {
      bufferRef.current = await applyVoiceFilter(rawBufferRef.current, getVoiceFilter(id));
    } catch {
      bufferRef.current = rawBufferRef.current;
    }
    setPhase("ready");
  };

  const play = () => {
    const buffer = bufferRef.current;
    const ctx = audioCtx();
    if (!buffer || !ctx) return;
    stopPlayback();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser).connect(ctx.destination);
    source.onended = () => stopPlayback();
    source.start();
    sourceRef.current = source;
    setPlaying(true);
    const data = new Uint8Array(analyser.fftSize);
    const loop = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i += 1) {
        const v = ((data[i] ?? 128) - 128) / 128;
        sum += v * v;
      }
      setLevel(Math.min(1, Math.sqrt(sum / data.length) * 4));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const bubble =
    phase === "recording"
      ? "Počúvam ťa..."
      : phase === "processing"
        ? "Chvíľku, cvičím si to..."
        : phase === "ready"
          ? playing
            ? "Takto to spievam ja!"
            : "Už to viem! Stlač Prehrať."
          : phase === "denied"
            ? "Bez mikrofónu ťa neslyším, ale skúsiť to môžeme znova."
            : phase === "unsupported"
              ? "Tento prehliadač nahrávanie nepodporuje. Môžeme sa hrať inak."
              : "Zaspievaj, povedz básničku alebo mi niečo porozprávaj. Potom to zopakujem svojím hlasom.";

  const mumoStyle = playing
    ? { transform: `scale(${1 + level * 0.08})` }
    : phase === "recording"
      ? undefined
      : undefined;

  return (
    <SceneShell title="MUMO si chce zaspievať" onClose={onClose} className="bg-cream-deep">
      <SceneDecor scene="sing" />
      <div className="relative z-10 flex w-full flex-col items-center gap-4">
        <SpeechBubble text={bubble} />
        <MumoCharacter
          art={phase === "ready" || phase === "recording" ? "hra" : "vesely"}
          size="md"
          animate={phase === "recording"}
          className={playing ? "transition-transform duration-75" : undefined}
          style={mumoStyle}
        />

        {phase === "recording" && (
          <div className="w-full max-w-[240px]">
            <div className="h-3 overflow-hidden rounded-full bg-cream/80">
              <div
                className="h-full rounded-full bg-coral transition-[width] duration-200 motion-reduce:transition-none"
                style={{ width: `${(seconds / MAX_SECONDS) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-center font-display text-sm text-cocoa">
              Zostáva {MAX_SECONDS - seconds} s
            </p>
          </div>
        )}

        {(phase === "idle" || phase === "denied" || phase === "ready" || phase === "processing") && (
          <div className="w-full max-w-md">
            <p className="mb-2 text-center font-display text-sm font-bold text-cocoa">
              Ktorým hlasom to zopakujem?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {VOICE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => void chooseFilter(f.id)}
                  disabled={phase === "processing"}
                  aria-pressed={filterId === f.id}
                  className={cn(
                    "min-h-12 rounded-2xl px-3 py-2 font-display text-sm font-bold text-cocoa shadow-[0_4px_0_rgba(120,85,40,0.2)] disabled:opacity-60",
                    filterId === f.id ? "bg-coral ring-4 ring-cocoa/30" : "bg-cream",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {(phase === "idle" || phase === "denied") && (
          <ActionButton
            label={phase === "denied" ? "Skúsiť znova" : "Nahrať"}
            tone="coral"
            onClick={() => void startRecording()}
            className="min-h-16 w-auto max-w-[240px] flex-none flex-row px-8"
          >
            <Mic className="size-8" />
          </ActionButton>
        )}

        {phase === "recording" && (
          <ActionButton
            label="Zastaviť"
            tone="honey"
            onClick={stopRecording}
            className="min-h-16 w-auto max-w-[240px] flex-none flex-row px-8"
          >
            <Square className="size-7" />
          </ActionButton>
        )}

        {phase === "ready" && (
          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <ActionButton label="Prehrať" tone="sky" onClick={play} className="min-h-16 flex-row">
              <Play className="size-7" />
            </ActionButton>
            <ActionButton
              label="Nahrať znova"
              tone="honey"
              onClick={() => void startRecording()}
              className="min-h-16 flex-row"
            >
              <RotateCcw className="size-7" />
            </ActionButton>
            <ActionButton label="Hotovo" tone="sage" onClick={onClose} className="min-h-16 flex-row">
              <Check className="size-7" />
            </ActionButton>
          </div>
        )}

        {phase === "unsupported" && (
          <ActionButton
            label="Hotovo"
            tone="sage"
            onClick={onClose}
            className="min-h-16 w-auto max-w-[220px] flex-none flex-row px-8"
          >
            <Check className="size-7" />
          </ActionButton>
        )}

        <p className="text-center text-xs text-cocoa/70">
          Nahrávka zostáva iba v tomto zariadení.
          {!state.soundOn && " Zvuk je vypnutý v nastaveniach, prehrávanie si ho nezapne."}
        </p>
      </div>
    </SceneShell>
  );
}
