import { MUMO_TUNING } from "./config";
import { clampNeeds, createDefaultState } from "./engine";
import type { GameState } from "./types";

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Safely reads local data; any corruption falls back to a valid default state. */
export const parseGameState = (raw: string | null, now: number = Date.now()): GameState => {
  const fallback = createDefaultState(now);
  if (!raw) return fallback;
  try {
    const data = JSON.parse(raw) as Partial<GameState>;
    if (!data || typeof data !== "object") return fallback;
    if (data.schemaVersion !== MUMO_TUNING.schemaVersion) return fallback;
    const needs = data.needs;
    if (
      !needs ||
      !isNumber(needs.satiety) ||
      !isNumber(needs.cleanliness) ||
      !isNumber(needs.energy) ||
      !isNumber(needs.joy)
    ) {
      return fallback;
    }
    const pending = data.pendingActivityResult;
    return {
      ...fallback,
      ...data,
      bearName: typeof data.bearName === "string" && data.bearName.trim() ? data.bearName : "MUMO",
      onboardingDone: data.onboardingDone === true,
      needs: clampNeeds(needs),
      lastUpdatedAt: isNumber(data.lastUpdatedAt) ? data.lastUpdatedAt : now,
      lastOpenedAt: isNumber(data.lastOpenedAt) ? data.lastOpenedAt : now,
      sleeping: data.sleeping === true,
      sleepStartedAt: isNumber(data.sleepStartedAt) ? data.sleepStartedAt : null,
      /**
       * Legacy saves could hold a 30-minute school timer that locked the whole
       * game. School is a free activity now, so such an entry is safely closed
       * while every other saved value is kept.
       */
      activity:
        data.activity && data.activity.activityType !== "skola" ? data.activity : null,
      pendingActivityResult:
        pending && pending.type === "school" && typeof pending.text === "string"
          ? { type: "school", text: pending.text, acknowledged: pending.acknowledged === true }
          : null,
      history: Array.isArray(data.history) ? data.history : [],
      dayEvent: data.dayEvent ?? null,
      soundOn: data.soundOn !== false,
      timeOffsetMs: isNumber(data.timeOffsetMs) ? data.timeOffsetMs : 0,
    };
  } catch {
    return fallback;
  }
};

export const loadGameState = (now: number = Date.now()): GameState => {
  if (typeof window === "undefined") return createDefaultState(now);
  try {
    return parseGameState(window.localStorage.getItem(MUMO_TUNING.storageKey), now);
  } catch {
    return createDefaultState(now);
  }
};

export const saveGameState = (state: GameState): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MUMO_TUNING.storageKey, JSON.stringify(state));
  } catch {
    /* storage full or unavailable — prototype keeps running in memory */
  }
};

export const clearGameState = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(MUMO_TUNING.storageKey);
  } catch {
    /* ignore */
  }
};
