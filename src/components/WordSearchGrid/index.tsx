import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import {
  WordSearchGridResult,
  GridCell,
  getLineCells,
  matchesPlacedWord,
} from "../../utils/wordSearchGrid";

const ACCENT = "#e74c3c";

interface WordSearchGridProps {
  grid: WordSearchGridResult;
  foundWords: string[]; // normalized (uppercase, sin acentos) — ya encontradas
  onWordFound: (word: string) => void;
  disabled?: boolean;
}

function cellKey(cell: GridCell): string {
  return `${cell.row}-${cell.col}`;
}

export default function WordSearchGrid({ grid, foundWords, onWordFound, disabled = false }: WordSearchGridProps) {
  const [selection, setSelection] = useState<GridCell[]>([]);
  const startRef = useRef<GridCell | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const foundCellKeys = new Set(
    grid.placements
      .filter((p) => foundWords.includes(p.word))
      .flatMap((p) =>
        Array.from({ length: p.word.length }, (_, i) => cellKey({ row: p.row + p.dRow * i, col: p.col + p.dCol * i }))
      )
  );

  const selectedCellKeys = new Set(selection.map(cellKey));

  function cellFromPoint(clientX: number, clientY: number): GridCell | null {
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const cellEl = el?.closest("[data-row]") as HTMLElement | null;
    if (!cellEl) return null;
    const row = Number(cellEl.dataset.row);
    const col = Number(cellEl.dataset.col);
    if (Number.isNaN(row) || Number.isNaN(col)) return null;
    return { row, col };
  }

  function handlePointerDown(e: React.PointerEvent, cell: GridCell) {
    if (disabled) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = cell;
    setSelection([cell]);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (disabled || !startRef.current) return;
    const current = cellFromPoint(e.clientX, e.clientY);
    if (!current) return;
    const line = getLineCells(startRef.current, current);
    if (line) setSelection(line);
  }

  function handlePointerUp() {
    if (disabled || !startRef.current) return;

    const pendingPlacements = grid.placements.filter((p) => !foundWords.includes(p.word));
    const match = pendingPlacements.find((p) => matchesPlacedWord(selection, grid.letters, p));
    if (match) onWordFound(match.word);

    startRef.current = null;
    setSelection([]);
  }

  return (
    <Box
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid.size}, 1fr)`,
        gap: "2px",
        width: "100%",
        aspectRatio: "1 / 1",
        touchAction: "none",
        userSelect: "none",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {grid.letters.map((row, r) =>
        row.map((letter, c) => {
          const key = cellKey({ row: r, col: c });
          const isFound = foundCellKeys.has(key);
          const isSelected = selectedCellKeys.has(key);
          return (
            <Box
              key={key}
              data-row={r}
              data-col={c}
              onPointerDown={(e) => handlePointerDown(e, { row: r, col: c })}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                fontWeight: 800,
                fontSize: { xs: 13, sm: 15 },
                fontFamily: "monospace",
                backgroundColor: isFound ? "#22c55e" : isSelected ? `${ACCENT}55` : "#f3f3f3",
                color: isFound ? "#fff" : isSelected ? ACCENT : "#333",
                transition: "background-color 0.1s, color 0.1s",
                cursor: disabled ? "default" : "pointer",
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
