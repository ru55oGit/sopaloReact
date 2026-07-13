import { useMemo } from "react";
import Box from "@mui/material/Box";
import { buildSopaPreviewGrid } from "../../utils/sopaPreviewGrid";

const ACCENT = "#e74c3c";
const DONE_COLOR = "#22c55e";
export const MINI_SOPA_SIZE = 5;

interface MiniSopaFractionProps {
  fractionLabel: string;
  completed: boolean;
}

export default function MiniSopaFraction({ fractionLabel, completed }: MiniSopaFractionProps) {
  const { letters, highlighted } = useMemo(
    () =>
      buildSopaPreviewGrid(MINI_SOPA_SIZE, [
        { row: Math.floor(MINI_SOPA_SIZE / 2), text: fractionLabel },
      ]),
    [fractionLabel]
  );

  const highlightColor = completed ? DONE_COLOR : ACCENT;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${MINI_SOPA_SIZE}, 1fr)`,
        gap: "2px",
        width: "70%",
        maxWidth: 110,
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
                fontSize: { xs: 12, sm: 13 },
                fontFamily: "monospace",
                backgroundColor: isHighlighted ? highlightColor : "#f3f3f3",
                color: isHighlighted ? "#fff" : "#bbb",
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
