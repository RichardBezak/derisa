import { describe, expect, it } from "vitest";
import { MUMO_TUNING } from "../config";
import {
  applyElapsedTime,
  canSleep,
  canStartSchool,
  clamp100,
  createDefaultState,
  refreshState,
  resolveTimedActivity,
} from "../engine";
import { parseGameState } from "../storage";
import type { GameState } from "../types";

const HOUR = 3_600_000;
const base = (overrides: Partial<GameState> = {}): GameState => ({
  ...createDefaultState(0),
  ...overrides,
});

describe("clamping", () => {
  it("keeps values inside 0–100", () => {
    expect(clamp100(-20)).toBe(0);
    expect(clamp100(140)).toBe(100);
    expect(clamp100(Number.NaN)).toBe(0);
  });
});

describe("elapsed-time needs calculation", () => {
  it("decays needs by the configured hourly rates while awake", () => {
    const state = base({ needs: { satiety: 100, cleanliness: 100, energy: 100, joy: 100 } });
    const next = applyElapsedTime(state, 10 * HOUR);
    expect(next.needs.satiety).toBeCloseTo(100 - 10 * MUMO_TUNING.decayPerHourAwake.satiety);
    expect(next.needs.energy).toBeCloseTo(100 - 10 * MUMO_TUNING.decayPerHourAwake.energy);
    expect(next.lastUpdatedAt).toBe(10 * HOUR);
  });

  it("never drops below zero over a very long absence", () => {
    const next = applyElapsedTime(base(), 1000 * HOUR);
    Object.values(next.needs).forEach((v) => expect(v).toBe(0));
  });

  it("restores energy while sleeping and keeps it clamped at 100", () => {
    const state = base({
      sleeping: true,
      sleepStartedAt: 0,
      needs: { satiety: 80, cleanliness: 80, energy: 10, joy: 80 },
    });
    const after2h = applyElapsedTime(state, 2 * HOUR);
    expect(after2h.needs.energy).toBeCloseTo(10 + 2 * 8);
    const after20h = applyElapsedTime(state, 20 * HOUR);
    expect(after20h.needs.energy).toBe(100);
  });
});

describe("school completion", () => {
  it("resolves after reopening the app once the time has passed", () => {
    const state = base({
      activity: {
        activityType: "skola",
        startedAt: 0,
        endsAt: MUMO_TUNING.school.durationMs,
        status: "active",
      },
      needs: { satiety: 50, cleanliness: 50, energy: 50, joy: 50 },
    });
    const { state: next, finishedStory } = resolveTimedActivity(
      state,
      MUMO_TUNING.school.durationMs + 1000,
    );
    expect(finishedStory).toBeTruthy();
    expect(next.activity).toBeNull();
    expect(next.history).toHaveLength(1);
    expect(next.needs.joy).toBeCloseTo(50 + MUMO_TUNING.school.joyGain);
  });

  it("stays active before the end time", () => {
    const state = base({
      activity: { activityType: "skola", startedAt: 0, endsAt: 10 * 60_000, status: "active" },
    });
    expect(resolveTimedActivity(state, 5 * 60_000).finishedStory).toBeNull();
  });
});

describe("sleep and school are mutually exclusive", () => {
  it("blocks school while sleeping and sleep while at school", () => {
    expect(canStartSchool(base({ sleeping: true }), 0)).toBe(false);
    const atSchool = base({
      activity: { activityType: "skola", startedAt: 0, endsAt: HOUR, status: "active" },
    });
    expect(canSleep(atSchool, 1000)).toBe(false);
    expect(canSleep(base(), 1000)).toBe(true);
  });
});

describe("return after absence", () => {
  it("flags a long absence using lastOpenedAt, not lastUpdatedAt", () => {
    const state = base({ lastOpenedAt: 0, lastUpdatedAt: 5 * HOUR, onboardingDone: true });
    expect(refreshState(state, 6 * HOUR).wasAway).toBe(true);
    expect(refreshState({ ...state, lastOpenedAt: 6 * HOUR }, 6 * HOUR).wasAway).toBe(false);
  });
});

describe("corrupted local data recovery", () => {
  it("falls back to a valid default state", () => {
    expect(parseGameState("{not json", 0).bearName).toBe("MUMO");
    expect(parseGameState(null, 0).onboardingDone).toBe(false);
    expect(parseGameState(JSON.stringify({ schemaVersion: 99 }), 0).needs.satiety).toBe(
      MUMO_TUNING.needs.startingValues.satiety,
    );
    const broken = JSON.stringify({ schemaVersion: 1, needs: { satiety: "x" } });
    expect(parseGameState(broken, 0).needs.energy).toBe(
      MUMO_TUNING.needs.startingValues.energy,
    );
  });

  it("clamps stored out-of-range values", () => {
    const raw = JSON.stringify({
      schemaVersion: 1,
      needs: { satiety: 500, cleanliness: -80, energy: 50, joy: 50 },
      lastUpdatedAt: 0,
    });
    const state = parseGameState(raw, 0);
    expect(state.needs.satiety).toBe(100);
    expect(state.needs.cleanliness).toBe(0);
  });
});
