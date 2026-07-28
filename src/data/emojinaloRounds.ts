import { getWeekStart } from "./weeklyRoscos";
import { splitAnswerWords } from "./imaginaloRounds";
import countriesData from "./emojinalo/countries.json";
import whatisData from "./emojinalo/whatis.json";
import moviesData from "./emojinalo/movies.json";

// Mismo ancla que weeklyRoscos.ts / imaginaloRounds.ts (CYCLE_BASE_DATE), para
// que el ciclado de contenido semanal sea consistente entre las distintas
// fuentes del día.
const CYCLE_BASE_DATE = "2025-12-29";
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export type EmojinaloCategoryKey = "country" | "capital" | "whatis" | "movie" | "series";

export const EMOJINALO_CATEGORIES: EmojinaloCategoryKey[] = ["country", "capital", "whatis", "movie"];

interface MultiLang {
  es: string;
  en: string;
  pt: string;
  fr: string;
  de: string;
}

interface CountryEntry {
  country: MultiLang;
  flag: string;
  capital: MultiLang;
}

interface WhatisEntry {
  emoji: string;
  word: MultiLang;
  category: MultiLang;
}

interface MovieEntry {
  title: string;
  en: string;
  sp: string;
  pt?: string;
  fr?: string;
  de?: string;
  movie: string;
}

// Los primeros 100 países del ranking FIFA (ya vienen en ese orden desde
// Emojinalo). Se usan tal cual para la categoría "país".
const COUNTRIES = countriesData as CountryEntry[];

// Mismos 100 países que COUNTRIES, pero en orden alfabético (no el de
// ranking FIFA), para que el país cuya capital se pide en un día dado no
// sea sistemáticamente el mismo que el de la categoría "país" ese día.
const CAPITALS_POOL = [...COUNTRIES].sort((a, b) => a.country.es.localeCompare(b.country.es, "es"));

const WHATIS = whatisData as WhatisEntry[];
const MOVIES = moviesData as MovieEntry[];

function pickIndex(poolSize: number, dayIndex: number, referenceDate: Date): number {
  const weekStart = getWeekStart(referenceDate);
  const weeksSinceBase = Math.round(
    (new Date(weekStart).getTime() - new Date(CYCLE_BASE_DATE).getTime()) / MS_PER_WEEK
  );
  const idx = ((weeksSinceBase * 7 + dayIndex) % poolSize + poolSize) % poolSize;
  return idx;
}

function langField(entry: MultiLang, language: string): string {
  return (entry as unknown as Record<string, string>)[language] ?? entry.es;
}

// MovieEntry usa "sp" (no "es") para el español, y pt/fr/de son opcionales
// (si falta la variante localizada, resguardamos con el texto en español).
function movieAnswer(entry: MovieEntry, language: string): string {
  const byLanguage: Record<string, string | undefined> = {
    es: entry.sp,
    en: entry.en,
    pt: entry.pt,
    fr: entry.fr,
    de: entry.de,
  };
  return byLanguage[language] ?? entry.sp;
}

export interface EmojinaloClue {
  category: EmojinaloCategoryKey;
  words: string[];
  emoji: string;
}

export function getEmojinaloRoundClues(
  dayIndex: number,
  referenceDate = new Date(),
  language = "es"
): EmojinaloClue[] {
  const country = COUNTRIES[pickIndex(COUNTRIES.length, dayIndex, referenceDate)];
  const capitalCountry = CAPITALS_POOL[pickIndex(CAPITALS_POOL.length, dayIndex, referenceDate)];
  const whatis = WHATIS[pickIndex(WHATIS.length, dayIndex, referenceDate)];
  const movie = MOVIES[pickIndex(MOVIES.length, dayIndex, referenceDate)];
  const movieCategory: EmojinaloCategoryKey = movie.title === "Series" ? "series" : "movie";

  return [
    { category: "country", words: splitAnswerWords(langField(country.country, language)), emoji: country.flag },
    { category: "capital", words: splitAnswerWords(langField(capitalCountry.capital, language)), emoji: capitalCountry.flag },
    { category: "whatis", words: splitAnswerWords(langField(whatis.word, language)), emoji: whatis.emoji },
    { category: movieCategory, words: splitAnswerWords(movieAnswer(movie, language)), emoji: movie.movie },
  ];
}
