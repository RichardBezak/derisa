import { useEffect, useMemo, useRef, useState } from "react";
import { Backpack, Mic, Music, Settings } from "lucide-react";
import { startLullaby, stopLullaby } from "@/game/lullaby";
import { LullabyScene } from "./LullabyScene";
import { ACTION_ART, type MumoArt } from "@/game/assets";
import { MESSAGES, SCHOOL_MOMENTS, SCHOOL_STORIES } from "@/game/config";
import { getDayEvent, useMumo } from "@/game/store";
import type { ActivityType, NeedKey, Needs } from "@/game/types";
import { cn } from "@/lib/utils";
import { ActionButton } from "./ActionButton";
import { ActivityPanel } from "./ActivityPanel";
import { BathScene } from "./BathScene";
import { FoodScene } from "./FoodScene";
import { MumoCharacter } from "./MumoCharacter";
import { NeedIndicators } from "./NeedIndicators";
import { PlaygroundScene } from "./PlaygroundScene";
import { SceneDecor } from "./SceneDecor";
import { SceneNavProvider, NEED_TO_TARGET, type CareTarget, type SceneNavValue } from "./SceneNav";
import { SchoolScene } from "./SchoolScene";
import { SeesawScene } from "./SeesawScene";
import { SettingsSheet } from "./SettingsSheet";
import { SingScene } from "./SingScene";
import { SleepScene } from "./SleepScene";
import { SlideScene } from "./SlideScene";
import { SpeechBubble } from "./SpeechBubble";
import { TrampolineScene } from "./TrampolineScene";

type Scene =
  | "room"
  | "food"
  | "bath"
  | "sleep"
  | "activities"
  | "trampolina"
  | "ihrisko"
  | "hojdacka"
  | "smyklavka"
  | "skola"
  | "spev"
  | "uspavanka"
  | "settings";

const ActionIcon = ({ art }: { art: MumoArt }) => (
  <img src={art.src} alt="" aria-hidden className="size-10 object-contain" loading="lazy" />
);

const reactionMessages: string[] = [
  ...MESSAGES.eating,
  ...MESSAGES.washed,
  ...MESSAGES.woke,
  ...MESSAGES.petted,
  ...MESSAGES.trampolineEnd,
  ...MESSAGES.playgroundEnd,
  ...MESSAGES.seesawEnd,
  ...MESSAGES.slideEnd,
  ...MESSAGES.singEnd,
  ...SCHOOL_STORIES,
  ...SCHOOL_MOMENTS,
];

const needMessages = {
  satiety: "Trochu mi škvŕka v brušku.",
  cleanliness: "Moja srsť potrebuje učesať.",
  energy: "Začínam byť ospalý.",
  joy: "Zahráme sa spolu?",
} as const;

const lowestNeedMessage = (needs: Needs): string | null => {
  const ordered = [
    { key: "satiety", value: needs.satiety },
    { key: "cleanliness", value: needs.cleanliness },
    { key: "energy", value: needs.energy },
    { key: "joy", value: needs.joy },
  ] as const;
  const lowest = [...ordered].sort((a, b) => a.value - b.value)[0];
  return lowest && lowest.value < 50 ? needMessages[lowest.key] : null;
};

/** While MUMO sleeps only the sleep scene, lullaby and settings may open. */
const SLEEP_LOCKED_NEEDS: readonly NeedKey[] = ["satiety", "cleanliness", "joy"];
const OPEN_WHILE_SLEEPING: ReadonlySet<Scene> = new Set<Scene>(["room", "sleep", "uspavanka", "settings"]);

/** Which care icon is highlighted for the scene that is open. */
const ACTIVE_NEED: Partial<Record<Scene, NeedKey>> = {
  food: "satiety",
  bath: "cleanliness",
  sleep: "energy",
  activities: "joy",
  trampolina: "joy",
  ihrisko: "joy",
  hojdacka: "joy",
  smyklavka: "joy",
};

export function MainRoom() {
  const { state, mood, night, message, returnMessageActive, actions, canSleep, canPlay, canSchool } =
    useMumo();
  const [scene, setScene] = useState<Scene>("room");
  const [showReaction, setShowReaction] = useState(true);
  const schoolVisit = useRef(false);
  /** One shared time rule: night in the room means night events and texts. */
  const dayEvent = getDayEvent(state, night ? "night" : "day");

  useEffect(() => {
    setShowReaction(true);
    const timer = window.setTimeout(() => setShowReaction(false), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  /** Only games arrive here — school has its own scene. */
  const pickActivity = (activity: ActivityType) => setScene(activity);

  /**
   * Any navigation away from the classroom ends the visit, so the story is
   * told exactly once per visit and nothing stays locked.
   */
  const goto = (requested: Scene) => {
    /* Central sleep guard: any path to a blocked scene leads back to the sleeping MUMO. */
    const next: Scene = state.sleeping && !OPEN_WHILE_SLEEPING.has(requested) ? "room" : requested;
    if (next === "skola" && canSchool) schoolVisit.current = true;
    if (scene === "skola" && next !== "skola" && schoolVisit.current) {
      schoolVisit.current = false;
      actions.finishSchoolVisit();
    }
    /* Lullaby audio starts straight from the tap and stops on leaving. */
    if (next === "uspavanka" && scene !== "uspavanka") startLullaby(() => setScene("room"));
    if (scene === "uspavanka" && next !== "uspavanka") stopLullaby();
    setScene(next);
  };

  const close = () => goto("room");

  /* A stale open scene (e.g. MUMO fell asleep elsewhere) is closed as well. */
  useEffect(() => {
    if (state.sleeping && !OPEN_WHILE_SLEEPING.has(scene)) setScene("room");
  }, [state.sleeping, scene]);
  const roomNight = night || state.sleeping;
  const sceneAllowed = !state.sleeping || OPEN_WHILE_SLEEPING.has(scene);

  /**
   * Switching scenes unmounts the previous one, so its timers, animations,
   * sounds and microphone streams are released by its own cleanup.
   */
  const nav = useMemo<SceneNavValue>(
    () => ({
      active: ACTIVE_NEED[scene] ?? null,
      scene,
      sleeping: state.sleeping,
      needs: state.needs,
      go: (target: CareTarget) => goto(target),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scene, state.needs, canSchool, state.sleeping],
  );

  const pendingResult = state.pendingActivityResult?.acknowledged === false ? state.pendingActivityResult : null;
  const needMessage = lowestNeedMessage(state.needs);
  const actionReaction = showReaction && reactionMessages.includes(message) ? message : null;
  const bubble = state.sleeping
    ? MESSAGES.sleeping[0]
    : returnMessageActive
      ? MESSAGES.welcomeBack
      : actionReaction
        ? actionReaction
        : needMessage
          ? needMessage
          : dayEvent
            ? dayEvent.message
            : message;

  const sceneNode =
    scene === "food" ? (
      <FoodScene onClose={close} />
    ) : scene === "bath" ? (
      <BathScene onClose={close} />
    ) : scene === "sleep" ? (
      <SleepScene onClose={close} />
    ) : scene === "trampolina" ? (
      <TrampolineScene onClose={close} />
    ) : scene === "ihrisko" ? (
      <PlaygroundScene onClose={close} />
    ) : scene === "hojdacka" ? (
      <SeesawScene onClose={close} />
    ) : scene === "smyklavka" ? (
      <SlideScene onClose={close} />
    ) : scene === "skola" ? (
      <SchoolScene onClose={close} />
    ) : scene === "spev" ? (
      <SingScene onClose={close} />
    ) : scene === "uspavanka" ? (
      <LullabyScene onClose={close} />
    ) : scene === "activities" ? (
      <ActivityPanel onClose={close} onPick={pickActivity} />
    ) : scene === "settings" ? (
      <SettingsSheet onClose={close} />
    ) : null;

  if (sceneNode && sceneAllowed) return <SceneNavProvider value={nav}>{sceneNode}</SceneNavProvider>;

  return (
    <SceneNavProvider value={nav}>
      <main
        className={cn(
          "relative flex min-h-screen flex-col items-center justify-between gap-3 px-4 pb-6 pt-4 transition-colors",
          roomNight ? "bg-night text-cream" : "bg-cream text-cocoa",
        )}
      >
        <SceneDecor scene="room" night={roomNight} />

        <header className="z-10 flex w-full max-w-md items-center justify-between">
          <h1 className="font-display text-xl font-bold">{state.bearName}</h1>
          <button
            type="button"
            onClick={() => goto("settings")}
            aria-label="Nastavenia"
            className="flex size-11 items-center justify-center rounded-full bg-white/70 text-cocoa shadow"
          >
            <Settings className="size-6" />
          </button>
        </header>

        <div className="z-10 w-full max-w-md">
          <NeedIndicators
            needs={state.needs}
            active={null}
            disabledKeys={state.sleeping ? SLEEP_LOCKED_NEEDS : undefined}
            onSelect={(key) => goto(NEED_TO_TARGET[key] as Scene)}
          />
        </div>

        <div className="z-10 flex w-full max-w-md flex-col items-center gap-4">
          <SpeechBubble text={bubble} />
          <MumoCharacter
            mood={state.sleeping ? "spanok" : mood}
            onClick={state.sleeping ? undefined : actions.pet}
          />
        </div>

        <nav className="z-10 grid w-full max-w-md grid-cols-4 gap-2">
          <ActionButton label="Jedlo" tone="honey" onClick={() => goto("food")} disabled={state.sleeping}>
            <ActionIcon art={ACTION_ART.food} />
          </ActionButton>
          <ActionButton label="Kúpeľ" tone="sky" onClick={() => goto("bath")} disabled={state.sleeping}>
            <ActionIcon art={ACTION_ART.bath} />
          </ActionButton>
          <ActionButton
            label={state.sleeping ? "Zobudiť" : "Spánok"}
            tone="cream"
            onClick={() => (state.sleeping ? actions.wakeUp() : goto("sleep"))}
            disabled={!state.sleeping && !canSleep}
          >
            <ActionIcon art={ACTION_ART.sleep} />
          </ActionButton>
          <ActionButton label="Hry" tone="sage" onClick={() => goto("activities")} disabled={!canPlay}>
            <ActionIcon art={ACTION_ART.play} />
          </ActionButton>
        </nav>

        {/* separate activities, not games */}
        <div className="z-10 grid w-full max-w-md grid-cols-3 gap-2">
          <ActionButton
            label="Škola"
            tone="honey"
            onClick={() => goto("skola")}
            disabled={state.sleeping}
            className="min-h-20 min-w-0 px-2"
          >
            <Backpack className="size-8" />
          </ActionButton>
          <ActionButton
            label="Zaspievať"
            tone="coral"
            onClick={() => goto("spev")}
            disabled={state.sleeping}
            className="min-h-20 min-w-0 px-2"
          >
            <Mic className="size-8" />
          </ActionButton>
          <ActionButton
            label="Zahraj mi uspávanku"
            tone="sky"
            onClick={() => goto("uspavanka")}
            className="min-h-20 min-w-0 px-2 text-center leading-tight"
          >
            <Music className="size-8" />
          </ActionButton>
        </div>
        {pendingResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/35 px-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="school-result-title"
              className="w-full max-w-sm rounded-3xl bg-cream p-6 text-center shadow-[0_18px_40px_-18px_rgba(90,60,20,0.65)]"
            >
              <h2 id="school-result-title" className="font-display text-2xl font-bold text-cocoa">
                MUMO sa vrátil zo školy!
              </h2>
              <p className="mt-3 font-display text-lg leading-snug text-cocoa">{pendingResult.text}</p>
              <button
                type="button"
                onClick={actions.acknowledgeActivityResult}
                className="mt-5 min-h-14 rounded-2xl bg-sage px-8 font-display text-lg font-bold text-cocoa shadow-[0_5px_0_rgba(120,85,40,0.2)]"
              >
                Super!
              </button>
            </section>
          </div>
        )}
      </main>
    </SceneNavProvider>
  );
}
