import { getWeekStart } from "./weeklyRoscos";
import { splitAnswerWords } from "./imaginaloRounds";
import preguntasData from "./preguntas.json";

// Mismo ancla que weeklyRoscos.ts / imaginaloRounds.ts / emojinaloRounds.ts /
// famososRounds.ts (CYCLE_BASE_DATE), para que el ciclado semanal sea
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

export function getPreguntasRoundClues(dayIndex: number, referenceDate = new Date()): PreguntaClue[] {
  const weekStart = getWeekStart(referenceDate);
  const weeksSinceBase = Math.round(
    (new Date(weekStart).getTime() - new Date(CYCLE_BASE_DATE).getTime()) / MS_PER_WEEK
  );
  const dayCounter = weeksSinceBase * 7 + dayIndex;

  return Array.from({ length: SLOTS_PER_ROUND }, (_, slot) => {
    const idx = ((dayCounter * SLOTS_PER_ROUND + slot) % PREGUNTAS.length + PREGUNTAS.length) % PREGUNTAS.length;
    const entry = PREGUNTAS[idx];
    return { words: splitAnswerWords(entry.respuesta), text: entry.pregunta };
  });
}
