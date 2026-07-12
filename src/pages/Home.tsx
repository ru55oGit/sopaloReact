import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Layout from "../components/Layout";
import { useLanguage } from "../i18n/LanguageContext";
import {
  DayKey,
  WEEK_DAYS,
  ROUNDS_PER_DAY,
  getCurrentDayKey,
  getDayState,
  getSopaloStatusLabel,
  isDayAvailable,
} from "../utils/weeklyRoscoState";
import { getSopaloDayContext } from "../data/sopaloRounds";

const ACCENT = "#e74c3c";
const CARD_BG = "#eb6f62";

export default function Home() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const currentDayKey = getCurrentDayKey();
  const [selectedDayKey, setSelectedDayKey] = useState<DayKey>(currentDayKey);

  const dayLabels: Record<DayKey, string> = {
    sun: t.daySun, mon: t.dayMon, tue: t.dayTue, wed: t.dayWed,
    thu: t.dayThu, fri: t.dayFri, sat: t.daySat,
  };
  const statusLabels = { completed: t.statusCompleted, inProgress: t.statusInProgress, notStarted: t.statusNotStarted };

  const nowHour = new Date().getHours();
  const greeting = nowHour < 12 ? t.greetingMorning : nowHour < 20 ? t.greetingAfternoon : t.greetingEvening;

  const selectedDayContext = getSopaloDayContext(selectedDayKey, new Date(), currentLanguage);
  const selectedDayState = getDayState(selectedDayKey, selectedDayContext.scopeKey);

  const getButtonLabel = (status: string): string => {
    if (status === "in_progress") return t.continueGame;
    if (status === "completed") return t.viewResult;
    return t.playButton;
  };

  return (
    <Layout>
      <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{
          color: "#fff", fontWeight: 700, letterSpacing: "1px",
          fontFamily: "Lobster, cursive", textAlign: "center", width: "100%",
        }}>
          {t.appTitle}
        </Typography>

        <Typography variant="h6" sx={{
          color: "rgba(255,255,255,0.64)", fontStyle: "italic",
          letterSpacing: "2px", textAlign: "center", fontSize: { xs: 18, md: 22 },
        }}>
          {t.tagline}
        </Typography>

        <Typography sx={{ color: "#ffe6e6", fontSize: 18, fontWeight: 600 }}>{greeting}</Typography>
        <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700, lineHeight: 1.4 }}>{t.readyToPlay}</Typography>

        {/* Card principal */}
        <Box sx={{ width: "100%", borderRadius: "24px", backgroundColor: CARD_BG, p: 2, boxShadow: "0 12px 24px rgba(0,0,0,0.18)" }}>
          <Box sx={{
            width: "100%", borderRadius: "16px", backgroundColor: "#f3f3f3",
            p: 3, mb: 2, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 1, minHeight: 140,
          }}>
            <Typography sx={{ fontSize: 13, color: "#888", fontWeight: 700 }}>{dayLabels[selectedDayKey].toUpperCase()}</Typography>
            <Typography sx={{ fontSize: 42, fontWeight: 900, color: ACCENT, fontFamily: "monospace" }}>
              {selectedDayState.results.filter((r) => r === "success").length}/{ROUNDS_PER_DAY}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#999" }}>{getSopaloStatusLabel(selectedDayState, statusLabels)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/game?day=${selectedDayKey}`)}
              startIcon={<PlayArrowRoundedIcon sx={{ fontSize: "28px !important" }} />}
              sx={{
                backgroundColor: "#fff", color: ACCENT, fontWeight: 800,
                borderRadius: 999, px: 3, py: 1.4, fontSize: 18,
                boxShadow: "0 0 0 4px rgba(255,255,255,0.35), 0 10px 24px rgba(0,0,0,0.4)",
                "&:hover": { backgroundColor: "#fff" },
              }}
            >
              {getButtonLabel(selectedDayState.status)}
            </Button>
          </Box>
        </Box>

        {/* Semanal */}
        <Box sx={{ borderRadius: "16px", backgroundColor: "#ededed", p: 2, color: "#222" }}>
          <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 2 }}>{t.weeklySection}</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}>
            {WEEK_DAYS.map((day) => {
              const available = isDayAvailable(day.key);
              const dayContext = getSopaloDayContext(day.key, new Date(), currentLanguage);
              const dayState = getDayState(day.key, dayContext.scopeKey);
              const successCount = dayState.results.filter((r) => r === "success").length;

              return (
                <Box
                  key={day.key}
                  onClick={() => available && setSelectedDayKey(day.key)}
                  sx={{
                    borderRadius: "12px", backgroundColor: "#fff",
                    border: selectedDayKey === day.key ? "2px solid #d84331" : "1px solid #d7d7d7",
                    p: 1.5, opacity: available ? 1 : 0.5,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5,
                    cursor: available ? "pointer" : "not-allowed",
                  }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#262a33", alignSelf: "flex-start" }}>
                    {dayLabels[day.key]}
                  </Typography>
                  {available ? (
                    <>
                      <Typography sx={{ fontSize: 26, fontWeight: 900, color: ACCENT, fontFamily: "monospace" }}>
                        {successCount}/{ROUNDS_PER_DAY}
                      </Typography>
                      <Typography sx={{ fontSize: 11, textAlign: "center", color: "#7a7a7a", fontWeight: 700, mb: 1 }}>
                        {getSopaloStatusLabel(dayState, statusLabels)}
                      </Typography>
                    </>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: "#7a7a7a", fontWeight: 700, textAlign: "center", py: 2 }}>
                      {t.unlocksOn} {dayLabels[day.key]}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!available}
                    onClick={(e) => { e.stopPropagation(); navigate(`/game?day=${day.key}`); }}
                    sx={{ mt: "auto", backgroundColor: available ? "#d84331" : "#bcbcbc", borderRadius: 999, fontWeight: 700, fontSize: 11 }}
                  >
                    {available ? getButtonLabel(dayState.status) : t.lockedDay}
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box component="section" sx={{ backgroundColor: "rgba(0,0,0,0.18)", borderRadius: "24px", px: 2, py: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>{t.aboutTitle}</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>{t.aboutText}</Typography>
        </Box>

        <Box component="section" sx={{ backgroundColor: "rgba(0,0,0,0.18)", borderRadius: "24px", px: 2, py: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>{t.howToPlayTitle}</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>{t.howToPlayText}</Typography>
        </Box>
      </Box>
    </Layout>
  );
}
