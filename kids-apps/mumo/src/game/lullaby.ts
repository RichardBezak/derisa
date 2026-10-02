import lullabyAsset from "@/assets/lullaby.mp3.asset.json";

/** One shared audio element, so re-renders never restart or double-play it. */
let audio: HTMLAudioElement | null = null;
let endedHandler: (() => void) | null = null;

/** Must be called directly from the user's tap so mobile browsers allow playback. */
export const startLullaby = (onEnded: () => void): void => {
  if (typeof window === "undefined") return;
  if (!audio) {
    audio = new Audio(lullabyAsset.url);
    audio.preload = "auto";
    audio.loop = false;
    audio.addEventListener("ended", () => endedHandler?.());
  }
  endedHandler = onEnded;
  if (!audio.paused) return;
  audio.currentTime = 0;
  void audio.play().catch(() => {
    /* playback blocked — scene still shows */
  });
};

export const stopLullaby = (): void => {
  endedHandler = null;
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
};
