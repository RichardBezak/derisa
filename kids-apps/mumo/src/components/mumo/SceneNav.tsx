import { createContext, useContext } from "react";
import type { NeedKey, Needs } from "@/game/types";

/** The four top icons double as the permanent main navigation. */
export type CareTarget = "food" | "bath" | "sleep" | "activities" | "skola" | "spev" | "uspavanka";

export const NEED_TO_TARGET: Record<NeedKey, CareTarget> = {
  satiety: "food",
  cleanliness: "bath",
  energy: "sleep",
  joy: "activities",
};

export interface SceneNavValue {
  /** Which of the four care icons is currently open. */
  active: NeedKey | null;
  /** Identifier of the open scene, used to highlight the bottom buttons. */
  scene: string;
  /** MUMO sleeps: only sleep and lullaby stay open. */
  sleeping: boolean;
  go: (target: CareTarget) => void;
  needs: Needs;
}

const SceneNavContext = createContext<SceneNavValue | null>(null);

export const SceneNavProvider = SceneNavContext.Provider;

export const useSceneNav = (): SceneNavValue | null => useContext(SceneNavContext);
