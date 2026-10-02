/**
 * Modular voice filters for the "MUMO si chce zaspievať" activity.
 *
 * Every filter only re-colours the child's own recording — no speech
 * recognition, no synthesis, no network. Adding a new filter (robotický,
 * medvedí, ...) means appending one entry to VOICE_FILTERS.
 */

export interface VoiceFilter {
  id: string;
  label: string;
  /** 1 = original pitch, >1 = higher voice. Speed stays the same. */
  pitchRatio: number;
  /** Gentle pitch wobble in cents, used for the operatic voice. */
  vibratoCents?: number;
  /** Optional extra colouring applied after the pitch shift. */
  build?: (ctx: BaseAudioContext, input: AudioNode) => AudioNode;
}

export const VOICE_FILTERS: VoiceFilter[] = [
  {
    id: "realny",
    label: "Reálny hlas",
    pitchRatio: 1,
  },
  {
    id: "detsky",
    label: "Detský hlas",
    pitchRatio: 1.45,
    build: (ctx, input) => {
      const presence = ctx.createBiquadFilter();
      presence.type = "peaking";
      presence.frequency.value = 2600;
      presence.Q.value = 0.9;
      presence.gain.value = 3;
      const cleanup = ctx.createBiquadFilter();
      cleanup.type = "highpass";
      cleanup.frequency.value = 130;
      input.connect(presence).connect(cleanup);
      return cleanup;
    },
  },
  {
    id: "operny",
    label: "Operný hlas",
    pitchRatio: 1.8,
    vibratoCents: 35,
    build: (ctx, input) => {
      /* Výrazný vysoký tón s teplým, zrozumiteľným stredným pásmom. */
      const warmth = ctx.createBiquadFilter();
      warmth.type = "peaking";
      warmth.frequency.value = 950;
      warmth.Q.value = 0.85;
      warmth.gain.value = 5;
      input.connect(warmth);
      return warmth;
    },
  },
  {
    id: "roboticky",
    label: "Robotický hlas",
    pitchRatio: 0.85,
    build: (ctx, input) => {
      /* Rýchle pravidelné prerušovanie hlasitosti — robotický dojem. */
      const tremolo = ctx.createGain();
      tremolo.gain.value = 1;
      const lfo = ctx.createOscillator();
      lfo.type = "square";
      lfo.frequency.value = 9;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = 0.35;
      lfo.connect(lfoDepth).connect(tremolo.gain);
      lfo.start();
      const metallic = ctx.createBiquadFilter();
      metallic.type = "bandpass";
      metallic.frequency.value = 1400;
      metallic.Q.value = 0.6;
      input.connect(tremolo).connect(metallic);
      return metallic;
    },
  },
];

export const getVoiceFilter = (id: string): VoiceFilter =>
  VOICE_FILTERS.find((f) => f.id === id) ?? (VOICE_FILTERS[0] as VoiceFilter);

const OfflineCtor = (): typeof OfflineAudioContext | null => {
  if (typeof window === "undefined") return null;
  return (
    window.OfflineAudioContext ??
    (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext })
      .webkitOfflineAudioContext ??
    null
  );
};

/**
 * Granular pitch shift: overlapping grains are replayed faster (higher pitch)
 * but re-anchored to their original position, so the length is preserved.
 */
export const applyVoiceFilter = async (
  buffer: AudioBuffer,
  filter: VoiceFilter,
): Promise<AudioBuffer> => {
  const Ctor = OfflineCtor();
  if (!Ctor) return buffer;

  const ctx = new Ctor(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const master = ctx.createGain();
  master.gain.value = 1;
  const tail = filter.build ? filter.build(ctx, master) : master;
  tail.connect(ctx.destination);

  const ratio = Math.max(0.5, Math.min(2.5, filter.pitchRatio));
  const grain = 0.11; // output grain length in seconds
  const hop = grain / 2;

  for (let t = 0; t < buffer.duration; t += hop) {
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    if (filter.vibratoCents) {
      // Modulate pitch, not loudness; keep the phase continuous between grains.
      const curve = new Float32Array(17);
      for (let i = 0; i < curve.length; i += 1) {
        const at = t + (i / (curve.length - 1)) * grain;
        curve[i] = ratio * 2 ** ((filter.vibratoCents * Math.sin(2 * Math.PI * 5.5 * at)) / 1200);
      }
      src.playbackRate.setValueCurveAtTime(curve, t, grain);
    } else {
      src.playbackRate.value = ratio;
    }
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(1, t + hop);
    env.gain.linearRampToValueAtTime(0, t + grain);
    src.connect(env).connect(master);
    const available = Math.max(0, buffer.duration - t);
    src.start(t, t, Math.min(grain * ratio, available));
    src.stop(t + grain + 0.02);
  }

  try {
    return await ctx.startRendering();
  } catch {
    return buffer;
  }
};

/** First MediaRecorder mime type the browser really supports (Safari/iOS + Chrome). */
export const pickRecorderMimeType = (): string | undefined => {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/mp4;codecs=mp4a.40.2",
    "audio/ogg;codecs=opus",
  ];
  return candidates.find((type) => {
    try {
      return MediaRecorder.isTypeSupported(type);
    } catch {
      return false;
    }
  });
};

export const isRecordingSupported = (): boolean =>
  typeof window !== "undefined" &&
  typeof MediaRecorder !== "undefined" &&
  !!navigator.mediaDevices?.getUserMedia;
