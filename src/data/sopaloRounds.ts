import { getActiveRoscoContext, getBonusSetForDay, RoscoEntry } from "./weeklyRoscos";
import { DayKey, ROUNDS_PER_DAY, WEEK_DAYS } from "../utils/weeklyRoscoState";

export interface SopaloRound {
  defWord: string;
  defClue: string;
  emojiWord: string;
  emojiClue: string;
}

export interface SopaloDayContext {
  dayKey: DayKey;
  scopeKey: string;
  rounds: SopaloRound[]; // length ROUNDS_PER_DAY
}

// Para que toda palabra entre cómoda en la grilla (incluida la diagonal),
// nos quedamos con las más cortas de las 26 disponibles por día/set.
function pickGridSafeEntries(entries: RoscoEntry[], count: number): RoscoEntry[] {
  return [...entries]
    .filter((e) => e.word.trim().length >= 3)
    .sort((a, b) => a.word.trim().length - b.word.trim().length)
    .slice(0, count);
}

export function getSopaloDayContext(
  dayKey: DayKey,
  referenceDate = new Date(),
  language = "es"
): SopaloDayContext {
  const roscoContext = getActiveRoscoContext(referenceDate, language);
  const dayIndex = WEEK_DAYS.findIndex((d) => d.key === dayKey);
  const emojiSet = getBonusSetForDay(dayIndex, referenceDate, language);

  const defEntries = pickGridSafeEntries(roscoContext.roscos[dayKey], ROUNDS_PER_DAY);
  const emojiEntries = pickGridSafeEntries(emojiSet, ROUNDS_PER_DAY);

  const rounds: SopaloRound[] = Array.from({ length: ROUNDS_PER_DAY }, (_, i) => ({
    defWord: (defEntries[i] ?? defEntries[0]).word,
    defClue: (defEntries[i] ?? defEntries[0]).definition,
    emojiWord: (emojiEntries[i] ?? emojiEntries[0]).word,
    emojiClue: (emojiEntries[i] ?? emojiEntries[0]).definition,
  }));

  return {
    dayKey,
    scopeKey: `${roscoContext.scopeKey}:${dayKey}`,
    rounds,
  };
}
