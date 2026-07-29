import { getWeekStart } from "./weeklyRoscos";
import { splitAnswerWords } from "./imaginaloRounds";
import famososData from "./famosos.json";
import personajesData from "./personajes.json";

// Mismo ancla que weeklyRoscos.ts / imaginaloRounds.ts / emojinaloRounds.ts
// (CYCLE_BASE_DATE), para que el ciclado semanal sea consistente entre las
// distintas fuentes del día.
const CYCLE_BASE_DATE = "2025-12-29";
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export type FamososCategoryKey = "famosos" | "personajes";

interface PhotoEntry {
  file: string;
  name: string;
}

const FAMOSOS = famososData as PhotoEntry[];
const PERSONAJES = personajesData as PhotoEntry[];

// Fotos en src/assets/{famosos,personajes}/<file>.jpg. eager+query:"?url" para
// que cada entrada del glob resuelva directo a la URL final del asset (no a
// un módulo lazy), ya que acá no hay componentes que cargar, solo <img src>.
const FAMOSOS_IMAGES = import.meta.glob("../assets/famosos/*.jpg", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;

const PERSONAJES_IMAGES = import.meta.glob("../assets/personajes/*.jpg", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;

function buildUrlIndex(images: Record<string, string>): Map<string, string> {
  const index = new Map<string, string>();
  for (const [path, url] of Object.entries(images)) {
    const file = path.split("/").pop()!.replace(/\.jpg$/, "");
    index.set(file, url);
  }
  return index;
}

const FAMOSOS_URL_BY_FILE = buildUrlIndex(FAMOSOS_IMAGES);
const PERSONAJES_URL_BY_FILE = buildUrlIndex(PERSONAJES_IMAGES);

function pickIndex(poolSize: number, dayIndex: number, referenceDate: Date): number {
  const weekStart = getWeekStart(referenceDate);
  const weeksSinceBase = Math.round(
    (new Date(weekStart).getTime() - new Date(CYCLE_BASE_DATE).getTime()) / MS_PER_WEEK
  );
  const idx = ((weeksSinceBase * 7 + dayIndex) % poolSize + poolSize) % poolSize;
  return idx;
}

export interface FamososClue {
  category: FamososCategoryKey;
  words: string[];
  photo: string;
}

export function getFamososRoundClues(dayIndex: number, referenceDate = new Date()): FamososClue[] {
  const famoso = FAMOSOS[pickIndex(FAMOSOS.length, dayIndex, referenceDate)];
  const personaje = PERSONAJES[pickIndex(PERSONAJES.length, dayIndex, referenceDate)];

  const famosoUrl = FAMOSOS_URL_BY_FILE.get(famoso.file);
  const personajeUrl = PERSONAJES_URL_BY_FILE.get(personaje.file);
  if (!famosoUrl) throw new Error(`No se encontró la imagen de famosos para "${famoso.file}"`);
  if (!personajeUrl) throw new Error(`No se encontró la imagen de personajes para "${personaje.file}"`);

  return [
    { category: "famosos", words: splitAnswerWords(famoso.name), photo: famosoUrl },
    { category: "personajes", words: splitAnswerWords(personaje.name), photo: personajeUrl },
  ];
}
