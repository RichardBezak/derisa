/** Tiny gentle placeholder sounds via WebAudio (no audio assets needed yet). */
type SoundName = "tap" | "eat" | "bubble" | "sleep" | "happy" | "jump";

const TONES: Record<SoundName, { freq: number; dur: number; type: OscillatorType }> = {
  tap: { freq: 520, dur: 0.08, type: "sine" },
  eat: { freq: 380, dur: 0.12, type: "triangle" },
  bubble: { freq: 900, dur: 0.09, type: "sine" },
  sleep: { freq: 220, dur: 0.35, type: "sine" },
  happy: { freq: 700, dur: 0.16, type: "triangle" },
  jump: { freq: 620, dur: 0.1, type: "square" },
};

let ctx: AudioContext | null = null;

export const playSound = (name: SoundName, enabled: boolean): void => {
  if (!enabled || typeof window === "undefined") return;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = ctx ?? new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    const { freq, dur, type } = TONES[name];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  } catch {
    /* sound is optional */
  }
};
