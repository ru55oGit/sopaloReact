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
  revealButton: string;
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
  howToPlayText: "Cada ronda te muestra una definición y un emoji: tenés que encontrar las dos palabras escondidas en la grilla. Deslizá desde la primera letra de la palabra hasta la última, en línea recta (horizontal, vertical o diagonal). Si te trabás, podés apretar \"Ver anuncio para descubrir las palabras\" y te las mostramos. Completá las 7 rondas para terminar el día.",

  roundLabel: (n, total) => `Ronda ${n}/${total}`,
  definitionLabel: "Definición",
  emojiLabel: "Emoji",
  revealButton: "Ver anuncio para descubrir las palabras",
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
  howToPlayText: "Each round shows you a definition and an emoji: find both hidden words in the grid. Swipe from the word's first letter to its last, in a straight line (horizontal, vertical or diagonal). Stuck? Tap \"Watch an ad to reveal the words\" and we'll show them to you. Complete all 7 rounds to finish the day.",

  roundLabel: (n, total) => `Round ${n}/${total}`,
  definitionLabel: "Definition",
  emojiLabel: "Emoji",
  revealButton: "Watch an ad to reveal the words",
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
  howToPlayText: "Cada rodada mostra uma definição e um emoji: encontre as duas palavras escondidas na grade. Deslize da primeira letra da palavra até a última, em linha reta (horizontal, vertical ou diagonal). Se travar, toque em \"Assistir a um anúncio para revelar as palavras\" e nós te mostramos. Complete as 7 rodadas para terminar o dia.",

  roundLabel: (n, total) => `Rodada ${n}/${total}`,
  definitionLabel: "Definição",
  emojiLabel: "Emoji",
  revealButton: "Assistir a um anúncio para revelar as palavras",
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
  howToPlayText: "Chaque manche te montre une définition et un emoji : trouve les deux mots cachés dans la grille. Glisse depuis la première lettre du mot jusqu'à la dernière, en ligne droite (horizontale, verticale ou diagonale). Bloqué ? Appuie sur « Regarder une pub pour révéler les mots » et on te les montre. Termine les 7 manches pour finir la journée.",

  roundLabel: (n, total) => `Manche ${n}/${total}`,
  definitionLabel: "Définition",
  emojiLabel: "Emoji",
  revealButton: "Regarder une pub pour révéler les mots",
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
  howToPlayText: "Jede Runde zeigt dir eine Definition und ein Emoji: Finde beide versteckten Wörter im Raster. Wische vom ersten bis zum letzten Buchstaben des Wortes in gerader Linie (horizontal, vertikal oder diagonal). Kommst du nicht weiter, tippe auf „Werbung ansehen, um die Wörter aufzudecken“ und wir zeigen sie dir. Schließe alle 7 Runden ab, um den Tag zu beenden.",

  roundLabel: (n, total) => `Runde ${n}/${total}`,
  definitionLabel: "Definition",
  emojiLabel: "Emoji",
  revealButton: "Werbung ansehen, um die Wörter aufzudecken",
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
