import { Suspense, lazy, useEffect, useMemo, useRef, useState, ComponentType } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import OndemandVideoRoundedIcon from "@mui/icons-material/OndemandVideoRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Layout from "../components/Layout";
import WordSearchGrid from "../components/WordSearchGrid";
import { useLanguage } from "../i18n/LanguageContext";
import { getSopaloDayContext, SopaloRound, RoundClue } from "../data/sopaloRounds";
import { ImageCategoryKey } from "../data/imaginaloRounds";
import { EmojinaloCategoryKey } from "../data/emojinaloRounds";
import { FamososCategoryKey } from "../data/famososRounds";
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
import { recordLastPlayed } from "../utils/lastPlayedState";

const ACCENT = "#e74c3c";
const NEXT_ROUND_DELAY_SECONDS = 5;

type Phase = "playing" | "success" | "day_complete";

function totalWordsInRound(round: SopaloRound): number {
  return round.clues.reduce((sum, c) => sum + c.words.length, 0);
}

function roundWordsKey(round: SopaloRound): string {
  return round.clues.flatMap((c) => c.words).map(normalizeForGrid).join("|");
}

// Muestra la palabra encontrada, o guiones (uno por letra, tipo ahorcado)
// mientras no se encontró todavía.
function HangmanWord({ word, found }: { word: string; found: boolean }) {
  if (found) {
    return (
      <Typography sx={{ fontSize: 15, color: ACCENT, fontWeight: 800, letterSpacing: -1 }}>
        {word.toUpperCase()}
      </Typography>
    );
  }
  const blanks = [...word].map((ch) => (ch === " " ? "  " : "_")).join(" ");
  return (
    <Typography sx={{ fontSize: 15, color: "#bbb", fontWeight: 800, letterSpacing: -1, fontFamily: "monospace" }}>
      {blanks}
    </Typography>
  );
}

function ImageClueThumb({
  loader,
  size = 64,
  onClick,
}: {
  loader: () => Promise<{ default: ComponentType }>;
  size?: number;
  onClick?: () => void;
}) {
  const Comp = useMemo(() => lazy(loader), [loader]);
  return (
    <Box
      onClick={onClick}
      sx={{
        width: size, height: size, flexShrink: 0, borderRadius: "50%", overflow: "hidden",
        backgroundColor: "#fff", border: "1px solid #eee",
        cursor: onClick ? "zoom-in" : "default",
      }}
    >
      <Suspense fallback={<Box sx={{ width: "100%", height: "100%" }} />}>
        <Comp />
      </Suspense>
    </Box>
  );
}

function PhotoClueThumb({
  src,
  size = 64,
  onClick,
}: {
  src: string;
  size?: number;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: size, height: size, flexShrink: 0, borderRadius: "50%", overflow: "hidden",
        backgroundColor: "#fff", border: "1px solid #eee",
        cursor: onClick ? "zoom-in" : "default",
      }}
    >
      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </Box>
  );
}

export default function Game() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, currentLanguage } = useLanguage();

  const dayParam = searchParams.get("day");
  const dayKey: DayKey = isDayKey(dayParam) ? dayParam : getCurrentDayKey();

  const categoryLabels: Record<ImageCategoryKey, string> = useMemo(
    () => ({
      funkos: t.categoryFunkos,
      escudos: t.categoryEscudos,
      sombras: t.categorySombras,
      logos: t.categoryLogos,
    }),
    [t]
  );

  const emojinaloLabels: Record<EmojinaloCategoryKey, string> = useMemo(
    () => ({
      country: t.categoryCountry,
      capital: t.categoryCapital,
      whatis: t.categoryWhatis,
      movie: t.categoryMovie,
      series: t.categorySeries,
    }),
    [t]
  );

  const famososLabels: Record<FamososCategoryKey, string> = useMemo(
    () => ({
      famosos: t.categoryFamosos,
      personajes: t.categoryPersonajes,
    }),
    [t]
  );

  const dayContext = useMemo(
    () => getSopaloDayContext(dayKey, new Date(), currentLanguage, categoryLabels, t.definitionLabel, t.emojiLabel, emojinaloLabels, famososLabels),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayKey, currentLanguage]
  );

  useEffect(() => {
    recordLastPlayed();
  }, []);

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
  type ZoomedImage = { kind: "svg"; loader: () => Promise<{ default: ComponentType }> } | { kind: "photo"; src: string };
  const [zoomedImage, setZoomedImage] = useState<ZoomedImage | null>(null);

  const round: SopaloRound | undefined = dayContext.rounds[roundIndex];
  const totalWords = round ? totalWordsInRound(round) : 0;
  const [grid, setGrid] = useState<WordSearchGridResult | null>(null);
  const gridWordsRef = useRef<string | null>(null);

  // Genera una grilla nueva cada vez que arrancamos una ronda distinta.
  useEffect(() => {
    if (!round || phase === "day_complete") return;
    const key = roundWordsKey(round);
    if (gridWordsRef.current === key && grid) return; // ya generada para esta ronda

    gridWordsRef.current = key;
    const allWords = round.clues.flatMap((c) => c.words);
    setGrid(generateWordSearchGrid(allWords));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, phase]);

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
      if (next.length >= totalWords) setPhase("success");
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

        <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 1.75, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {round.clues.map((clue: RoundClue, idx: number) => {
            const clueFoundCount = clue.words.filter((w) => foundWords.includes(normalizeForGrid(w))).length;
            const clueDone = clueFoundCount === clue.words.length;
            return (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, flexShrink: 0, width: 40 }}>
                  <Typography sx={{ fontSize: 9, color: "#888", fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>{clue.label}</Typography>
                  <Box sx={{
                    minWidth: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    backgroundColor: clueDone ? "#22c55e" : `${ACCENT}18`,
                    border: `2px solid ${clueDone ? "#22c55e" : ACCENT}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800,
                    color: clueDone ? "#fff" : ACCENT,
                  }}>
                    {clueDone ? "✓" : idx + 1}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flex: 1, minWidth: 0 }}>
                  {clue.image && (
                    <ImageClueThumb
                      loader={clue.image.loader}
                      onClick={() => setZoomedImage({ kind: "svg", loader: clue.image!.loader })}
                    />
                  )}
                  {clue.photo && (
                    <PhotoClueThumb
                      src={clue.photo}
                      onClick={() => setZoomedImage({ kind: "photo", src: clue.photo! })}
                    />
                  )}
                  {clue.emoji && <Typography sx={{ fontSize: 26, whiteSpace: "nowrap" }}>{clue.emoji}</Typography>}
                  {clue.text && <Typography sx={{ fontSize: 14, color: "#333" }}>{clue.text}</Typography>}
                  <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: "24px", rowGap: "4px", minWidth: 0 }}>
                    {clue.words.map((w, i) => (
                      <HangmanWord key={i} word={w} found={revealed || foundWords.includes(normalizeForGrid(w))} />
                    ))}
                  </Box>
                </Box>
              </Box>
            );
          })}
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

      <Modal
        open={zoomedImage !== null}
        onClose={() => setZoomedImage(null)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}
      >
        <Box sx={{ position: "relative", outline: "none" }}>
          <IconButton
            onClick={() => setZoomedImage(null)}
            sx={{
              position: "absolute", top: -44, right: 0, color: "#fff",
              backgroundColor: "rgba(0,0,0,0.4)", "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
          {zoomedImage?.kind === "svg" && <ImageClueThumb loader={zoomedImage.loader} size={280} />}
          {zoomedImage?.kind === "photo" && <PhotoClueThumb src={zoomedImage.src} size={280} />}
        </Box>
      </Modal>
    </Layout>
  );
}
