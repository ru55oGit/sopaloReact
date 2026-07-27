import { ComponentType } from "react";
import { getActiveRoscoContext, getBonusSetForDay, RoscoEntry } from "./weeklyRoscos";
import { getImaginaloRoundClues, ImageCategoryKey } from "./imaginaloRounds";
import { DayKey, ROUNDS_PER_DAY, WEEK_DAYS } from "../utils/weeklyRoscoState";

// Cada ronda del día es un conjunto de "pistas" (clues). Cada pista puede
// pedir 1 o más palabras (una respuesta multi-palabra como "The New York
// Times" se busca como 4 palabras sueltas en la misma grilla, todas bajo
// la misma pista/imagen). El total de palabras a encontrar en la ronda ya
// no es un número fijo: es la suma de palabras de todas sus pistas.
export interface RoundClue {
  label: string;
  words: string[];
  image?: { category: ImageCategoryKey; loader: () => Promise<{ default: ComponentType }> };
  emoji?: string;
  text?: string;
}

export type RoundKind = "images" | "legacy";

export interface SopaloRound {
  kind: RoundKind;
  clues: RoundClue[];
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
// letra), así que con varios niveles no alcanza para todas sin repetir en
// TODO el día. Indexamos en rueda (módulo) para garantizar que las 4 del
// MISMO nivel sean siempre distintas entre sí; una repetición ocasional
// entre niveles distintos del mismo día es un costo aceptable.
const DEF_SLOTS_PER_ROUND = 4;

function buildLegacyRound(
  roundIndex: number,
  defPool: RoscoEntry[],
  emojiPool: RoscoEntry[],
  definitionLabel: string,
  emojiLabel: string
): SopaloRound {
  const pickDef = (slot: number) => defPool[(roundIndex + slot * ROUNDS_PER_DAY) % defPool.length];
  const emoji = emojiPool[roundIndex % emojiPool.length];

  const defClues: RoundClue[] = Array.from({ length: DEF_SLOTS_PER_ROUND }, (_, slot) => {
    const entry = pickDef(slot);
    return { label: definitionLabel, words: [entry.word], text: entry.definition };
  });

  return {
    kind: "legacy",
    clues: [
      ...defClues,
      { label: emojiLabel, words: [emoji.word], emoji: emoji.definition },
    ],
  };
}

function buildImagesRound(
  dayIndex: number,
  referenceDate: Date,
  language: string,
  categoryLabels: Record<ImageCategoryKey, string>
): SopaloRound {
  const imaginaloClues = getImaginaloRoundClues(dayIndex, referenceDate, language);
  return {
    kind: "images",
    clues: imaginaloClues.map((c) => ({
      label: categoryLabels[c.category],
      words: c.words,
      image: { category: c.category, loader: c.loader },
    })),
  };
}

export function getSopaloDayContext(
  dayKey: DayKey,
  referenceDate = new Date(),
  language = "es",
  categoryLabels: Record<ImageCategoryKey, string> = { funkos: "Funkos", escudos: "Escudos", sombras: "Sombras", logos: "Logos" },
  definitionLabel = "Definición",
  emojiLabel = "Emoji"
): SopaloDayContext {
  const roscoContext = getActiveRoscoContext(referenceDate, language);
  const dayIndex = WEEK_DAYS.findIndex((d) => d.key === dayKey);
  const emojiSet = getBonusSetForDay(dayIndex, referenceDate, language);

  const defPool = pickGridSafeEntries(roscoContext.roscos[dayKey]);
  const emojiPool = pickGridSafeEntries(emojiSet);

  const rounds: SopaloRound[] = Array.from({ length: ROUNDS_PER_DAY }, (_, i) => {
    if (i === 0) {
      return buildImagesRound(dayIndex, referenceDate, language, categoryLabels);
    }
    return buildLegacyRound(i, defPool, emojiPool, definitionLabel, emojiLabel);
  });

  return {
    dayKey,
    scopeKey: `${roscoContext.scopeKey}:${dayKey}`,
    rounds,
  };
}
