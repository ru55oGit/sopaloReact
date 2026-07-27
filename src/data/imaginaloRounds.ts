import { ComponentType } from "react";
import { getWeekStart } from "./weeklyRoscos";
import marcasData from "./marcas.json";
import escudosData from "./escudos.json";
import sombrasData from "./sombras.json";
import sombrasEnData from "./sombras_en.json";
import funkosData from "./funkos.json";
import funkosEnData from "./funkos_en.json";

// Mismo ancla que weeklyRoscos.ts (CYCLE_BASE_DATE), para que el ciclado de
// contenido semanal sea consistente entre las distintas fuentes del día.
const CYCLE_BASE_DATE = "2025-12-29";
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export type ImageCategoryKey = "funkos" | "escudos" | "sombras" | "logos";

export const IMAGE_CATEGORIES: ImageCategoryKey[] = ["funkos", "escudos", "sombras", "logos"];

interface RawEntry {
  titulo: string;
  respuesta: string;
  pregunta: string;
  categoria: string;
}

interface DataCollection {
  listado: RawEntry[];
}

function getEntries(data: DataCollection): RawEntry[] {
  return data.listado;
}

const POOLS: Record<ImageCategoryKey, RawEntry[]> = {
  funkos: getEntries(funkosData as DataCollection),
  escudos: getEntries(escudosData as DataCollection),
  sombras: getEntries(sombrasData as DataCollection),
  logos: getEntries(marcasData as DataCollection),
};

// Funkos y Sombras solo tienen datos curados en es/en por ahora (vienen de
// Imaginalo, que tampoco tiene pt/fr/de). Para esos 3 idiomas usamos el
// texto en español como resguardo hasta que se curen las respuestas
// dobladas/localizadas reales. Escudos y Logos son nombres propios (clubes,
// marcas) que no cambian entre idiomas, así que no necesitan variantes.
function getEntriesForLanguage(category: ImageCategoryKey, language: string): RawEntry[] {
  if (category === "funkos" && language === "en") return getEntries(funkosEnData as DataCollection);
  if (category === "sombras" && language === "en") return getEntries(sombrasEnData as DataCollection);
  return POOLS[category];
}

type SvgModule = { default: ComponentType };
type SvgLoader = () => Promise<SvgModule>;

const SVG_MODULES: Record<ImageCategoryKey, Record<string, SvgLoader>> = {
  funkos: import.meta.glob("../components/SVG/Funkos/funkos*.js") as Record<string, SvgLoader>,
  escudos: import.meta.glob("../components/SVG/Escudos/escudos*.js") as Record<string, SvgLoader>,
  sombras: import.meta.glob("../components/SVG/Sombras/sombras*.js") as Record<string, SvgLoader>,
  logos: import.meta.glob("../components/SVG/Logos/marcas*.js") as Record<string, SvgLoader>,
};

const SVG_PATH: Record<ImageCategoryKey, (level: number) => string> = {
  funkos: (level) => `../components/SVG/Funkos/funkos${level}.js`,
  escudos: (level) => `../components/SVG/Escudos/escudos${level}.js`,
  sombras: (level) => `../components/SVG/Sombras/sombras${level}.js`,
  logos: (level) => `../components/SVG/Logos/marcas${level}.js`,
};

export function getImageLoader(category: ImageCategoryKey, level: number): SvgLoader {
  const path = SVG_PATH[category](level);
  return SVG_MODULES[category][path];
}

// "the new|york times" -> ["the", "new", "york", "times"]. El "|" en el
// dato original es solo un corte de línea para la UI de Imaginalo, coincide
// con un límite de palabra real.
export function splitAnswerWords(respuesta: string): string[] {
  return respuesta
    .split(/[\s|]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
}

export interface ImaginaloClue {
  category: ImageCategoryKey;
  level: number;
  words: string[];
  loader: SvgLoader;
}

function pickIndex(poolSize: number, dayIndex: number, referenceDate: Date): number {
  const weekStart = getWeekStart(referenceDate);
  const weeksSinceBase = Math.round(
    (new Date(weekStart).getTime() - new Date(CYCLE_BASE_DATE).getTime()) / MS_PER_WEEK
  );
  const idx = ((weeksSinceBase * 7 + dayIndex) % poolSize + poolSize) % poolSize;
  return idx;
}

export function getImaginaloRoundClues(
  dayIndex: number,
  referenceDate = new Date(),
  language = "es"
): ImaginaloClue[] {
  return IMAGE_CATEGORIES.map((category) => {
    const entries = getEntriesForLanguage(category, language);
    const idx = pickIndex(entries.length, dayIndex, referenceDate);
    const entry = entries[idx];
    const level = Number(entry.pregunta);
    return {
      category,
      level,
      words: splitAnswerWords(entry.respuesta),
      loader: getImageLoader(category, level),
    };
  });
}
