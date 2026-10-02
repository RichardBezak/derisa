import { DAILY_EVENTS, MESSAGES, MUMO_TUNING, NIGHT_EVENTS, SCHOOL_STORIES } from "./config";
import { getDayPhase, isNightTime, isOutdoorPlayAvailable, isSchoolOpen, type DayPhase } from "./time";
import type { GameState, Mood, NeedKey, Needs } from "./types";

export const clamp100 = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
};

export const clampNeeds = (needs: Needs): Needs => ({
  satiety: clamp100(needs.satiety),
  cleanliness: clamp100(needs.cleanliness),
  energy: clamp100(needs.energy),
  joy: clamp100(needs.joy),
});

export const createDefaultState = (now: number = Date.now()): GameState => ({
  schemaVersion: MUMO_TUNING.schemaVersion,
  bearName: "MUMO",
  onboardingDone: false,
  needs: { ...MUMO_TUNING.needs.startingValues },
  lastUpdatedAt: now,
  sleeping: false,
  sleepStartedAt: null,
  activity: null,
  pendingActivityResult: null,
  history: [],
  dayEvent: null,
  soundOn: true,
  lastOpenedAt: now,
  timeOffsetMs: 0,
});

/** Apply gentle time-based decay/restoration. Never mutates the input. */
export const applyElapsedTime = (state: GameState, now: number): GameState => {
  const elapsedMs = Math.max(0, now - state.lastUpdatedAt);
  const hours = elapsedMs / 3_600_000;
  if (hours <= 0) return { ...state, lastUpdatedAt: now };

  const rates = state.sleeping ? MUMO_TUNING.decayPerHourSleeping : MUMO_TUNING.decayPerHourAwake;
  const next: Needs = { ...state.needs };
  (Object.keys(next) as NeedKey[]).forEach((key) => {
    next[key] = next[key] - rates[key] * hours;
  });

  return { ...state, needs: clampNeeds(next), lastUpdatedAt: now };
};

export const localDayKey = (now: number): string => {
  const d = new Date(now);
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const pick = <T>(list: readonly T[]): T =>
  list[Math.floor(Math.random() * list.length)] as T;

/** Picks today's small event once per calendar day. */
export const ensureDayEvent = (state: GameState, now: number): GameState => {
  const today = localDayKey(now);
  if (state.dayEvent && state.dayEvent.date === today) return state;
  return { ...state, dayEvent: { date: today, eventId: pick(DAILY_EVENTS).id } };
};

const hashString = (value: string): number => {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) % 100000;
  return h;
};

/**
 * Daytime shows the stored event of the day; at night a calm night event is
 * derived from the same date, so no school or outdoor wish appears in the dark.
 */
export const getDayEvent = (state: GameState, phase: DayPhase = "day") => {
  if (phase === "night") {
    const date = state.dayEvent?.date ?? "";
    const index = hashString(date) % NIGHT_EVENTS.length;
    return NIGHT_EVENTS[index] ?? null;
  }
  return DAILY_EVENTS.find((e) => e.id === state.dayEvent?.eventId) ?? null;
};

export interface ResolveResult {
  state: GameState;
  finishedStory: string | null;
}

/** Resolves a timed activity (school) that may have ended while the app was closed. */
export const resolveTimedActivity = (state: GameState, now: number): ResolveResult => {
  const activity = state.activity;
  if (!activity || activity.status !== "active" || now < activity.endsAt) {
    return { state, finishedStory: null };
  }
  const story = pick(SCHOOL_STORIES);
  return {
    state: {
      ...state,
      activity: null,
      pendingActivityResult: { type: "school", text: story, acknowledged: false },
      needs: clampNeeds({ ...state.needs, joy: state.needs.joy + MUMO_TUNING.school.joyGain }),
      history: [
        ...state.history,
        { activityType: activity.activityType, finishedAt: activity.endsAt, story },
      ],
    },
    finishedStory: story,
  };
};

export interface RefreshResult {
  state: GameState;
  finishedStory: string | null;
  wasAway: boolean;
}

/** Single entry point used on app open / visibility change. */
export const refreshState = (state: GameState, now: number): RefreshResult => {
  const previousOpenedAt = state.lastOpenedAt;
  let next = applyElapsedTime(state, now);
  const resolved = resolveTimedActivity(next, now);
  next = ensureDayEvent(resolved.state, now);
  const wasAway =
    now - previousOpenedAt >= MUMO_TUNING.absence.welcomeBackAfterMs &&
    !next.sleeping &&
    !isAtSchool(next, now);
  next = { ...next, lastOpenedAt: now };
  return { state: next, finishedStory: resolved.finishedStory, wasAway };
};

/** Sleep and timed activities (school) are mutually exclusive. */
export const isAtSchool = (state: GameState, now: number): boolean =>
  !!state.activity && state.activity.status === "active" && now < state.activity.endsAt;

/** School also respects its opening hours (07:00–17:29 departure). */
export const canStartSchool = (state: GameState, now: number): boolean =>
  !state.sleeping && !isAtSchool(state, now) && isSchoolOpen(now);

export const canSleep = (state: GameState, now: number): boolean =>
  !state.sleeping && !isAtSchool(state, now);

/** Indoor play (the games menu itself) is always reachable while awake. */
export const canPlay = (state: GameState, now: number): boolean =>
  !state.sleeping && !isAtSchool(state, now);

/** Trampoline and playground are outside, so daylight is required. */
export const canPlayOutdoors = (
  state: GameState,
  now: number,
  welcomeSession = false,
): boolean => canPlay(state, now) && (welcomeSession || isOutdoorPlayAvailable(now));

export const isNight = isNightTime;

export const dayPhase = (now: number): DayPhase => getDayPhase(now);

/** Mood is derived from the needs, with the lowest urgent need winning. */
export const deriveMood = (state: GameState): Mood => {
  if (state.sleeping) return "spanok";
  const low = MUMO_TUNING.needs.lowThreshold;
  const all: { mood: Mood; value: number }[] = [
    { mood: "hladny", value: state.needs.satiety },
    { mood: "unaveny", value: state.needs.energy },
    { mood: "spinavy", value: state.needs.cleanliness },
    { mood: "smutny", value: state.needs.joy },
  ];
  const candidates = all.filter((c) => c.value < low);

  const first = candidates.sort((a, b) => a.value - b.value)[0];
  return first ? first.mood : "vesely";
};

export const moodMessage = (mood: Mood): string => {
  switch (mood) {
    case "spanok":
      return pick(MESSAGES.sleeping);
    case "hladny":
      return pick(MESSAGES.hungry);
    case "spinavy":
      return pick(MESSAGES.dirty);
    case "unaveny":
      return pick(MESSAGES.tired);
    case "smutny":
      return pick(MESSAGES.sad);
    default:
      return pick(MESSAGES.happy);
  }
};

export const pickMessage = pick;
