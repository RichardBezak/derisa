import type { ActivityType, Needs } from "./types";

/** Small helper for picking one prepared line from a data list. */
export const pickRandom = <T,>(list: readonly T[]): T =>
  list[Math.floor(Math.random() * list.length)] as T;

/** All prototype tuning constants live here so they are easy to change. */
export const MUMO_TUNING = {
  schemaVersion: 1,
  storageKey: "mumo.state.v1",
  decayPerHourAwake: {
    satiety: 2,
    cleanliness: 0.8,
    energy: 1.5,
    joy: 0.75,
  },
  decayPerHourSleeping: {
    satiety: 0.75,
    cleanliness: 0.8,
    energy: -8, // negative decay = restoration
    joy: 0.75,
  },
  needs: {
    startingValues: { satiety: 80, cleanliness: 80, energy: 80, joy: 80 } as Needs,
    lowThreshold: 50,
  },
  petting: {
    joyGain: 3,
    cooldownMs: 4000,
  },
  washing: {
    bubblesNeeded: 6,
    brushesNeeded: 4,
    /** Pixels the brush must travel across MUMO before he is clean. */
    brushDistanceNeeded: 900,
    cleanlinessGain: 45,
  },

  trampoline: {
    durationMs: 20000,
    joyGain: 18,
    energyCost: 6,
  },
  playground: {
    passesNeeded: 6,
    joyGain: 15,
    energyCost: 5,
  },
  seesaw: {
    rocksNeeded: 6,
    joyGain: 15,
    energyCost: 5,
  },
  slide: {
    slidesNeeded: 5,
    joyGain: 14,
    energyCost: 4,
  },
  school: {
    durationMs: 30 * 60 * 1000,
    joyGain: 10,
  },
  sing: {
    /** Recording is capped for small children; it stays only in memory. */
    maxDurationMs: 20000,
    joyGain: 8,
  },
  absence: {
    /** Longer than this away → warm welcome-back message first. */
    welcomeBackAfterMs: 4 * 60 * 60 * 1000,
  },
  night: {
    startHour: 19,
    endHour: 7,
  },
  /** Every screen reads day/night, school hours and outdoor play from here. */
  time: {
    dayStartHour: 7,
    /** Last daylight hour: 18:00 onwards is evening/night. */
    dayEndHour: 17,
    schoolOpenMinute: 7 * 60,
    /** School lasts 30 minutes, so the last departure is 17:29. */
    schoolLastEntryMinute: 17 * 60 + 29,
  },
} as const;

export const FOODS = [
  { id: "jablko", label: "Jablko", satietyGain: 22, emojiFallback: "🍎" },
  { id: "mrkva", label: "Mrkva", satietyGain: 16, emojiFallback: "🥕" },
  { id: "kasa", label: "Kaša", satietyGain: 30, emojiFallback: "🥣" },
  { id: "banan", label: "Banán", satietyGain: 20, emojiFallback: "🍌" },
  { id: "jahoda", label: "Jahoda", satietyGain: 12, emojiFallback: "🍓" },
  { id: "chlieb", label: "Rožok", satietyGain: 24, emojiFallback: "🥖" },
  { id: "syr", label: "Syr", satietyGain: 18, emojiFallback: "🧀" },
  { id: "med", label: "Med", satietyGain: 26, emojiFallback: "🍯" },
  { id: "mlieko", label: "Mlieko", satietyGain: 14, emojiFallback: "🥛" },
] as const;


export type FoodId = (typeof FOODS)[number]["id"];

export const MESSAGES = {
  welcomeBack: "Teším sa, že si zase tu!",
  greeting: ["Ahoj!", "Si tu! Hurá!", "Mal som ťa rád celý deň."],
  hungry: ["Škvŕka mi v brušku.", "Dal by som si niečo dobré."],
  dirty: ["Mám strapatú srsť.", "Potrebujem kúpeľ.", "Som trochu špinavý."],
  tired: ["Klipkajú mi očká.", "Chcel by som spinkať."],
  sad: ["Chcem sa trochu hrať.", "Zahráme sa spolu?"],
  happy: ["Je mi super!", "Mám sa krásne.", "Dnes je pekný deň."],
  sleeping: ["Pssst... spinkám.", "Chrr... chrr..."],
  eating: ["Mňam, to bolo dobré!", "Ďakujem, už mi je lepšie!", "To mi chutilo!"],
  washed: ["Som čistý ako rybička!", "Voňavý MUMO!", "Bublinky ma šteklili!"],
  woke: ["Dobré ráno!", "Už som vyspatý!"],
  petted: ["To bolo príjemné.", "Mám ťa rád!", "Ešte poškrab!"],
  trampolineEnd: ["To bol skok!", "Ešte sa mi krúti bruško!", "To bola zábava!"],
  playgroundEnd: ["LULU je super kamarátka!", "Hrali sme sa s loptou!"],
  seesawEnd: ["S LULU sme sa pekne hojdali!", "Hore a dolu! To bola zábava!"],
  slideEnd: ["Šmykľavka bola veselá!", "Fíha, to bola jazda!", "Ešte sa usmievam!"],
  singEnd: ["To bola pesnička!", "Spievame spolu krásne!", "Ešte raz to zopakujem!"],
  schoolActive: "MUMO je v škole.",
} as const;

export const SCHOOL_STORIES = [
  "Dnes sme v škole maľovali dúhu.",
  "MUMO požičal kamarátovi pastelku.",
  "Našiel som písmeno M ako MUMO!",
  "Naučil som sa nové písmeno.",
  "Počítali sme jabĺčka.",
  "Čítali sme si príbeh.",
  "Nakreslil som obrázok pre teba.",
] as const;

/** Short situations shown while the child is visiting the classroom. */
export const SCHOOL_MOMENTS = [
  "Sedím v lavici a mám pripravené pastelky.",
  "Na tabuli je veľké písmeno M.",
  "Práve kreslíme dúhu.",
  "Počítame jabĺčka na obrázku.",
  "Pani učiteľka nám číta príbeh.",
] as const;

/** Letters the teacher chalks onto the little board for every school visit. */
export const SCHOOL_LETTERS = [
  "A", "B", "E", "H", "I", "K", "M", "O", "P", "R", "S", "T", "U", "V", "Z",
] as const;

/** Three distinct random letters for one school visit. */
export function pickSchoolLetters(count = 3): string[] {
  const pool = [...SCHOOL_LETTERS];
  const out: string[] = [];
  while (out.length < count && pool.length > 0) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]!);
  }
  return out;
}

/** Daytime events may mention school and outdoor play. */
export const DAILY_EVENTS = [
  { id: "lopta", message: "LULU dnes priniesla červenú loptu.", decor: "lopta" },
  { id: "trampolina", message: "MUMO chce dnes vyskočiť na trampolíne veľmi vysoko.", decor: "trampolina" },
  { id: "motyl", message: "V izbičke pristál motýľ.", decor: "motyl" },
  { id: "list", message: "MUMO našiel žltý list.", decor: "list" },
  { id: "dazd", message: "Vonku ticho prší, v izbičke je teplo.", decor: "dazd" },
  { id: "kvet", message: "Na okne rozkvitol malý kvet.", decor: "kvet" },
  { id: "jablko", message: "MUMO sa dnes teší na chrumkavé jablko.", decor: "jablko" },
  { id: "pesnicka", message: "MUMO si dnes vymyslel pesničku.", decor: "pesnicka" },
  { id: "kamarat", message: "MUMO sa dnes chce hrať s kamarátkou LULU.", decor: "lopta" },
] as const;

/** Night events stay calm: no school, no trampoline, no playground. */
export const NIGHT_EVENTS = [
  { id: "rozpravka", message: "MUMO sa teší na rozprávku pred spaním.", decor: "hviezda" },
  { id: "ospaly", message: "MUMO začína byť ospalý.", decor: "hviezda" },
  { id: "pritulit", message: "MUMO by sa ešte rád pritúlil.", decor: "hviezda" },
  { id: "uspavanka", message: "MUMO si chce pred spaním zaspievať.", decor: "pesnicka" },
  { id: "mesiac", message: "MUMO pozerá z okna na mesiac.", decor: "hviezda" },
  { id: "hviezda", message: "MUMO videl v noci padajúcu hviezdu.", decor: "hviezda" },
] as const;

export const ACTIVITIES: {
  id: ActivityType;
  label: string;
  repeatable: boolean;
  timed: boolean;
}[] = [
  { id: "trampolina", label: "Trampolína", repeatable: true, timed: false },
  { id: "skola", label: "Škola", repeatable: false, timed: true },
  { id: "ihrisko", label: "Ihrisko", repeatable: true, timed: false },
  { id: "hojdacka", label: "Hojdačka", repeatable: true, timed: false },
  { id: "smyklavka", label: "Šmykľavka", repeatable: true, timed: false },
];
