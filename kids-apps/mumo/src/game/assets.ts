/**
 * Single swap point for MUMO artwork.
 * Each visual state maps to its OWN image file. Never use the character sheet
 * as one shared image or a cropped sprite sheet. To replace a state with a
 * final production PNG, change only the import below — game logic is untouched.
 * `isPlaceholder: true` marks temporary art awaiting a final asset.
 */
import mumoHappy from "@/assets/mumo-happy.png";
import mumoHungry from "@/assets/mumo-hungry.png";
import mumoDirty from "@/assets/mumo-dirty.png";
import mumoSleeping from "@/assets/mumo-sleeping.png";
import mumoPlay from "@/assets/mumo-play.png";
import mumoBath from "@/assets/mumo-bath.png";
import mumoSchool from "@/assets/mumo-school.png";
import luluImg from "@/assets/lulu.png";
import type { Mood } from "./types";

export interface MumoArt {
  src: string;
  alt: string;
  isPlaceholder: boolean;
}

export const MUMO_ART = {
  vesely: { src: mumoHappy, alt: "MUMO stojí a usmieva sa", isPlaceholder: true },
  hladny: { src: mumoHungry, alt: "MUMO je hladný", isPlaceholder: true },
  spinavy: { src: mumoDirty, alt: "MUMO má strapatú srsť", isPlaceholder: true },
  unaveny: { src: mumoHappy, alt: "MUMO je unavený", isPlaceholder: true },
  smutny: { src: mumoHungry, alt: "MUMO sa chce hrať", isPlaceholder: true },
  spanok: { src: mumoSleeping, alt: "MUMO spinká pod dekou", isPlaceholder: true },
  hra: { src: mumoPlay, alt: "MUMO skáče od radosti", isPlaceholder: true },
  kupel: { src: mumoBath, alt: "MUMO sa kúpe v bublinkách", isPlaceholder: true },
  skola: { src: mumoSchool, alt: "MUMO je pripravený do školy", isPlaceholder: true },
} as const satisfies Record<string, MumoArt>;

export const LULU_ART: MumoArt = {
  src: luluImg,
  alt: "LULU, zajačia kamarátka",
  isPlaceholder: true,
};

export const artForMood = (mood: Mood): MumoArt => MUMO_ART[mood];

import foodJablko from "@/assets/food-jablko.png";
import foodKasa from "@/assets/food-kasa.png";
import foodMrkva from "@/assets/food-mrkva.png";
import foodBanan from "@/assets/food-banan.png";
import foodJahoda from "@/assets/food-jahoda.png";
import foodChlieb from "@/assets/food-chlieb.png";
import foodSyr from "@/assets/food-syr.png";
import foodMed from "@/assets/food-med.png";
import foodMlieko from "@/assets/food-mlieko.png";

export const FOOD_ART: Record<string, MumoArt> = {
  jablko: { src: foodJablko, alt: "Jablko", isPlaceholder: true },
  kasa: { src: foodKasa, alt: "Kaša", isPlaceholder: true },
  mrkva: { src: foodMrkva, alt: "Mrkva", isPlaceholder: true },
  banan: { src: foodBanan, alt: "Banán", isPlaceholder: true },
  jahoda: { src: foodJahoda, alt: "Jahoda", isPlaceholder: true },
  chlieb: { src: foodChlieb, alt: "Rožok", isPlaceholder: true },
  syr: { src: foodSyr, alt: "Syr", isPlaceholder: true },
  med: { src: foodMed, alt: "Med", isPlaceholder: true },
  mlieko: { src: foodMlieko, alt: "Mlieko", isPlaceholder: true },
};


import iconFood from "@/assets/icon-food.png";
import iconBath from "@/assets/icon-bath.png";
import iconSleep from "@/assets/icon-sleep.png";
import iconPlay from "@/assets/icon-play.png";

/** Illustrated icons for the large action buttons (no emoji in the child UI). */
export const ACTION_ART = {
  food: { src: iconFood, alt: "Jedlo", isPlaceholder: true },
  bath: { src: iconBath, alt: "Kúpeľ", isPlaceholder: true },
  sleep: { src: iconSleep, alt: "Spánok", isPlaceholder: true },
  play: { src: iconPlay, alt: "Hranie", isPlaceholder: true },
} as const satisfies Record<string, MumoArt>;

import iconTrampolina from "@/assets/icon-trampolina.png";
import iconSkola from "@/assets/icon-skola.png";
import iconIhrisko from "@/assets/icon-ihrisko.png";

/** Illustrated icons for the daily activity choices. */
export const ACTIVITY_ART = {
  trampolina: { src: iconTrampolina, alt: "Trampolína", isPlaceholder: true },
  skola: { src: iconSkola, alt: "Škola", isPlaceholder: true },
  ihrisko: { src: iconIhrisko, alt: "Ihrisko", isPlaceholder: true },
} as const satisfies Record<string, MumoArt>;
