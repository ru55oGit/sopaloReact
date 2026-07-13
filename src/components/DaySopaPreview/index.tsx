import { useMemo } from "react";
import Box from "@mui/material/Box";
import { normalizeForGrid } from "../../utils/wordSearchGrid";

const FOUND_COLOR = "#22c55e";
const LONGEST_DAY = "MIERCOLES";
export const DAY_SOPA_SIZE = LONGEST_DAY.length + 2; // 2 letras más que el día más largo

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randomLetter(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

interface HighlightRow {
  row: number;
  text: string;
}

function buildGrid(rows: HighlightRow[]): { letters: string[][]; highlighted: Set<string> } {
  const letters: string[][] = Array.from({ length: DAY_SOPA_SIZE }, () =>
    Array.from({ length: DAY_SOPA_SIZE }, () => randomLetter())
  );
  const highlighted = new Set<string>();

  for (const { row, text } of rows) {
    const clean = normalizeForGrid(text).replace(/\s+/g, " ").slice(0, DAY_SOPA_SIZE);
    if (!clean) continue;
    const startCol = Math.max(0, Math.floor((DAY_SOPA_SIZE - clean.length) / 2));
    for (let i = 0; i < clean.length && startCol + i < DAY_SOPA_SIZE; i++) {
      const col = startCol + i;
      if (clean[i] === " ") continue; // deja la letra al azar y sin resaltar como separador
      letters[row][col] = clean[i];
      highlighted.add(`${row}-${col}`);
    }
  }

  return { letters, highlighted };
}

interface DaySopaPreviewProps {
  dayLabel: string;
  statusLabel: string;
  fractionLabel: string;
}

export default function DaySopaPreview({ dayLabel, statusLabel, fractionLabel }: DaySopaPreviewProps) {
  const { letters, highlighted } = useMemo(
    () =>
      buildGrid([
        { row: 0, text: dayLabel },
        { row: DAY_SOPA_SIZE - 2, text: statusLabel },
        { row: DAY_SOPA_SIZE - 1, text: fractionLabel },
      ]),
    [dayLabel, statusLabel, fractionLabel]
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${DAY_SOPA_SIZE}, 1fr)`,
        gap: "2px",
        width: "100%",
        aspectRatio: "1 / 1",
      }}
    >
      {letters.map((rowArr, r) =>
        rowArr.map((letter, c) => {
          const key = `${r}-${c}`;
          const isHighlighted = highlighted.has(key);
          return (
            <Box
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "3px",
                fontWeight: 800,
                fontSize: { xs: 10, sm: 12 },
                fontFamily: "monospace",
                backgroundColor: isHighlighted ? FOUND_COLOR : "#f3f3f3",
                color: isHighlighted ? "#fff" : "#999",
              }}
            >
              {letter}
            </Box>
          );
        })
      )}
    </Box>
  );
}
