import { ComponentType } from "react";
import { getActiveRoscoContext } from "./weeklyRoscos";
import { getImaginaloRoundClues, ImageCategoryKey, ImaginaloClue } from "./imaginaloRounds";
import { getEmojinaloRoundClues, EmojinaloCategoryKey, EmojinaloClue } from "./emojinaloRounds";
import { getFrutasRoundClues, FrutasCategoryKey, FrutasClue } from "./frutasRounds";
import { getPreguntasRoundClues, PreguntaClue } from "./preguntasRounds";
import { DayKey, LEVELS_PER_DAY, LevelState, WEEK_DAYS } from "../utils/weeklyRoscoState";
import { normalizeForGrid } from "../utils/wordSearchGrid";

// Cada pista puede pedir 1 o más palabras (una respuesta multi-palabra como
// "The New York Times" se busca como 4 palabras sueltas en la misma grilla,
// todas bajo la misma pista/imagen).
export interface RoundClue {
  label: string;
  words: string[];
  image?: { category: ImageCategoryKey; loader: () => Promise<{ default: ComponentType }> };
  emoji?: string;
  text?: string;
  photo?: string;
  hideBlanks?: boolean;
}

// Cada posición del carrousel tiene exactamente 3 pistas, combinando una
// imagen/emoji de 2 fuentes distintas + 1 pregunta de trivia — ver el
// mapeo fijo en LEVEL_RECIPE más abajo (pedido explícito del usuario, no
// una distribución genérica).
export interface SopaloRound {
  clues: RoundClue[];
}

export interface SopaloDayContext {
  dayKey: DayKey;
  scopeKey: string;
  levels: SopaloRound[]; // length LEVELS_PER_DAY
}

function imageClue(
  clue: ImaginaloClue,
  categoryLabels: Record<ImageCategoryKey, string>
): RoundClue {
  return { label: categoryLabels[clue.category], words: clue.words, image: { category: clue.category, loader: clue.loader } };
}

function emojiClue(
  clue: EmojinaloClue,
  emojinaloLabels: Record<EmojinaloCategoryKey, string>
): RoundClue {
  return { label: emojinaloLabels[clue.category], words: clue.words, emoji: clue.emoji };
}

function frutasClue(
  clue: FrutasClue,
  frutasLabels: Record<FrutasCategoryKey, string>
): RoundClue {
  return { label: frutasLabels[clue.category], words: clue.words, photo: clue.photo };
}

function preguntaClue(clue: PreguntaClue, questionLabel: string): RoundClue {
  return { label: questionLabel, words: clue.words, text: clue.text, hideBlanks: true };
}

export function getSopaloDayContext(
  dayKey: DayKey,
  referenceDate = new Date(),
  language = "es",
  categoryLabels: Record<ImageCategoryKey, string> = { funkos: "Funkos", escudos: "Escudos", sombras: "Sombras", logos: "Logos" },
  emojinaloLabels: Record<EmojinaloCategoryKey, string> = { country: "País", capital: "Capital", whatis: "Qué es", movie: "Película", series: "Serie" },
  frutasLabels: Record<FrutasCategoryKey, string> = { frutas: "Frutas y Vegetales", animales: "Animales" },
  questionLabel = "Pregunta"
): SopaloDayContext {
  const roscoContext = getActiveRoscoContext(referenceDate, language);
  const dayIndex = WEEK_DAYS.findIndex((d) => d.key === dayKey);

  const imaginalo = getImaginaloRoundClues(dayIndex, referenceDate, language);
  const emojinalo = getEmojinaloRoundClues(dayIndex, referenceDate, language);
  const frutas = getFrutasRoundClues(dayIndex, referenceDate, language);
  const preguntas = getPreguntasRoundClues(dayIndex, referenceDate, language);

  const funkos = imaginalo.find((c) => c.category === "funkos")!;
  const sombras = imaginalo.find((c) => c.category === "sombras")!;
  const escudos = imaginalo.find((c) => c.category === "escudos")!;
  const logos = imaginalo.find((c) => c.category === "logos")!;
  const country = emojinalo.find((c) => c.category === "country")!;
  const capital = emojinalo.find((c) => c.category === "capital")!;
  const whatis = emojinalo.find((c) => c.category === "whatis")!;
  const movieOrSeries = emojinalo.find((c) => c.category === "movie" || c.category === "series")!;
  const fruta = frutas.find((c) => c.category === "frutas")!;
  const animal = frutas.find((c) => c.category === "animales")!;

  // Mapeo fijo pedido por el usuario (2026-11-10): cada nivel combina una
  // imagen/emoji de dos fuentes distintas + 1 pregunta — no es una
  // distribución genérica, es a propósito así.
  const levels: SopaloRound[] = [
    { clues: [imageClue(funkos, categoryLabels), emojiClue(country, emojinaloLabels), preguntaClue(preguntas[0], questionLabel)] },
    { clues: [imageClue(sombras, categoryLabels), emojiClue(capital, emojinaloLabels), preguntaClue(preguntas[1], questionLabel)] },
    { clues: [imageClue(escudos, categoryLabels), frutasClue(fruta, frutasLabels), preguntaClue(preguntas[2], questionLabel)] },
    { clues: [imageClue(logos, categoryLabels), emojiClue(movieOrSeries, emojinaloLabels), preguntaClue(preguntas[3], questionLabel)] },
    { clues: [emojiClue(whatis, emojinaloLabels), frutasClue(animal, frutasLabels), preguntaClue(preguntas[4], questionLabel)] },
  ];

  return {
    dayKey,
    scopeKey: `${roscoContext.scopeKey}:${dayKey}`,
    levels,
  };
}

// Cuenta palabras ÚNICAS (normalizadas), no la suma cruda de clue.words.length.
// Si una respuesta repite una palabra (ej. "Colo Colo") o dos pistas del
// mismo nivel comparten una palabra, la grilla y foundWords tratan esa
// palabra como un solo hallazgo, así que el total tiene que contar lo mismo
// o el nivel nunca llega a "completo".
export function totalWordsInLevel(level: SopaloRound): number {
  const unique = new Set(level.clues.flatMap((c) => c.words).map(normalizeForGrid));
  return unique.size;
}

export function levelWordsKey(level: SopaloRound): string {
  return level.clues.flatMap((c) => c.words).map(normalizeForGrid).join("|");
}

export function isLevelComplete(level: SopaloRound, levelState: LevelState): boolean {
  return levelState.foundWords.length >= totalWordsInLevel(level);
}

export function countCompletedLevels(levels: SopaloRound[], levelStates: LevelState[]): number {
  return levels.reduce((count, level, i) => count + (isLevelComplete(level, levelStates[i]) ? 1 : 0), 0);
}
