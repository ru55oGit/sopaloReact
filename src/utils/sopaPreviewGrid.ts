import { normalizeForGrid } from "./wordSearchGrid";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randomLetter(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

export interface HighlightRow {
  row: number;
  text: string;
}

export interface SopaPreviewGrid {
  letters: string[][];
  highlighted: Set<string>;
}

// Arma una grilla decorativa de NxN rellena con letras al azar, con
// una o más filas donde se "resalta" un texto centrado (como si fuera
// una palabra encontrada en una sopa de letras real). Los espacios en
// el texto dejan una celda sin resaltar, como separador entre palabras.
export function buildSopaPreviewGrid(size: number, rows: HighlightRow[]): SopaPreviewGrid {
  const letters: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => randomLetter())
  );
  const highlighted = new Set<string>();

  for (const { row, text } of rows) {
    const clean = normalizeForGrid(text).replace(/\s+/g, " ").slice(0, size);
    if (!clean) continue;
    const startCol = Math.max(0, Math.floor((size - clean.length) / 2));
    for (let i = 0; i < clean.length && startCol + i < size; i++) {
      const col = startCol + i;
      if (clean[i] === " ") continue; // deja la letra al azar y sin resaltar como separador
      letters[row][col] = clean[i];
      highlighted.add(`${row}-${col}`);
    }
  }

  return { letters, highlighted };
}
