export type SupportedLanguage = "es" | "en" | "pt" | "fr" | "de";

export interface Translation {
  // Layout
  appTitle: string;
  home: string;
  playMenu: string;
  language: string;
  privacyPolicyLabel: string;

  // Home
  tagline: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  readyToPlay: string;
  playButton: string;
  continueGame: string;
  viewResult: string;
  lockedDay: string;
  unlocksOn: string;
  weeklySection: string;
  statusCompleted: string;
  statusInProgress: string;
  statusNotStarted: string;
  daySun: string;
  dayMon: string;
  dayTue: string;
  dayWed: string;
  dayThu: string;
  dayFri: string;
  daySat: string;
  aboutTitle: string;
  aboutText: string;
  howToPlayTitle: string;
  howToPlayText: string;

  // Game
  roundLabel: (n: number, total: number) => string;
  definitionLabel: string;
  emojiLabel: string;
  startRoundButton: string;
  foundLabel: string;
  timeUpTitle: string;
  successTitle: string;
  nextRoundIn: (s: number) => string;
  dayCompleteTitle: string;
  dayCompleteBody: (found: number, total: number) => string;
  backToHomeButton: string;
  playAgainButton: string;
}

const es: Translation = {
  appTitle: "Sopalo",
  home: "Inicio",
  playMenu: "Jugar",
  language: "Idioma",
  privacyPolicyLabel: "Política de Privacidad",

  tagline: "buscá · encontrá · ganá",
  greetingMorning: "Buenos días",
  greetingAfternoon: "Buenas tardes",
  greetingEvening: "Buenas noches",
  readyToPlay: "¿Listo para jugar Sopalo?",
  playButton: "JUGAR",
  continueGame: "CONTINUAR",
  viewResult: "VER RESULTADO",
  lockedDay: "BLOQUEADO",
  unlocksOn: "Se habilita el",
  weeklySection: "Semanal",
  statusCompleted: "Completado",
  statusInProgress: "En progreso",
  statusNotStarted: "Sin jugar",
  daySun: "Domingo", dayMon: "Lunes", dayTue: "Martes", dayWed: "Miércoles",
  dayThu: "Jueves", dayFri: "Viernes", daySat: "Sábado",
  aboutTitle: "¿Qué es Sopalo?",
  aboutText: "Sopalo es la sopa de letras diaria. Cada ronda te da una definición y un emoji: tenés que encontrar las dos palabras escondidas en la grilla, deslizando el dedo desde la primera letra hasta la última. Cada día trae 7 rondas nuevas, contrarreloj.",
  howToPlayTitle: "¿Cómo jugar?",
  howToPlayText: "Apretá Comenzar y arranca el cronómetro: tenés 30 segundos para encontrar las dos palabras. Deslizá desde la primera letra de la palabra hasta la última, en línea recta (horizontal, vertical o diagonal). Si se acaba el tiempo, pasás a la siguiente ronda en 5 segundos. Completá las 7 rondas para terminar el día.",

  roundLabel: (n, total) => `Ronda ${n}/${total}`,
  definitionLabel: "Definición",
  emojiLabel: "Emoji",
  startRoundButton: "¡Comenzar!",
  foundLabel: "¡Encontrada!",
  timeUpTitle: "¡Se acabó el tiempo!",
  successTitle: "¡Muy bien!",
  nextRoundIn: (s) => `Siguiente ronda en ${s}...`,
  dayCompleteTitle: "¡Día completo!",
  dayCompleteBody: (found, total) => `Encontraste ${found} de ${total} pares.`,
  backToHomeButton: "Volver al inicio",
  playAgainButton: "Jugar de nuevo",
};

const en: Translation = {
  appTitle: "Sopalo",
  home: "Home",
  playMenu: "Play",
  language: "Language",
  privacyPolicyLabel: "Privacy Policy",

  tagline: "search · find · win",
  greetingMorning: "Good morning",
  greetingAfternoon: "Good afternoon",
  greetingEvening: "Good evening",
  readyToPlay: "Ready to play Sopalo?",
  playButton: "PLAY",
  continueGame: "CONTINUE",
  viewResult: "VIEW RESULT",
  lockedDay: "LOCKED",
  unlocksOn: "Unlocks on",
  weeklySection: "Weekly",
  statusCompleted: "Completed",
  statusInProgress: "In progress",
  statusNotStarted: "Not played",
  daySun: "Sunday", dayMon: "Monday", dayTue: "Tuesday", dayWed: "Wednesday",
  dayThu: "Thursday", dayFri: "Friday", daySat: "Saturday",
  aboutTitle: "What is Sopalo?",
  aboutText: "Sopalo is the daily word search. Each round gives you a definition and an emoji: find both hidden words in the grid by swiping from the first letter to the last. Every day brings 7 new rounds, against the clock.",
  howToPlayTitle: "How to play?",
  howToPlayText: "Tap Start and the timer begins: you have 30 seconds to find both words. Swipe from the word's first letter to its last, in a straight line (horizontal, vertical or diagonal). If time runs out, you move to the next round in 5 seconds. Complete all 7 rounds to finish the day.",

  roundLabel: (n, total) => `Round ${n}/${total}`,
  definitionLabel: "Definition",
  emojiLabel: "Emoji",
  startRoundButton: "Start!",
  foundLabel: "Found!",
  timeUpTitle: "Time's up!",
  successTitle: "Well done!",
  nextRoundIn: (s) => `Next round in ${s}...`,
  dayCompleteTitle: "Day complete!",
  dayCompleteBody: (found, total) => `You found ${found} of ${total} pairs.`,
  backToHomeButton: "Back to home",
  playAgainButton: "Play again",
};

const pt: Translation = {
  appTitle: "Sopalo",
  home: "Início",
  playMenu: "Jogar",
  language: "Idioma",
  privacyPolicyLabel: "Política de Privacidade",

  tagline: "busque · encontre · vença",
  greetingMorning: "Bom dia",
  greetingAfternoon: "Boa tarde",
  greetingEvening: "Boa noite",
  readyToPlay: "Pronto para jogar Sopalo?",
  playButton: "JOGAR",
  continueGame: "CONTINUAR",
  viewResult: "VER RESULTADO",
  lockedDay: "BLOQUEADO",
  unlocksOn: "Libera em",
  weeklySection: "Semanal",
  statusCompleted: "Completo",
  statusInProgress: "Em andamento",
  statusNotStarted: "Não jogado",
  daySun: "Domingo", dayMon: "Segunda", dayTue: "Terça", dayWed: "Quarta",
  dayThu: "Quinta", dayFri: "Sexta", daySat: "Sábado",
  aboutTitle: "O que é o Sopalo?",
  aboutText: "Sopalo é o caça-palavras diário. Cada rodada te dá uma definição e um emoji: encontre as duas palavras escondidas na grade, deslizando o dedo da primeira letra até a última. Todo dia traz 7 rodadas novas, contra o tempo.",
  howToPlayTitle: "Como jogar?",
  howToPlayText: "Toque em Começar e o cronômetro inicia: você tem 30 segundos para encontrar as duas palavras. Deslize da primeira letra da palavra até a última, em linha reta (horizontal, vertical ou diagonal). Se o tempo acabar, você passa para a próxima rodada em 5 segundos. Complete as 7 rodadas para terminar o dia.",

  roundLabel: (n, total) => `Rodada ${n}/${total}`,
  definitionLabel: "Definição",
  emojiLabel: "Emoji",
  startRoundButton: "Começar!",
  foundLabel: "Encontrada!",
  timeUpTitle: "Tempo esgotado!",
  successTitle: "Muito bem!",
  nextRoundIn: (s) => `Próxima rodada em ${s}...`,
  dayCompleteTitle: "Dia completo!",
  dayCompleteBody: (found, total) => `Você encontrou ${found} de ${total} pares.`,
  backToHomeButton: "Voltar ao início",
  playAgainButton: "Jogar de novo",
};

const fr: Translation = {
  appTitle: "Sopalo",
  home: "Accueil",
  playMenu: "Jouer",
  language: "Langue",
  privacyPolicyLabel: "Politique de confidentialité",

  tagline: "cherche · trouve · gagne",
  greetingMorning: "Bonjour",
  greetingAfternoon: "Bon après-midi",
  greetingEvening: "Bonsoir",
  readyToPlay: "Prêt à jouer à Sopalo ?",
  playButton: "JOUER",
  continueGame: "CONTINUER",
  viewResult: "VOIR LE RÉSULTAT",
  lockedDay: "VERROUILLÉ",
  unlocksOn: "Se débloque le",
  weeklySection: "Hebdomadaire",
  statusCompleted: "Terminé",
  statusInProgress: "En cours",
  statusNotStarted: "Pas joué",
  daySun: "Dimanche", dayMon: "Lundi", dayTue: "Mardi", dayWed: "Mercredi",
  dayThu: "Jeudi", dayFri: "Vendredi", daySat: "Samedi",
  aboutTitle: "Qu'est-ce que Sopalo ?",
  aboutText: "Sopalo est la grille de mots mêlés quotidienne. Chaque manche te donne une définition et un emoji : trouve les deux mots cachés dans la grille en glissant du doigt depuis la première lettre jusqu'à la dernière. Chaque jour apporte 7 nouvelles manches, contre la montre.",
  howToPlayTitle: "Comment jouer ?",
  howToPlayText: "Appuie sur Commencer et le chronomètre démarre : tu as 30 secondes pour trouver les deux mots. Glisse depuis la première lettre du mot jusqu'à la dernière, en ligne droite (horizontale, verticale ou diagonale). Si le temps est écoulé, tu passes à la manche suivante dans 5 secondes. Termine les 7 manches pour finir la journée.",

  roundLabel: (n, total) => `Manche ${n}/${total}`,
  definitionLabel: "Définition",
  emojiLabel: "Emoji",
  startRoundButton: "Commencer !",
  foundLabel: "Trouvé !",
  timeUpTitle: "Temps écoulé !",
  successTitle: "Bien joué !",
  nextRoundIn: (s) => `Manche suivante dans ${s}...`,
  dayCompleteTitle: "Journée terminée !",
  dayCompleteBody: (found, total) => `Tu as trouvé ${found} sur ${total} paires.`,
  backToHomeButton: "Retour à l'accueil",
  playAgainButton: "Rejouer",
};

const de: Translation = {
  appTitle: "Sopalo",
  home: "Start",
  playMenu: "Spielen",
  language: "Sprache",
  privacyPolicyLabel: "Datenschutzrichtlinie",

  tagline: "such · find · gewinn",
  greetingMorning: "Guten Morgen",
  greetingAfternoon: "Guten Tag",
  greetingEvening: "Guten Abend",
  readyToPlay: "Bereit, Sopalo zu spielen?",
  playButton: "SPIELEN",
  continueGame: "WEITER",
  viewResult: "ERGEBNIS ANSEHEN",
  lockedDay: "GESPERRT",
  unlocksOn: "Freigeschaltet am",
  weeklySection: "Wöchentlich",
  statusCompleted: "Abgeschlossen",
  statusInProgress: "In Bearbeitung",
  statusNotStarted: "Nicht gespielt",
  daySun: "Sonntag", dayMon: "Montag", dayTue: "Dienstag", dayWed: "Mittwoch",
  dayThu: "Donnerstag", dayFri: "Freitag", daySat: "Samstag",
  aboutTitle: "Was ist Sopalo?",
  aboutText: "Sopalo ist das tägliche Wortsuchrätsel. Jede Runde gibt dir eine Definition und ein Emoji: Finde beide versteckten Wörter im Raster, indem du vom ersten bis zum letzten Buchstaben wischst. Jeden Tag gibt es 7 neue Runden gegen die Zeit.",
  howToPlayTitle: "Wie spielt man?",
  howToPlayText: "Tippe auf Start und der Timer läuft los: Du hast 30 Sekunden, um beide Wörter zu finden. Wische vom ersten bis zum letzten Buchstaben des Wortes in gerader Linie (horizontal, vertikal oder diagonal). Läuft die Zeit ab, geht es in 5 Sekunden zur nächsten Runde. Schließe alle 7 Runden ab, um den Tag zu beenden.",

  roundLabel: (n, total) => `Runde ${n}/${total}`,
  definitionLabel: "Definition",
  emojiLabel: "Emoji",
  startRoundButton: "Start!",
  foundLabel: "Gefunden!",
  timeUpTitle: "Zeit abgelaufen!",
  successTitle: "Gut gemacht!",
  nextRoundIn: (s) => `Nächste Runde in ${s}...`,
  dayCompleteTitle: "Tag abgeschlossen!",
  dayCompleteBody: (found, total) => `Du hast ${found} von ${total} Paaren gefunden.`,
  backToHomeButton: "Zurück zum Start",
  playAgainButton: "Nochmal spielen",
};

export const translations: Record<SupportedLanguage, Translation> = { es, en, pt, fr, de };

export const availableLanguages: Array<{ code: SupportedLanguage; name: string; flag: string }> = [
  { code: "es", name: "Español", flag: "🇦🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];
