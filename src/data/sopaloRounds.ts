import { getActiveRoscoContext, getBonusSetForDay, RoscoEntry } from "./weeklyRoscos";
import { DayKey, ROUNDS_PER_DAY, WEEK_DAYS } from "../utils/weeklyRoscoState";

export interface SopaloRound {
  defWord: string;
  defClue: string;
  defWord2: string;
  defClue2: string;
  defWord3: string;
  defClue3: string;
  defWord4: string;
  defClue4: string;
  emojiWord: string;
  emojiClue: string;
}

export interface SopaloDayContext {
  dayKey: DayKey;
  scopeKey: string;
  rounds: SopaloRound[]; // length ROUNDS_PER_DAY
}

// Ordenamos por longitud (más cortas primero) para que, dentro de lo posible,
// las palabras entren cómodas en la grilla (incluida la diagonal).
function pickGridSafeEntries(entries: RoscoEntry[]): RoscoEntry[] {
  return [...entries]
    .filter((e) => e.word.trim().length >= 3)
    .sort((a, b) => a.word.trim().length - b.word.trim().length);
}

// 4 definiciones por nivel: el rosco del día solo tiene 26 palabras (una por
// letra), así que con 7 niveles no alcanza para 28 palabras sin repetir en
// TODO el día. Indexamos en rueda (módulo) para garantizar que las 4 del
// MISMO nivel sean siempre distintas entre sí; una repetición ocasional
// entre niveles distintos del mismo día es un costo aceptable.
const DEF_SLOTS_PER_ROUND = 4;

export function getSopaloDayContext(
  dayKey: DayKey,
  referenceDate = new Date(),
  language = "es"
): SopaloDayContext {
  const roscoContext = getActiveRoscoContext(referenceDate, language);
  const dayIndex = WEEK_DAYS.findIndex((d) => d.key === dayKey);
  const emojiSet = getBonusSetForDay(dayIndex, referenceDate, language);

  const defPool = pickGridSafeEntries(roscoContext.roscos[dayKey]);
  const emojiPool = pickGridSafeEntries(emojiSet);

  const pickDef = (roundIndex: number, slot: number) =>
    defPool[(roundIndex + slot * ROUNDS_PER_DAY) % defPool.length];
  const pickEmoji = (roundIndex: number) => emojiPool[roundIndex % emojiPool.length];

  const rounds: SopaloRound[] = Array.from({ length: ROUNDS_PER_DAY }, (_, i) => {
    const [d1, d2, d3, d4] = Array.from({ length: DEF_SLOTS_PER_ROUND }, (_, slot) => pickDef(i, slot));
    const emoji = pickEmoji(i);
    return {
      defWord: d1.word,
      defClue: d1.definition,
      defWord2: d2.word,
      defClue2: d2.definition,
      defWord3: d3.word,
      defClue3: d3.definition,
      defWord4: d4.word,
      defClue4: d4.definition,
      emojiWord: emoji.word,
      emojiClue: emoji.definition,
    };
  });

  return {
    dayKey,
    scopeKey: `${roscoContext.scopeKey}:${dayKey}`,
    rounds,
  };
}
