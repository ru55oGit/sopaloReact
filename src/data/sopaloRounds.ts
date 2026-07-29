import { ComponentType } from "react";
import { getActiveRoscoContext } from "./weeklyRoscos";
import { getImaginaloRoundClues, ImageCategoryKey } from "./imaginaloRounds";
import { getEmojinaloRoundClues, EmojinaloCategoryKey } from "./emojinaloRounds";
import { getFamososRoundClues, FamososCategoryKey } from "./famososRounds";
import { getPreguntasRoundClues } from "./preguntasRounds";
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
  photo?: string;
  hideBlanks?: boolean;
}

export type RoundKind = "images" | "emojinalo" | "famosos" | "preguntas";

export interface SopaloRound {
  kind: RoundKind;
  clues: RoundClue[];
}

export interface SopaloDayContext {
  dayKey: DayKey;
  scopeKey: string;
  rounds: SopaloRound[]; // length ROUNDS_PER_DAY
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

function buildEmojinaloRound(
  dayIndex: number,
  referenceDate: Date,
  language: string,
  emojinaloLabels: Record<EmojinaloCategoryKey, string>
): SopaloRound {
  const emojinaloClues = getEmojinaloRoundClues(dayIndex, referenceDate, language);
  return {
    kind: "emojinalo",
    clues: emojinaloClues.map((c) => ({
      label: emojinaloLabels[c.category],
      words: c.words,
      emoji: c.emoji,
    })),
  };
}

function buildFamososRound(
  dayIndex: number,
  referenceDate: Date,
  famososLabels: Record<FamososCategoryKey, string>
): SopaloRound {
  const famososClues = getFamososRoundClues(dayIndex, referenceDate);
  return {
    kind: "famosos",
    clues: famososClues.map((c) => ({
      label: famososLabels[c.category],
      words: c.words,
      photo: c.photo,
    })),
  };
}

function buildPreguntasRound(
  dayIndex: number,
  referenceDate: Date,
  questionLabel: string
): SopaloRound {
  const preguntasClues = getPreguntasRoundClues(dayIndex, referenceDate);
  return {
    kind: "preguntas",
    clues: preguntasClues.map((c) => ({
      label: questionLabel,
      words: c.words,
      text: c.text,
      hideBlanks: true,
    })),
  };
}

export function getSopaloDayContext(
  dayKey: DayKey,
  referenceDate = new Date(),
  language = "es",
  categoryLabels: Record<ImageCategoryKey, string> = { funkos: "Funkos", escudos: "Escudos", sombras: "Sombras", logos: "Logos" },
  emojinaloLabels: Record<EmojinaloCategoryKey, string> = { country: "País", capital: "Capital", whatis: "Qué es", movie: "Película", series: "Serie" },
  famososLabels: Record<FamososCategoryKey, string> = { famosos: "Famosos", personajes: "Personajes" },
  questionLabel = "Pregunta"
): SopaloDayContext {
  const roscoContext = getActiveRoscoContext(referenceDate, language);
  const dayIndex = WEEK_DAYS.findIndex((d) => d.key === dayKey);

  const rounds: SopaloRound[] = Array.from({ length: ROUNDS_PER_DAY }, (_, i) => {
    if (i === 0) {
      return buildImagesRound(dayIndex, referenceDate, language, categoryLabels);
    }
    if (i === 1) {
      return buildEmojinaloRound(dayIndex, referenceDate, language, emojinaloLabels);
    }
    if (i === 2) {
      return buildFamososRound(dayIndex, referenceDate, famososLabels);
    }
    return buildPreguntasRound(dayIndex, referenceDate, questionLabel);
  });

  return {
    dayKey,
    scopeKey: `${roscoContext.scopeKey}:${dayKey}`,
    rounds,
  };
}
