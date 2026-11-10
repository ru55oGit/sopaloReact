export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface DayMeta {
  key: DayKey;
  label: string;
  shortLabel: string;
}

export const LEVELS_PER_DAY = 5;
// Pistas por posición del carrousel: 1 imagen/emoji de 2 fuentes + 1 pregunta.
export const CLUES_PER_LEVEL = 3;

export type DayProgressStatus = "not_started" | "in_progress" | "completed";

// Estado de UNA posición del carrousel: qué palabras (normalizadas) ya se
// encontraron en la grilla compartida de ese nivel, y si se usó el botón de
// "ver anuncio para descubrir las palabras" (revela las 3 pistas del nivel
// a la vez, no una por una).
export interface LevelState {
  foundWords: string[];
  revealed: boolean;
}

export interface DaySopaloState {
  status: DayProgressStatus;
  // Última posición del carrousel que el jugador miró — no es un puntero de
  // avance lineal (se puede navegar libremente a cualquier posición), solo
  // dónde retomar al volver a entrar.
  currentLevelIndex: number;
  levels: LevelState[]; // length LEVELS_PER_DAY
  updatedAt: string;
}

interface WeeklySopaloState {
  days: Partial<Record<DayKey, DaySopaloState>>;
}

// v2: el modelo anterior (una ronda por bloque de categoría, con resultado
// pending/success y sin progreso de palabras persistido) se reemplaza por 5
// posiciones de carrousel con progreso real por palabra — el shape vieja no
// es compatible, de ahí el bump de versión.
const STORAGE_KEY_PREFIX = "sopalo_week_state_v2";

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

const buildEmptyLevelState = (): LevelState => ({ foundWords: [], revealed: false });

const buildEmptyDayState = (): DaySopaloState => ({
  status: "not_started",
  currentLevelIndex: 0,
  levels: Array.from({ length: LEVELS_PER_DAY }, buildEmptyLevelState),
  updatedAt: new Date().toISOString(),
});

const buildEmptyWeekState = (): WeeklySopaloState => ({ days: {} });

const getStorageKey = (scopeKey: string): string => `${STORAGE_KEY_PREFIX}:${scopeKey}`;

// El status real ("completed" = las 5 posiciones resueltas) depende de
// cuántas palabras tiene cada nivel, algo que vive en sopaloRounds.ts (no
// acá) — por eso completedCount/total se calculan afuera (ver
// countCompletedLevels en sopaloRounds.ts) y acá solo se deriva el status a
// partir de ese conteo ya resuelto.
export const deriveStatus = (completedCount: number, total: number): DayProgressStatus => {
  if (completedCount >= total) return "completed";
  if (completedCount > 0) return "in_progress";
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
        !Array.isArray(dayState.levels) ||
        dayState.levels.length !== LEVELS_PER_DAY ||
        !dayState.levels.every((l) => l && Array.isArray(l.foundWords) && typeof l.revealed === "boolean") ||
        typeof dayState.currentLevelIndex !== "number" ||
        dayState.currentLevelIndex < 0 ||
        dayState.currentLevelIndex >= LEVELS_PER_DAY
      ) {
        continue;
      }

      safeDays[day.key] = dayState;
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
  value: Omit<DaySopaloState, "status" | "updatedAt"> & { status: DayProgressStatus },
  scopeKey = "default"
): void => {
  if (typeof window === "undefined") return;

  const weekState = getWeeklyState(scopeKey);
  const nextDayState: DaySopaloState = { ...value, updatedAt: new Date().toISOString() };

  const nextState: WeeklySopaloState = {
    ...weekState,
    days: { ...weekState.days, [dayKey]: nextDayState },
  };

  window.localStorage.setItem(getStorageKey(scopeKey), JSON.stringify(nextState));
};

export const getSopaloStatusLabel = (
  status: DayProgressStatus,
  completedCount: number,
  total: number,
  labels = { completed: "Completado", inProgress: "En progreso", notStarted: "Sin jugar" }
): string => {
  if (status === "completed") return `${labels.completed} ${completedCount}/${total}`;
  if (status === "in_progress") return `${labels.inProgress} ${completedCount}/${total}`;
  return labels.notStarted;
};
