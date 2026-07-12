import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import OndemandVideoRoundedIcon from "@mui/icons-material/OndemandVideoRounded";
import Layout from "../components/Layout";
import WordSearchGrid from "../components/WordSearchGrid";
import { useLanguage } from "../i18n/LanguageContext";
import { getSopaloDayContext, SopaloRound } from "../data/sopaloRounds";
import { generateWordSearchGrid, normalizeForGrid, WordSearchGridResult } from "../utils/wordSearchGrid";
import {
  DayKey,
  ROUNDS_PER_DAY,
  RoundResult,
  getCurrentDayKey,
  getDayState,
  saveDayState,
  isDayKey,
  isDayAvailable,
} from "../utils/weeklyRoscoState";

const ACCENT = "#e74c3c";
const NEXT_ROUND_DELAY_SECONDS = 5;

type Phase = "playing" | "success" | "day_complete";

export default function Game() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, currentLanguage } = useLanguage();

  const dayParam = searchParams.get("day");
  const dayKey: DayKey = isDayKey(dayParam) ? dayParam : getCurrentDayKey();

  const dayContext = useMemo(
    () => getSopaloDayContext(dayKey, new Date(), currentLanguage),
    [dayKey, currentLanguage]
  );

  const [results, setResults] = useState<RoundResult[]>(() => {
    const saved = getDayState(dayKey, dayContext.scopeKey);
    return saved.results;
  });
  const [roundIndex, setRoundIndex] = useState<number>(() => {
    const saved = getDayState(dayKey, dayContext.scopeKey);
    return saved.status === "completed" ? ROUNDS_PER_DAY : saved.currentRoundIndex;
  });

  const initialPhase: Phase = roundIndex >= ROUNDS_PER_DAY ? "day_complete" : "playing";
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [countdown, setCountdown] = useState(NEXT_ROUND_DELAY_SECONDS);

  const round: SopaloRound | undefined = dayContext.rounds[roundIndex];
  const [grid, setGrid] = useState<WordSearchGridResult | null>(null);
  const gridWordsRef = useRef<{ defWord: string; emojiWord: string } | null>(null);

  // Genera una grilla nueva cada vez que arrancamos una ronda distinta.
  useEffect(() => {
    if (!round || phase === "day_complete") return;
    const defWord = normalizeForGrid(round.defWord);
    const emojiWord = normalizeForGrid(round.emojiWord);
    if (gridWordsRef.current?.defWord === defWord && gridWordsRef.current?.emojiWord === emojiWord && grid) {
      return; // ya generada para esta ronda
    }
    gridWordsRef.current = { defWord, emojiWord };
    setGrid(generateWordSearchGrid([round.defWord, round.emojiWord]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round?.defWord, round?.emojiWord, phase]);

  // Al completar la ronda, esperar y pasar a la siguiente.
  useEffect(() => {
    if (phase !== "success") return;

    setCountdown(NEXT_ROUND_DELAY_SECONDS);
    const tick = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const advance = setTimeout(() => {
      const nextResults = [...results];
      nextResults[roundIndex] = "success";
      const nextIndex = roundIndex + 1;
      setResults(nextResults);
      saveDayState(dayKey, { currentRoundIndex: Math.min(nextIndex, ROUNDS_PER_DAY - 1), results: nextResults }, dayContext.scopeKey);

      if (nextIndex >= ROUNDS_PER_DAY) {
        setPhase("day_complete");
      } else {
        setRoundIndex(nextIndex);
        setFoundWords([]);
        setRevealed(false);
        setPhase("playing");
      }
    }, NEXT_ROUND_DELAY_SECONDS * 1000);

    return () => {
      clearInterval(tick);
      clearTimeout(advance);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function handleWordFound(word: string) {
    setFoundWords((prev) => {
      if (prev.includes(word)) return prev;
      const next = [...prev, word];
      if (next.length >= 2) setPhase("success");
      return next;
    });
  }

  // TODO: cuando esté AdSense, mostrar un rewarded ad acá antes de revelar.
  function handleRevealWords() {
    setRevealed(true);
  }

  function restartDay() {
    setResults(Array.from({ length: ROUNDS_PER_DAY }, () => "pending"));
    setRoundIndex(0);
    setFoundWords([]);
    setRevealed(false);
    setPhase("playing");
    saveDayState(dayKey, { currentRoundIndex: 0, results: Array.from({ length: ROUNDS_PER_DAY }, () => "pending") }, dayContext.scopeKey);
  }

  if (!isDayAvailable(dayKey)) {
    return (
      <Layout onBack={() => navigate("/")}>
        <Box sx={{ width: "100%", px: 2, textAlign: "center", color: "#fff" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{t.lockedDay}</Typography>
        </Box>
      </Layout>
    );
  }

  if (phase === "day_complete") {
    const successCount = results.filter((r) => r === "success").length;
    return (
      <Layout onBack={() => navigate("/")}>
        <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 52 }}>🏆</Typography>
            <Typography sx={{ fontFamily: "Lobster, cursive", fontSize: 28, color: "#222" }}>{t.dayCompleteTitle}</Typography>
            <Typography sx={{ color: "#666", fontSize: 16 }}>{t.dayCompleteBody(successCount, ROUNDS_PER_DAY)}</Typography>
          </Box>
          <Button onClick={restartDay} variant="contained" size="large" sx={{
            backgroundColor: "#fff", color: ACCENT, fontWeight: 800, fontSize: 18,
            py: 1.6, borderRadius: 999, textTransform: "none",
            boxShadow: "0 0 0 4px rgba(255,255,255,0.35), 0 10px 24px rgba(0,0,0,0.4)",
          }}>
            {t.playAgainButton}
          </Button>
          <Button onClick={() => navigate("/")} sx={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
            {t.backToHomeButton}
          </Button>
        </Box>
      </Layout>
    );
  }

  if (!round || !grid) return null;

  return (
    <Layout onBack={() => navigate("/")}>
      <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 15, textAlign: "center" }}>
          {t.roundLabel(roundIndex + 1, ROUNDS_PER_DAY)}
        </Typography>

        <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 1.75, display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Box sx={{
              minWidth: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              backgroundColor: foundWords.includes(normalizeForGrid(round.defWord)) ? "#22c55e" : `${ACCENT}18`,
              border: `2px solid ${foundWords.includes(normalizeForGrid(round.defWord)) ? "#22c55e" : ACCENT}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800,
              color: foundWords.includes(normalizeForGrid(round.defWord)) ? "#fff" : ACCENT,
            }}>
              {foundWords.includes(normalizeForGrid(round.defWord)) ? "✓" : "1"}
            </Box>
            <Box>
              <Typography sx={{ fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{t.definitionLabel}</Typography>
              <Typography sx={{ fontSize: 14, color: "#333" }}>{round.defClue}</Typography>
              {revealed && (
                <Typography sx={{ fontSize: 15, color: ACCENT, fontWeight: 800, letterSpacing: 1 }}>
                  {round.defWord.toUpperCase()}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{
              minWidth: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              backgroundColor: foundWords.includes(normalizeForGrid(round.emojiWord)) ? "#22c55e" : `${ACCENT}18`,
              border: `2px solid ${foundWords.includes(normalizeForGrid(round.emojiWord)) ? "#22c55e" : ACCENT}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800,
              color: foundWords.includes(normalizeForGrid(round.emojiWord)) ? "#fff" : ACCENT,
            }}>
              {foundWords.includes(normalizeForGrid(round.emojiWord)) ? "✓" : "2"}
            </Box>
            <Typography sx={{ fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{t.emojiLabel}</Typography>
            <Typography sx={{ fontSize: 26 }}>{round.emojiClue}</Typography>
            {revealed && (
              <Typography sx={{ fontSize: 15, color: ACCENT, fontWeight: 800, letterSpacing: 1 }}>
                {round.emojiWord.toUpperCase()}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ position: "relative", borderRadius: "16px", overflow: "hidden", backgroundColor: "#fff", p: 1 }}>
          <WordSearchGrid
            grid={grid}
            foundWords={foundWords}
            onWordFound={handleWordFound}
            disabled={phase !== "playing"}
          />

          {phase === "success" && (
            <Box sx={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
              backgroundColor: "rgba(255,255,255,0.96)", textAlign: "center", px: 2,
            }}>
              <Typography sx={{ fontSize: 40 }}>🎉</Typography>
              <Typography sx={{ fontFamily: "Lobster, cursive", fontSize: 24, color: "#222" }}>{t.successTitle}</Typography>
              <Typography sx={{ fontSize: 13, color: "#999", mt: 1 }}>{t.nextRoundIn(countdown)}</Typography>
            </Box>
          )}
        </Box>

        {phase === "playing" && !revealed && (
          <Button
            onClick={handleRevealWords}
            variant="outlined"
            startIcon={<OndemandVideoRoundedIcon />}
            sx={{
              color: "#fff", borderColor: "rgba(255,255,255,0.6)", fontWeight: 700, fontSize: 13,
              py: 1.2, borderRadius: 999, textTransform: "none",
              "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.08)" },
            }}
          >
            {t.revealButton}
          </Button>
        )}
      </Box>
    </Layout>
  );
}
