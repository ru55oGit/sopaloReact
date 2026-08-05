import { getWeekStart } from "./weeklyRoscos";
import { splitAnswerWords } from "./imaginaloRounds";
import frutasData from "./frutas.json";
import animalesData from "./animales.json";

// Mismo ancla que weeklyRoscos.ts / imaginaloRounds.ts / emojinaloRounds.ts
// (CYCLE_BASE_DATE), para que el ciclado semanal sea consistente entre las
// distintas fuentes del día.
const CYCLE_BASE_DATE = "2025-12-29";
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export type FrutasCategoryKey = "frutas" | "animales";

interface PhotoEntry {
  file: string;
  name: string;
}

const FRUTAS = frutasData as PhotoEntry[];
const ANIMALES = animalesData as PhotoEntry[];

// Fotos en src/assets/{frutas,animales}/<file>.jpg. eager+query:"?url" para
// que cada entrada del glob resuelva directo a la URL final del asset (no a
// un módulo lazy), ya que acá no hay componentes que cargar, solo <img src>.
const FRUTAS_IMAGES = import.meta.glob("../assets/frutas/*.jpg", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;

const ANIMALES_IMAGES = import.meta.glob("../assets/animales/*.jpg", {
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

const FRUTAS_URL_BY_FILE = buildUrlIndex(FRUTAS_IMAGES);
const ANIMALES_URL_BY_FILE = buildUrlIndex(ANIMALES_IMAGES);

function pickIndex(poolSize: number, dayIndex: number, referenceDate: Date): number {
  const weekStart = getWeekStart(referenceDate);
  const weeksSinceBase = Math.round(
    (new Date(weekStart).getTime() - new Date(CYCLE_BASE_DATE).getTime()) / MS_PER_WEEK
  );
  const idx = ((weeksSinceBase * 7 + dayIndex) % poolSize + poolSize) % poolSize;
  return idx;
}

export interface FrutasClue {
  category: FrutasCategoryKey;
  words: string[];
  photo: string;
}

export function getFrutasRoundClues(dayIndex: number, referenceDate = new Date()): FrutasClue[] {
  const fruta = FRUTAS[pickIndex(FRUTAS.length, dayIndex, referenceDate)];
  const animal = ANIMALES[pickIndex(ANIMALES.length, dayIndex, referenceDate)];

  const frutaUrl = FRUTAS_URL_BY_FILE.get(fruta.file);
  const animalUrl = ANIMALES_URL_BY_FILE.get(animal.file);
  if (!frutaUrl) throw new Error(`No se encontró la imagen de frutas para "${fruta.file}"`);
  if (!animalUrl) throw new Error(`No se encontró la imagen de animales para "${animal.file}"`);

  return [
    { category: "frutas", words: splitAnswerWords(fruta.name), photo: frutaUrl },
    { category: "animales", words: splitAnswerWords(animal.name), photo: animalUrl },
  ];
}
