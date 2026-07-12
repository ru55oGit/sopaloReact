export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface DayMeta {
  key: DayKey;
  label: string;
  shortLabel: string;
}

export const ROUNDS_PER_DAY = 7;

export type RoundResult = "pending" | "success";
export type DayProgressStatus = "not_started" | "in_progress" | "completed";

export interface DaySopaloState {
  status: DayProgressStatus;
  currentRoundIndex: number;
  results: RoundResult[]; // length ROUNDS_PER_DAY
  updatedAt: string;
}

interface WeeklySopaloState {
  days: Partial<Record<DayKey, DaySopaloState>>;
}

const STORAGE_KEY_PREFIX = "sopalo_week_state_v1";

export const WEEK_DAYS: DayMeta[] = [
  { key: "sun", label: "Domingo", shortLabel: "Dom" },
  { key: "mon", label: "Lunes", shortLabel: "Lun" },
  { key: "tue", label: "Martes", shortLabel: "Mar" },
  { key: "wed", label: "Miércoles", shortLabel: "Mié" },
  { key: "thu", label: "Jueves", shortLabel: "Jue" },
  { key: "fri", label: "Viernes", shortLabel: "Vie" },
  { key: "sat", label: "Sábado", shortLabel: "Sab" },
];

export const getCurrentDayKey = (referenceDate = new Date()): DayKey => {
  return WEEK_DAYS[referenceDate.getDay()].key;
};

export const isDayAvailable = (dayKey: DayKey, referenceDate = new Date()): boolean => {
  const targetIndex = WEEK_DAYS.findIndex((day) => day.key === dayKey);
  return targetIndex >= 0 && targetIndex <= referenceDate.getDay();
};

export const isDayKey = (value: string | null): value is DayKey => {
  return WEEK_DAYS.some((day) => day.key === value);
};

export const getDayMeta = (dayKey: DayKey): DayMeta => {
  return WEEK_DAYS.find((day) => day.key === dayKey) ?? WEEK_DAYS[0];
};

const buildEmptyDayState = (): DaySopaloState => ({
  status: "not_started",
  currentRoundIndex: 0,
  results: Array.from({ length: ROUNDS_PER_DAY }, () => "pending"),
  updatedAt: new Date().toISOString(),
});

const buildEmptyWeekState = (): WeeklySopaloState => ({ days: {} });

const getStorageKey = (scopeKey: string): string => `${STORAGE_KEY_PREFIX}:${scopeKey}`;

export const deriveStatus = (results: RoundResult[]): DayProgressStatus => {
  const unresolvedCount = results.filter((r) => r === "pending").length;
  if (unresolvedCount === 0) return "completed";
  if (unresolvedCount < results.length) return "in_progress";
  return "not_started";
};

export const getWeeklyState = (scopeKey = "default"): WeeklySopaloState => {
  if (typeof window === "undefined") return buildEmptyWeekState();

  const raw = window.localStorage.getItem(getStorageKey(scopeKey));
  if (!raw) return buildEmptyWeekState();

  try {
    const parsed = JSON.parse(raw) as WeeklySopaloState;
    if (!parsed || typeof parsed !== "object") return buildEmptyWeekState();

    const safeDays: Partial<Record<DayKey, DaySopaloState>> = {};
    for (const day of WEEK_DAYS) {
      const dayState = parsed.days?.[day.key];
      if (!dayState) continue;
      if (
        !Array.isArray(dayState.results) ||
        dayState.results.length !== ROUNDS_PER_DAY ||
        dayState.currentRoundIndex < 0 ||
        dayState.currentRoundIndex >= ROUNDS_PER_DAY
      ) {
        continue;
      }

      safeDays[day.key] = {
        ...dayState,
        status: deriveStatus(dayState.results),
      };
    }

    return { days: safeDays };
  } catch {
    return buildEmptyWeekState();
  }
};

export const getDayState = (dayKey: DayKey, scopeKey = "default"): DaySopaloState => {
  const weekState = getWeeklyState(scopeKey);
  return weekState.days[dayKey] ?? buildEmptyDayState();
};

export const saveDayState = (
  dayKey: DayKey,
  value: Omit<DaySopaloState, "status" | "updatedAt">,
  scopeKey = "default"
): void => {
  if (typeof window === "undefined") return;

  const weekState = getWeeklyState(scopeKey);
  const nextDayState: DaySopaloState = {
    ...value,
    status: deriveStatus(value.results),
    updatedAt: new Date().toISOString(),
  };

  const nextState: WeeklySopaloState = {
    ...weekState,
    days: { ...weekState.days, [dayKey]: nextDayState },
  };

  window.localStorage.setItem(getStorageKey(scopeKey), JSON.stringify(nextState));
};

export const getSopaloStatusLabel = (
  dayState: DaySopaloState,
  labels = { completed: "Completado", inProgress: "En progreso", notStarted: "Sin jugar" }
): string => {
  const successCount = dayState.results.filter((r) => r === "success").length;
  if (dayState.status === "completed") return `${labels.completed} ${successCount}/${ROUNDS_PER_DAY}`;
  if (dayState.status === "in_progress") return `${labels.inProgress} ${successCount}/${ROUNDS_PER_DAY}`;
  return labels.notStarted;
};
