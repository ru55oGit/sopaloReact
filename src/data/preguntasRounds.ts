import { getWeekStart } from "./weeklyRoscos";
import { splitAnswerWords } from "./imaginaloRounds";
import preguntasData from "./preguntas.json";

// Mismo ancla que weeklyRoscos.ts / imaginaloRounds.ts / emojinaloRounds.ts /
// frutasRounds.ts (CYCLE_BASE_DATE), para que el ciclado semanal sea
// consistente entre las distintas fuentes del día.
const CYCLE_BASE_DATE = "2025-12-29";
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const SLOTS_PER_ROUND = 4;

interface PreguntaEntry {
  pregunta: string;
  respuesta: string;
}

const PREGUNTAS = preguntasData as PreguntaEntry[];

export interface PreguntaClue {
  words: string[];
  text: string;
}

function normalizeAnswer(respuesta: string): string {
  return respuesta.trim().toUpperCase().replace(/\|/g, " ");
}

export function getPreguntasRoundClues(dayIndex: number, referenceDate = new Date()): PreguntaClue[] {
  const weekStart = getWeekStart(referenceDate);
  const weeksSinceBase = Math.round(
    (new Date(weekStart).getTime() - new Date(CYCLE_BASE_DATE).getTime()) / MS_PER_WEEK
  );
  const dayCounter = weeksSinceBase * 7 + dayIndex;

  // Algunas preguntas distintas comparten la misma respuesta (p. ej. "el
  // continente blanco" y "el continente menos poblado" son las dos
  // "Antartida"). Si dos clues de la MISMA ronda tuvieran la misma
  // respuesta, encontrar una marcaría ambas resueltas a la vez. Escaneamos
  // hacia adelante desde el índice base y saltamos cualquier entrada cuya
  // respuesta (normalizada) ya haya salido ese día.
  const usedAnswers = new Set<string>();
  const clues: PreguntaClue[] = [];
  for (let offset = 0; clues.length < SLOTS_PER_ROUND && offset < PREGUNTAS.length; offset++) {
    const idx = ((dayCounter * SLOTS_PER_ROUND + offset) % PREGUNTAS.length + PREGUNTAS.length) % PREGUNTAS.length;
    const entry = PREGUNTAS[idx];
    const key = normalizeAnswer(entry.respuesta);
    if (usedAnswers.has(key)) continue;
    usedAnswers.add(key);
    clues.push({ words: splitAnswerWords(entry.respuesta), text: entry.pregunta });
  }
  return clues;
}
