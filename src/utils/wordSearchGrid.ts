// Motor de generación de sopa de letras: coloca palabras en una grilla
// NxN en una de las 8 direcciones posibles, sin acentos (para no depender
// de que el teclado/idioma tenga esos caracteres en la grilla), permite
// que dos palabras se crucen si comparten una letra en esa celda, y
// rellena el resto con letras al azar.

export interface Direction {
  dRow: number;
  dCol: number;
}

export const DIRECTIONS: Direction[] = [
  { dRow: 0, dCol: 1 },   // →
  { dRow: 0, dCol: -1 },  // ←
  { dRow: 1, dCol: 0 },   // ↓
  { dRow: -1, dCol: 0 },  // ↑
  { dRow: 1, dCol: 1 },   // ↘
  { dRow: 1, dCol: -1 },  // ↙
  { dRow: -1, dCol: 1 },  // ↗
  { dRow: -1, dCol: -1 }, // ↖
];

export interface PlacedWord {
  word: string; // normalizado (sin acentos, mayúsculas)
  row: number;
  col: number;
  dRow: number;
  dCol: number;
}

export interface WordSearchGridResult {
  size: number;
  letters: string[][];
  placements: PlacedWord[];
}

export function normalizeForGrid(word: string): string {
  return word
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase()
    .trim();
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function allPositions(size: number): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      positions.push({ row, col });
    }
  }
  return positions;
}

function canPlace(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dRow: number,
  dCol: number,
  size: number
): boolean {
  const endRow = row + dRow * (word.length - 1);
  const endCol = col + dCol * (word.length - 1);
  if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) return false;

  for (let i = 0; i < word.length; i++) {
    const r = row + dRow * i;
    const c = col + dCol * i;
    const existing = grid[r][c];
    if (existing !== null && existing !== word[i]) return false;
  }
  return true;
}

function tryPlaceWord(grid: (string | null)[][], word: string, size: number): PlacedWord | null {
  const dirs = shuffle(DIRECTIONS);
  const startPositions = shuffle(allPositions(size));

  for (const { dRow, dCol } of dirs) {
    for (const { row, col } of startPositions) {
      if (canPlace(grid, word, row, col, dRow, dCol, size)) {
        for (let i = 0; i < word.length; i++) {
          grid[row + dRow * i][col + dCol * i] = word[i];
        }
        return { word, row, col, dRow, dCol };
      }
    }
  }
  return null;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function fillRandomLetters(grid: (string | null)[][], size: number): void {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === null) {
        grid[row][col] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }
}

const MAX_ATTEMPTS = 200;

export function generateWordSearchGrid(words: string[], sizeOverride?: number): WordSearchGridResult {
  const normalizedWords = words.map(normalizeForGrid);
  const longest = Math.max(...normalizedWords.map((w) => w.length));
  const size = sizeOverride ?? Math.max(10, longest + 3);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const grid: (string | null)[][] = Array.from({ length: size }, () => Array<string | null>(size).fill(null));
    const placements: PlacedWord[] = [];
    let ok = true;

    for (const word of normalizedWords) {
      const placed = tryPlaceWord(grid, word, size);
      if (!placed) {
        ok = false;
        break;
      }
      placements.push(placed);
    }

    if (ok) {
      fillRandomLetters(grid, size);
      return { size, letters: grid as string[][], placements };
    }
  }

  // Extremadamente improbable con palabras de 3-9 letras en una grilla de
  // al menos 10x10, pero si pasa, reintentamos con una grilla más grande.
  return generateWordSearchGrid(words, size + 2);
}

export interface GridCell {
  row: number;
  col: number;
}

// Devuelve las celdas entre start y end SOLO si forman una línea recta
// (horizontal, vertical o diagonal a 45°); si no, null (selección inválida).
export function getLineCells(start: GridCell, end: GridCell): GridCell[] | null {
  const dRow = end.row - start.row;
  const dCol = end.col - start.col;

  if (dRow === 0 && dCol === 0) return [{ row: start.row, col: start.col }];
  if (dRow !== 0 && dCol !== 0 && Math.abs(dRow) !== Math.abs(dCol)) return null;

  const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
  const stepRow = Math.sign(dRow);
  const stepCol = Math.sign(dCol);

  const cells: GridCell[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: start.row + stepRow * i, col: start.col + stepCol * i });
  }
  return cells;
}

// Compara las letras recorridas contra la palabra colocada, en cualquiera
// de los dos sentidos (el jugador puede arrastrar desde cualquier punta).
export function matchesPlacedWord(cells: GridCell[], letters: string[][], placement: PlacedWord): boolean {
  if (cells.length !== placement.word.length) return false;

  const forward = cells.map((c) => letters[c.row][c.col]).join("");
  const backward = [...forward].reverse().join("");
  return forward === placement.word || backward === placement.word;
}
