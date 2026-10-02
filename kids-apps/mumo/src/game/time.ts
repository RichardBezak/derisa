/**
 * Single source of truth for every time-based rule in the prototype.
 * No screen may decide day/night, school hours or outdoor play on its own.
 */
import { MUMO_TUNING } from "./config";
import type { GameState } from "./types";

export type DayPhase = "day" | "night";

/** Device time plus the test-panel offset. */
export const getEffectiveNow = (state: Pick<GameState, "timeOffsetMs">): number =>
  Date.now() + state.timeOffsetMs;

const minutesOfDay = (now: number): number => {
  const d = new Date(now);
  return d.getHours() * 60 + d.getMinutes();
};

/** day 07:00–17:59, evening/night 18:00–06:59 */
export const getDayPhase = (now: number): DayPhase => {
  const hour = new Date(now).getHours();
  return hour >= MUMO_TUNING.time.dayStartHour && hour <= MUMO_TUNING.time.dayEndHour
    ? "day"
    : "night";
};

export const isNightTime = (now: number): boolean => getDayPhase(now) === "night";

/** School may only be entered early enough to finish inside opening hours. */
export const isSchoolOpen = (now: number): boolean => {
  const m = minutesOfDay(now);
  return m >= MUMO_TUNING.time.schoolOpenMinute && m <= MUMO_TUNING.time.schoolLastEntryMinute;
};

/** Trampoline and playground happen outside, so only during daylight. */
export const isOutdoorPlayAvailable = (now: number): boolean => getDayPhase(now) === "day";

export const SCHOOL_CLOSED_TEXT = "Škola je teraz zatvorená. Pôjdeme ráno.";
export const SCHOOL_HOURS_HINT = "Škola je otvorená od 7:00 do 18:00.";
export const OUTDOOR_CLOSED_TEXT = "Vonku je už tma. Zahráme sa zase ráno.";

const WELCOME_KEY = "mumo.welcomeSession";

/** The very first meeting after naming always looks like daytime. */
export const markWelcomeSession = (): void => {
  try {
    sessionStorage.setItem(WELCOME_KEY, "1");
  } catch {
    /* private mode — the welcome day is only cosmetic */
  }
};

export const isWelcomeSession = (): boolean => {
  try {
    return sessionStorage.getItem(WELCOME_KEY) === "1";
  } catch {
    return false;
  }
};

export const clearWelcomeSession = (): void => {
  try {
    sessionStorage.removeItem(WELCOME_KEY);
  } catch {
    /* ignore */
  }
};

/** Parent-panel time modes. "real" is always the default for the child. */
export interface TimeMode {
  id: string;
  label: string;
  /** null = follow the real device clock. */
  hour: number | null;
  minute?: number;
}

export const TIME_MODES: readonly TimeMode[] = [
  { id: "real", label: "Skutočný čas", hour: null },
  { id: "morning", label: "Ráno – 08:00", hour: 8, minute: 0 },
  { id: "day", label: "Deň – 12:00", hour: 12, minute: 0 },
  { id: "beforeClose", label: "Pred zatvorením školy – 17:20", hour: 17, minute: 20 },
  { id: "evening", label: "Večer – 18:30", hour: 18, minute: 30 },
  { id: "night", label: "Noc – 21:00", hour: 21, minute: 0 },
];

/** Offset that moves the effective clock to the mode's wall-clock time today. */
export const offsetForTimeMode = (modeId: string, now: number = Date.now()): number => {
  const mode = TIME_MODES.find((m) => m.id === modeId);
  if (!mode || mode.hour === null) return 0;
  const target = new Date(now);
  target.setHours(mode.hour, mode.minute ?? 0, 0, 0);
  return target.getTime() - now;
};

const TIME_MODE_KEY = "mumo.timeMode";
const TIME_OFFSET_KEY = "mumo.timeOffset";

/** Test time lives only in the session, never in the child's saved game. */
export const readTimeOverride = (): { modeId: string; offsetMs: number } => {
  try {
    const modeId = sessionStorage.getItem(TIME_MODE_KEY) ?? "real";
    const offsetMs = Number(sessionStorage.getItem(TIME_OFFSET_KEY) ?? "0");
    return { modeId, offsetMs: Number.isFinite(offsetMs) ? offsetMs : 0 };
  } catch {
    return { modeId: "real", offsetMs: 0 };
  }
};

export const writeTimeOverride = (modeId: string, offsetMs: number): void => {
  try {
    if (modeId === "real") {
      sessionStorage.removeItem(TIME_MODE_KEY);
      sessionStorage.removeItem(TIME_OFFSET_KEY);
    } else {
      sessionStorage.setItem(TIME_MODE_KEY, modeId);
      sessionStorage.setItem(TIME_OFFSET_KEY, String(offsetMs));
    }
  } catch {
    /* private mode — test time simply does not persist */
  }
};
