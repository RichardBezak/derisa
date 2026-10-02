export interface Needs {
  satiety: number;
  cleanliness: number;
  energy: number;
  joy: number;
}

export type NeedKey = keyof Needs;

export type ActivityType = "trampolina" | "skola" | "ihrisko" | "hojdacka" | "smyklavka";

export interface TimedActivity {
  activityType: ActivityType;
  startedAt: number;
  endsAt: number;
  status: "active" | "resolved";
}

export interface ActivityHistoryEntry {
  activityType: ActivityType;
  finishedAt: number;
  story?: string;
}

export interface PendingActivityResult {
  type: "school";
  text: string;
  acknowledged: boolean;
}

export interface DayEvent {
  date: string; // YYYY-MM-DD local
  eventId: string;
}

export interface GameState {
  schemaVersion: number;
  bearName: string;
  onboardingDone: boolean;
  needs: Needs;
  lastUpdatedAt: number;
  sleeping: boolean;
  sleepStartedAt: number | null;
  activity: TimedActivity | null;
  pendingActivityResult: PendingActivityResult | null;
  history: ActivityHistoryEntry[];
  dayEvent: DayEvent | null;
  soundOn: boolean;
  /** Updated only when the app is opened/becomes active — drives the welcome-back message. */
  lastOpenedAt: number;
  /** Test-panel only: shifts the simulated clock. */
  timeOffsetMs: number;
}

export type Mood = "spanok" | "hladny" | "spinavy" | "unaveny" | "smutny" | "vesely";
