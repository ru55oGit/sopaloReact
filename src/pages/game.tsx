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
import HowToPlayCollapse from "../components/HowToPlayCollapse";
import WordSearchGrid from "../components/WordSearchGrid";
import { useLanguage } from "../i18n/LanguageContext";
import {
  getSopaloDayContext,
  SopaloRound,
  RoundClue,
  totalWordsInLevel,
  levelWordsKey,
  isLevelComplete,
  countCompletedLevels,
} from "../data/sopaloRounds";
import { ImageCategoryKey } from "../data/imaginaloRounds";
import { EmojinaloCategoryKey } from "../data/emojinaloRounds";
import { FrutasCategoryKey } from "../data/frutasRounds";
import { generateWordSearchGrid, normalizeForGrid, WordSearchGridResult } from "../utils/wordSearchGrid";
import {
  DayKey,
  LEVELS_PER_DAY,
  LevelState,
  getCurrentDayKey,
  getDayState,
  saveDayState,
  isDayKey,
  isDayAvailable,
  deriveStatus,
} from "../utils/weeklyRoscoState";
import { recordLastPlayed } from "../utils/lastPlayedState";
import { track } from "../lib/analytics";
import { useRewardedAd } from "../ads/useRewardedAd";
import RewardedAdModal from "../ads/RewardedAdModal";

const ACCENT = "#e74c3c";
const CELEBRATION_DURATION_MS = 2200;

// Muestra la palabra encontrada (por el jugador, en rojo), revelada por el
// botón de anuncio pero todavía no encontrada en la grilla (en negro, para
// distinguirla de las ya resueltas), o guiones mientras no pasó ninguna.
function HangmanWord({ word, foundByPlayer, revealed }: { word: string; foundByPlayer: boolean; revealed: boolean }) {
  if (foundByPlayer) {
    return (
      <Typography sx={{ fontSize: 15, color: ACCENT, fontWeight: 800, letterSpacing: -1, fontFamily: "monospace" }}>
        {word.toUpperCase()}
      </Typography>
    );
  }
  if (revealed) {
    return (
      <Typography sx={{ fontSize: 15, color: "#222", fontWeight: 800, letterSpacing: -1, fontFamily: "monospace" }}>
        {word.toUpperCase()}
      </Typography>
    );
  }
  // Mismo largo de string, misma fuente/tamaño/letterSpacing que la palabra
  // ya resuelta (arriba) — así el ancho renderizado es igual en los 3
  // estados y el wrap de línea no cambia según si ya se adivinó o no (lo
  // que hacía variar la altura de la card al pasar de posición).
  const blanks = [...word].map((ch) => (ch === " " ? " " : "_")).join("");
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
        width: size, height: size, flexShrink: 0, borderRadius: "8px", overflow: "hidden",
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
        width: size, height: size, flexShrink: 0, borderRadius: "8px", overflow: "hidden",
        backgroundColor: "#fff", border: "1px solid #eee",
        cursor: onClick ? "zoom-in" : "default",
      }}
    >
      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </Box>
  );
}

// Separa un string de emojis en sus unidades visuales (grafemas), respetando
// secuencias ZWJ/variation selectors (ej. "🧑🏽‍🦱" o "➡️" son 1 sola unidad,
// no varios code points sueltos).
interface GraphemeSegmenter {
  segment(input: string): Iterable<{ segment: string }>;
}
interface IntlWithSegmenter {
  Segmenter?: new (locale?: string, options?: { granularity?: string }) => GraphemeSegmenter;
}

function splitEmoji(value: string): string[] {
  const SegmenterCtor = (Intl as unknown as IntlWithSegmenter).Segmenter;
  if (SegmenterCtor) {
    const segmenter = new SegmenterCtor(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), (s) => s.segment);
  }
  return Array.from(value);
}

function EmojiClueBox({
  emoji,
  size = 64,
  onClick,
}: {
  emoji: string;
  size?: number;
  onClick?: () => void;
}) {
  const units = splitEmoji(emoji);
  const many = units.length >= 3;
  return (
    <Box
      onClick={onClick}
      sx={{
        width: size, height: size, flexShrink: 0, borderRadius: "8px", overflow: "hidden",
        backgroundColor: "#fff", border: "1px solid #eee",
        cursor: onClick ? "zoom-in" : "default",
        display: "flex", flexWrap: many ? "wrap" : "nowrap", alignItems: "center", justifyContent: "center",
        alignContent: "center", gap: many ? "2px" : 0, p: many ? "4px" : 0,
      }}
    >
      {units.map((unit, i) => (
        <Typography key={i} sx={{ fontSize: many ? size * 0.24 : size * 0.42, lineHeight: 1 }}>
          {unit}
        </Typography>
      ))}
    </Box>
  );
}

const buildEmptyLevelState = (): LevelState => ({ foundWords: [], revealed: false });

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

  const frutasLabels: Record<FrutasCategoryKey, string> = useMemo(
    () => ({
      frutas: t.categoryFrutas,
      animales: t.categoryAnimales,
    }),
    [t]
  );

  const dayContext = useMemo(
    () => getSopaloDayContext(dayKey, new Date(), currentLanguage, categoryLabels, emojinaloLabels, frutasLabels, t.questionLabel),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayKey, currentLanguage]
  );

  useEffect(() => {
    recordLastPlayed();
  }, []);

  // Se lee una sola vez al montar (lazy initializer) — currentLevelIndex y
  // levelStates arrancan consistentes con la misma foto guardada, para que
  // recargar la página retome exactamente donde quedó (posición del
  // carrousel, palabras encontradas por nivel, y si se reveló cada uno).
  const [initialDayState] = useState(() => getDayState(dayKey, dayContext.scopeKey));

  const [currentLevelIndex, setCurrentLevelIndex] = useState(initialDayState.currentLevelIndex);
  const [levelStates, setLevelStates] = useState<LevelState[]>(initialDayState.levels);
  const [celebrating, setCelebrating] = useState(false);
  const celebrationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Marca de tiempo de la posición actual (se renueva al cambiar de
  // posición y en restartDay), para calcular duration_sec al resolverla.
  const levelStartedAtRef = useRef(Date.now());

  useEffect(() => {
    track("game_start", { mode: dayKey });
    track("level_start", { level: currentLevelIndex + 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    adCreative: revealAdCreative,
    showingAd: showingRevealAd,
    canShowAd: canShowRevealAd,
    loadingAd: loadingRevealAd,
    canConfirmReward: canConfirmReveal,
    secondsUntilCanConfirm: revealWaitSeconds,
    requestAd: requestRevealAd,
    handleAdWatched: handleRevealAdWatched,
    handleAdSkipped: handleRevealAdSkipped,
    handleImageClick: handleRevealImageClick,
  } = useRewardedAd("ensopalo-reveal-rewarded", "ensopalo", currentLanguage, () => {
    setLevelStates((prev) => {
      const next = [...prev];
      next[currentLevelIndex] = { ...next[currentLevelIndex], revealed: true };
      return next;
    });
  }, "reveal_words");

  type ZoomedImage = { kind: "svg"; loader: () => Promise<{ default: ComponentType }> } | { kind: "photo"; src: string } | { kind: "emoji"; emoji: string };
  const [zoomedImage, setZoomedImage] = useState<ZoomedImage | null>(null);

  const level: SopaloRound = dayContext.levels[currentLevelIndex];
  const levelState = levelStates[currentLevelIndex] ?? buildEmptyLevelState();
  const totalWords = totalWordsInLevel(level);
  const levelDone = isLevelComplete(level, levelState);
  const completedCount = countCompletedLevels(dayContext.levels, levelStates);
  const dayDone = completedCount >= LEVELS_PER_DAY;

  // Una grilla por posición, generada una sola vez (no se vuelve a mezclar
  // al ir y volver entre posiciones del carrousel dentro de la misma
  // visita) y cacheada en memoria por índice de nivel.
  const [gridsByLevel, setGridsByLevel] = useState<Record<number, WordSearchGridResult>>({});
  const gridKeysRef = useRef<Record<number, string>>({});

  useEffect(() => {
    const key = levelWordsKey(level);
    if (gridKeysRef.current[currentLevelIndex] === key && gridsByLevel[currentLevelIndex]) return;

    gridKeysRef.current[currentLevelIndex] = key;
    const allWords = level.clues.flatMap((c) => c.words);
    setGridsByLevel((prev) => ({ ...prev, [currentLevelIndex]: generateWordSearchGrid(allWords) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, currentLevelIndex]);

  const grid = gridsByLevel[currentLevelIndex];

  // Persiste después de cada cambio relevante — así un reload en segundo
  // plano (o directamente cerrar la pestaña) no pierde nada.
  useEffect(() => {
    saveDayState(
      dayKey,
      {
        currentLevelIndex,
        levels: levelStates,
        status: deriveStatus(completedCount, LEVELS_PER_DAY),
      },
      dayContext.scopeKey
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevelIndex, levelStates]);

  function goToLevel(index: number) {
    if (index === currentLevelIndex) return;
    levelStartedAtRef.current = Date.now();
    track("level_start", { level: index + 1 });
    setCurrentLevelIndex(index);
    setCelebrating(false);
    if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
  }

  function handleWordFound(word: string) {
    if (levelDone) return;
    setLevelStates((prev) => {
      if (prev[currentLevelIndex].foundWords.includes(word)) return prev;
      const next = [...prev];
      const nextFound = [...next[currentLevelIndex].foundWords, word];
      next[currentLevelIndex] = { ...next[currentLevelIndex], foundWords: nextFound };

      if (nextFound.length >= totalWords) {
        const durationSec = Math.round((Date.now() - levelStartedAtRef.current) / 1000);
        track("level_complete", { level: currentLevelIndex + 1, duration_sec: durationSec, hints_used: next[currentLevelIndex].revealed ? 1 : 0 });
        setCelebrating(true);
        if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
        celebrationTimeoutRef.current = setTimeout(() => setCelebrating(false), CELEBRATION_DURATION_MS);
      }
      return next;
    });
  }

  function restartDay() {
    const emptyLevels = Array.from({ length: LEVELS_PER_DAY }, buildEmptyLevelState);
    setLevelStates(emptyLevels);
    setCurrentLevelIndex(0);
    setCelebrating(false);
    setGridsByLevel({});
    gridKeysRef.current = {};
    saveDayState(dayKey, { currentLevelIndex: 0, levels: emptyLevels, status: "not_started" }, dayContext.scopeKey);
    levelStartedAtRef.current = Date.now();
    track("game_start", { mode: dayKey });
    track("level_start", { level: 1 });
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

  if (!grid) return null;

  return (
    <Layout onBack={() => navigate("/")}>
      <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Carrousel: navega libremente a cualquiera de las 5 posiciones.
            Rojo = todavía no resuelta, verde = las 3 pistas completas. */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          {dayContext.levels.map((lvl, i) => {
            const state = levelStates[i] ?? buildEmptyLevelState();
            const done = isLevelComplete(lvl, state);
            const active = i === currentLevelIndex;
            return (
              <Box
                key={i}
                component="button"
                type="button"
                onClick={() => goToLevel(i)}
                aria-label={`Posición ${i + 1}`}
                sx={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${done ? "#22c55e" : ACCENT}`,
                  backgroundColor: done ? "#22c55e" : active ? ACCENT : "#fff",
                  color: done || active ? "#fff" : ACCENT,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 800, cursor: "pointer",
                  boxShadow: active ? "0 0 0 3px rgba(255,255,255,0.4)" : "none",
                  transition: "background-color 0.2s, border-color 0.2s",
                }}
              >
                {done ? "✓" : i + 1}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 1.75, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {level.clues.map((clue: RoundClue, idx: number) => {
            const clueFoundCount = clue.words.filter((w) => levelState.foundWords.includes(normalizeForGrid(w))).length;
            const clueDone = clueFoundCount === clue.words.length;
            return (
              <Box key={idx} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography sx={{ fontSize: 13, flexShrink: 0 }}>
                    {clueDone ? "✅" : "❌"}
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>
                    {clue.label}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box sx={
                    clue.hideBlanks
                      ? { display: "flex", flexDirection: "column", gap: 0.5, flex: 1, minWidth: 0 }
                      : { display: "flex", alignItems: "center", gap: 1.25, flex: 1, minWidth: 0 }
                  }>
                    {clue.image && (
                      <ImageClueThumb
                        loader={clue.image.loader}
                        size={80}
                        onClick={() => setZoomedImage({ kind: "svg", loader: clue.image!.loader })}
                      />
                    )}
                    {clue.photo && (
                      <PhotoClueThumb
                        src={clue.photo}
                        size={80}
                        onClick={() => setZoomedImage({ kind: "photo", src: clue.photo! })}
                      />
                    )}
                    {clue.emoji && (
                      <EmojiClueBox
                        emoji={clue.emoji}
                        size={80}
                        onClick={() => setZoomedImage({ kind: "emoji", emoji: clue.emoji! })}
                      />
                    )}
                    {clue.text && (
                      <Typography sx={{
                        fontSize: 14, lineHeight: 1.4, color: "#333",
                        // Reserva el alto de 2 líneas (el largo típico de una
                        // pregunta) para que la card no cambie de tamaño según
                        // si esa pregunta puntual entra en 1 línea o 2.
                        minHeight: "2.8em",
                        display: "flex", alignItems: "center",
                        ...(clue.hideBlanks ? {} : { flex: 1, minWidth: 0 }),
                      }}>
                        {clue.text}
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: "12px", rowGap: "4px", minWidth: 0 }}>
                      {clue.words.map((w, i) => {
                        const foundByPlayer = levelState.foundWords.includes(normalizeForGrid(w));
                        return <HangmanWord key={i} word={w} foundByPlayer={foundByPlayer} revealed={levelState.revealed} />;
                      })}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ position: "relative", borderRadius: "16px", overflow: "hidden", backgroundColor: "#fff", p: 1 }}>
          <WordSearchGrid
            grid={grid}
            foundWords={levelState.foundWords}
            onWordFound={handleWordFound}
            disabled={levelDone}
          />

          {celebrating && (
            <Box sx={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
              backgroundColor: "rgba(255,255,255,0.96)", textAlign: "center", px: 2,
            }}>
              <Typography sx={{ fontSize: 40 }}>🎉</Typography>
              <Typography sx={{ fontFamily: "Lobster, cursive", fontSize: 24, color: "#222" }}>{t.successTitle}</Typography>
            </Box>
          )}
        </Box>

        {!levelDone && !levelState.revealed && (
          <Button
            onClick={() => {
              track("hint_used", { level: currentLevelIndex + 1 });
              requestRevealAd();
            }}
            disabled={!canShowRevealAd}
            variant="contained"
            startIcon={<OndemandVideoRoundedIcon />}
            sx={{
              backgroundColor: "#f0b429", color: "#1a1a1a", fontWeight: 800, fontSize: 13,
              py: 1.2, borderRadius: 999, textTransform: "none",
              "&:hover": { backgroundColor: "#d99f1a" },
              "&.Mui-disabled": { backgroundColor: "rgba(240,180,41,0.35)", color: "rgba(26,26,26,0.5)" },
            }}
          >
            {loadingRevealAd ? "..." : t.revealButton}
          </Button>
        )}

        {dayDone && (
          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 40 }}>🏆</Typography>
            <Typography sx={{ fontFamily: "Lobster, cursive", fontSize: 22, color: "#222" }}>{t.dayCompleteTitle}</Typography>
            <Typography sx={{ color: "#666", fontSize: 14 }}>{t.dayCompleteBody(completedCount, LEVELS_PER_DAY)}</Typography>
            <Button onClick={restartDay} variant="contained" sx={{
              backgroundColor: ACCENT, color: "#fff", fontWeight: 800, fontSize: 15,
              py: 1.2, px: 3, borderRadius: 999, textTransform: "none", mt: 1,
            }}>
              {t.playAgainButton}
            </Button>
          </Box>
        )}

        <HowToPlayCollapse title={t.howToPlayTitle} body={t.howToPlayText} />
      </Box>

      <RewardedAdModal
        locale={currentLanguage}
        open={showingRevealAd}
        adCreative={revealAdCreative}
        canConfirmReward={canConfirmReveal}
        secondsUntilCanConfirm={revealWaitSeconds}
        onConfirm={handleRevealAdWatched}
        onSkip={handleRevealAdSkipped}
        onImageClick={handleRevealImageClick}
        confirmLabel={t.rewardedAdConfirmButton}
        skipLabel={t.rewardedAdSkipButton}
        waitLabel={t.rewardedAdWaitLabel}
      />

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
          {zoomedImage?.kind === "emoji" && <EmojiClueBox emoji={zoomedImage.emoji} size={280} />}
        </Box>
      </Modal>
    </Layout>
  );
}
