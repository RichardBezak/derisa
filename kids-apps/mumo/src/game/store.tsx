import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  FOODS,
  MESSAGES,
  MUMO_TUNING,
  SCHOOL_MOMENTS,
  SCHOOL_STORIES,
  type FoodId,
} from "./config";
import {
  applyElapsedTime,
  canPlay,
  canPlayOutdoors,
  canSleep,
  canStartSchool,
  clampNeeds,
  createDefaultState,
  deriveMood,
  ensureDayEvent,
  getDayEvent,
  isAtSchool,
  moodMessage,
  pickMessage,
  refreshState,
} from "./engine";
import { clearGameState, loadGameState, saveGameState } from "./storage";
import {
  clearWelcomeSession,
  getDayPhase,
  isSchoolOpen,
  isWelcomeSession,
  markWelcomeSession,
  offsetForTimeMode,
  readTimeOverride,
  SCHOOL_CLOSED_TEXT,
  writeTimeOverride,
  type DayPhase,
} from "./time";
import { playSound } from "./sound";
import type { ActivityType, GameState, Mood, Needs } from "./types";

interface MumoStore {
  state: GameState;
  ready: boolean;
  mood: Mood;
  night: boolean;
  /** Real phase of the effective time (unaffected by the welcome day). */
  dayPhase: DayPhase;
  /** First session after naming: the room always looks like daytime. */
  welcomeSession: boolean;
  schoolOpen: boolean;
  /** Active parent-panel time mode; "real" is the default for the child. */
  timeMode: string;
  message: string;
  atSchool: boolean;
  canSleep: boolean;
  canSchool: boolean;
  canPlay: boolean;
  canPlayOutdoors: boolean;
  returnMessageActive: boolean;
  say: (text: string) => void;
  now: () => number;
  actions: {
    completeOnboarding: (name: string) => void;
    feed: (foodId: FoodId) => void;
    finishWashing: () => void;
    startSleep: () => void;
    wakeUp: () => void;
    pet: () => void;
    finishTrampoline: () => void;
    finishPlayground: () => void;
    finishSeesaw: () => void;
    finishSlide: () => void;
    finishSinging: () => void;
    startSchool: () => void;
    finishSchoolVisit: () => void;
    setSound: (on: boolean) => void;
    reset: () => void;
    // test panel
    shiftTime: (hours: number) => void;
    setTimeMode: (modeId: string) => void;
    finishActivityNow: () => void;
    restoreAllNeeds: () => void;
    acknowledgeActivityResult: () => void;
  };
}

// Keep one context instance across hot reloads so provider and consumers always match.
const contextHolder = globalThis as unknown as {
  __mumoContext?: React.Context<MumoStore | null>;
};
const MumoContext: React.Context<MumoStore | null> =
  contextHolder.__mumoContext ?? (contextHolder.__mumoContext = createContext<MumoStore | null>(null));

export function MumoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => createDefaultState(Date.now()));
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string>(MESSAGES.greeting[0]);
  const [returnMessageActive, setReturnMessageActive] = useState(false);
  const [welcomeSession, setWelcomeSession] = useState(false);
  const [timeMode, setTimeMode] = useState("real");
  const lastPetRef = useRef(0);
  const offsetRef = useRef(0);
  const returnTimerRef = useRef<number | null>(null);

  const now = useCallback(() => Date.now() + offsetRef.current, []);

  const commit = useCallback((updater: (prev: GameState) => GameState) => {
    setState((prev) => {
      const next = updater(prev);
      offsetRef.current = next.timeOffsetMs;
      saveGameState(next);
      return next;
    });
  }, []);

  const say = useCallback((text: string) => setMessage(text), []);

  /** Recalculate from elapsed time on open and whenever the app becomes active. */
  const refresh = useCallback(
    (base?: GameState) => {
      setState((prev) => {
        const source = base ?? prev;
        offsetRef.current = source.timeOffsetMs;
        const result = refreshState(source, Date.now() + source.timeOffsetMs);
        saveGameState(result.state);
        if (result.state.onboardingDone) {
          setMessage(moodMessage(deriveMood(result.state)));
          if (returnTimerRef.current) window.clearTimeout(returnTimerRef.current);
          if (result.wasAway) {
            setReturnMessageActive(true);
            returnTimerRef.current = window.setTimeout(() => setReturnMessageActive(false), 3200);
          } else {
            setReturnMessageActive(false);
          }
        }
        return result.state;
      });
    },
    [],
  );

  useEffect(() => {
    const loaded = loadGameState(Date.now());
    /** Test time is session-only, so a fresh open always uses the real clock. */
    const override = readTimeOverride();
    setTimeMode(override.modeId);
    setWelcomeSession(loaded.onboardingDone && isWelcomeSession());
    refresh({ ...loaded, timeOffsetMs: override.offsetMs });
    setReady(true);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      if (returnTimerRef.current) window.clearTimeout(returnTimerRef.current);
    };
  }, [refresh]);

  const addNeeds = useCallback(
    (delta: Partial<Needs>) =>
      commit((prev) => {
        const withTime = applyElapsedTime(prev, Date.now() + prev.timeOffsetMs);
        const needs = clampNeeds({
          satiety: withTime.needs.satiety + (delta.satiety ?? 0),
          cleanliness: withTime.needs.cleanliness + (delta.cleanliness ?? 0),
          energy: withTime.needs.energy + (delta.energy ?? 0),
          joy: withTime.needs.joy + (delta.joy ?? 0),
        });
        return { ...withTime, needs };
      }),
    [commit],
  );

  const sound = state.soundOn;

  const actions = useMemo<MumoStore["actions"]>(
    () => ({
      completeOnboarding: (name: string) => {
        const clean = name.trim().slice(0, 12);
        commit((prev) =>
          ensureDayEvent(
            {
              ...prev,
              bearName: clean || "MUMO",
              onboardingDone: true,
              sleeping: false,
              sleepStartedAt: null,
              lastUpdatedAt: Date.now() + prev.timeOffsetMs,
              lastOpenedAt: Date.now() + prev.timeOffsetMs,
            },
            Date.now() + prev.timeOffsetMs,
          ),
        );
        markWelcomeSession();
        setWelcomeSession(true);
        playSound("happy", sound);
        setMessage(pickMessage(MESSAGES.woke));
      },
      feed: (foodId: FoodId) => {
        const food = FOODS.find((f) => f.id === foodId);
        addNeeds({ satiety: food?.satietyGain ?? 20 });
        playSound("eat", sound);
        setMessage(pickMessage(MESSAGES.eating));
      },
      finishWashing: () => {
        addNeeds({ cleanliness: MUMO_TUNING.washing.cleanlinessGain });
        playSound("bubble", sound);
        setMessage(pickMessage(MESSAGES.washed));
      },
      startSleep: () => {
        let allowed = true;
        commit((prev) => {
          const t = Date.now() + prev.timeOffsetMs;
          if (!canSleep(prev, t)) {
            allowed = false;
            return prev;
          }
          const withTime = applyElapsedTime(prev, t);
          return { ...withTime, sleeping: true, sleepStartedAt: t };
        });
        if (!allowed) {
          setMessage(MESSAGES.schoolActive);
          return;
        }
        playSound("sleep", sound);
        setMessage(pickMessage(MESSAGES.sleeping));
      },
      wakeUp: () => {
        commit((prev) => {
          const t = Date.now() + prev.timeOffsetMs;
          const withTime = applyElapsedTime(prev, t);
          return { ...withTime, sleeping: false, sleepStartedAt: null };
        });
        playSound("happy", sound);
        setMessage(pickMessage(MESSAGES.woke));
      },
      pet: () => {
        const t = Date.now();
        if (t - lastPetRef.current < MUMO_TUNING.petting.cooldownMs) return;
        lastPetRef.current = t;
        addNeeds({ joy: MUMO_TUNING.petting.joyGain });
        playSound("tap", sound);
        setMessage(pickMessage(MESSAGES.petted));
      },
      finishTrampoline: () => {
        addNeeds({
          joy: MUMO_TUNING.trampoline.joyGain,
          energy: -MUMO_TUNING.trampoline.energyCost,
        });
        commit((prev) => ({
          ...prev,
          history: [
            ...prev.history,
            { activityType: "trampolina" as ActivityType, finishedAt: Date.now() },
          ],
        }));
        playSound("jump", sound);
        setMessage(pickMessage(MESSAGES.trampolineEnd));
      },
      finishPlayground: () => {
        addNeeds({
          joy: MUMO_TUNING.playground.joyGain,
          energy: -MUMO_TUNING.playground.energyCost,
        });
        commit((prev) => ({
          ...prev,
          history: [
            ...prev.history,
            { activityType: "ihrisko" as ActivityType, finishedAt: Date.now() },
          ],
        }));
        playSound("happy", sound);
        setMessage(pickMessage(MESSAGES.playgroundEnd));
      },
      finishSeesaw: () => {
        addNeeds({
          joy: MUMO_TUNING.seesaw.joyGain,
          energy: -MUMO_TUNING.seesaw.energyCost,
        });
        commit((prev) => ({
          ...prev,
          history: [...prev.history, { activityType: "hojdacka", finishedAt: Date.now() }],
        }));
        playSound("happy", sound);
        setMessage(pickMessage(MESSAGES.seesawEnd));
      },
      finishSlide: () => {
        addNeeds({
          joy: MUMO_TUNING.slide.joyGain,
          energy: -MUMO_TUNING.slide.energyCost,
        });
        commit((prev) => ({
          ...prev,
          history: [...prev.history, { activityType: "smyklavka", finishedAt: Date.now() }],
        }));
        playSound("happy", sound);
        setMessage(pickMessage(MESSAGES.slideEnd));
      },
      finishSinging: () => {
        addNeeds({ joy: MUMO_TUNING.sing.joyGain });
        setMessage(pickMessage(MESSAGES.singEnd));
      },
      /**
       * School is a free activity now: entering only checks the opening hours
       * and never starts a timer that would lock the rest of the game.
       */
      startSchool: () => {
        const t = Date.now() + state.timeOffsetMs;
        if (state.sleeping) {
          setMessage(pickMessage(MESSAGES.sleeping));
          return;
        }
        if (!isSchoolOpen(t)) {
          setMessage(SCHOOL_CLOSED_TEXT);
          return;
        }
        playSound("tap", sound);
        setMessage(pickMessage(SCHOOL_MOMENTS));
      },
      /** Leaving the classroom ends the visit and tells one short story. */
      finishSchoolVisit: () => {
        addNeeds({ joy: MUMO_TUNING.school.joyGain });
        commit((prev) => ({
          ...prev,
          activity: null,
          history: [
            ...prev.history,
            { activityType: "skola" as ActivityType, finishedAt: Date.now() },
          ],
        }));
        playSound("happy", sound);
        setMessage(pickMessage(SCHOOL_STORIES));
      },
      setSound: (on: boolean) => commit((prev) => ({ ...prev, soundOn: on })),
      reset: () => {
        clearGameState();
        clearWelcomeSession();
        writeTimeOverride("real", 0);
        setTimeMode("real");
        setWelcomeSession(false);
        offsetRef.current = 0;
        const fresh = createDefaultState(Date.now());
        saveGameState(fresh);
        setState(fresh);
        setReturnMessageActive(false);
        setMessage(MESSAGES.greeting[0]);
      },
      shiftTime: (hours: number) => {
        commit((prev) => ({ ...prev, timeOffsetMs: prev.timeOffsetMs + hours * 3_600_000 }));
      },
      setTimeMode: (modeId: string) => {
        const offset = offsetForTimeMode(modeId);
        writeTimeOverride(modeId, offset);
        setTimeMode(modeId);
        /* A chosen test time must show its real day/night look. */
        clearWelcomeSession();
        setWelcomeSession(false);
        offsetRef.current = offset;
        setState((prev) => {
          const result = refreshState({ ...prev, timeOffsetMs: offset }, Date.now() + offset);
          saveGameState(result.state);
          setMessage(moodMessage(deriveMood(result.state)));
          return result.state;
        });
      },
      finishActivityNow: () => {
        commit((prev) =>
          prev.activity
            ? {
                ...prev,
                activity: { ...prev.activity, endsAt: Date.now() + prev.timeOffsetMs - 1000 },
              }
            : prev,
        );
        setTimeout(() => refresh(), 0);
      },
      restoreAllNeeds: () =>
        commit((prev) => ({
          ...applyElapsedTime(prev, Date.now() + prev.timeOffsetMs),
          needs: { satiety: 100, cleanliness: 100, energy: 100, joy: 100 },
        })),
      acknowledgeActivityResult: () =>
        commit((prev) =>
          prev.pendingActivityResult
            ? {
                ...prev,
                pendingActivityResult: { ...prev.pendingActivityResult, acknowledged: true },
              }
            : prev,
        ),
    }),
    [addNeeds, commit, refresh, sound, state.sleeping, state.timeOffsetMs],
  );

  const value = useMemo<MumoStore>(() => {
    const t = Date.now() + state.timeOffsetMs;
    /** One daylight decision drives the room look and outdoor games alike. */
    const daylight = welcomeSession || getDayPhase(t) === "day";
    return {
      state,
      ready,
      mood: deriveMood(state),
      dayPhase: getDayPhase(t),
      welcomeSession,
      night: !daylight,
      schoolOpen: isSchoolOpen(t),
      timeMode,
      canPlayOutdoors: canPlay(state, t) && daylight,
      message,
      returnMessageActive,
      atSchool: isAtSchool(state, t),
      canSleep: canSleep(state, t),
      canSchool: canStartSchool(state, t),
      canPlay: canPlay(state, t),
      say,
      now,
      actions,
    };
  },
    [actions, message, now, ready, say, state, timeMode, welcomeSession],
  );

  return <MumoContext.Provider value={value}>{children}</MumoContext.Provider>;
}

export const useMumo = (): MumoStore => {
  const ctx = useContext(MumoContext);
  if (!ctx) throw new Error("useMumo must be used inside MumoProvider");
  return ctx;
};

export { getDayEvent };
