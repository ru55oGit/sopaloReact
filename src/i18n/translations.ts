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
  daysWithoutPlayingMessage: (days: number) => string;
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
  removeAdsButton: string;
  removeAdsButtonBuying: string;
  aboutTitle: string;
  aboutText: string;
  howToPlayTitle: string;
  howToPlayText: string;
  categoriesTitle: string;
  categoriesText: string;
  faqTitle: string;
  faq: { q: string; a: string }[];

  // Game
  roundLabel: (n: number, total: number) => string;
  questionLabel: string;
  categoryFunkos: string;
  categoryEscudos: string;
  categorySombras: string;
  categoryLogos: string;
  categoryCountry: string;
  categoryCapital: string;
  categoryWhatis: string;
  categoryMovie: string;
  categorySeries: string;
  categoryFrutas: string;
  categoryAnimales: string;
  revealButton: string;
  rewardedAdConfirmButton: string;
  rewardedAdSkipButton: string;
  rewardedAdWaitLabel: (seconds: number) => string;
  successTitle: string;
  nextRoundIn: (s: number) => string;
  dayCompleteTitle: string;
  dayCompleteBody: (found: number, total: number) => string;
  backToHomeButton: string;
  playAgainButton: string;
}

const es: Translation = {
  appTitle: "Ensopalo",
  home: "Inicio",
  playMenu: "Jugar",
  language: "Idioma",
  privacyPolicyLabel: "Política de Privacidad",

  tagline: "buscá · encontrá · ganá",
  greetingMorning: "Buenos días ☀️",
  greetingAfternoon: "Buenas tardes 🌤️",
  greetingEvening: "Buenas noches 🌙",
  daysWithoutPlayingMessage: (days) => `hace ${days} días que no jugás`,
  readyToPlay: "¿Listo para jugar Ensopalo?",
  playButton: "JUGAR",
  continueGame: "CONTINUAR",
  viewResult: "COMPLETADO",
  lockedDay: "BLOQUEADO",
  unlocksOn: "Se habilita el",
  weeklySection: "Semanal",
  statusCompleted: "Completado",
  statusInProgress: "En progreso",
  statusNotStarted: "Sin jugar",
  daySun: "Domingo", dayMon: "Lunes", dayTue: "Martes", dayWed: "Miércoles",
  dayThu: "Jueves", dayFri: "Viernes", daySat: "Sábado",
  removeAdsButton: "Sacar los anuncios",
  removeAdsButtonBuying: "Redirigiendo a MercadoPago...",
  aboutTitle: "¿Qué es Ensopalo?",
  aboutText: "Ensopalo es la sopa de letras diaria de Boludeando. Cada día trae 4 rondas distintas: Funkos, Escudos, Sombras y Logos para adivinar a partir de una imagen; Emojinalo, donde un emoji esconde un país, una capital, una palabra, una película o una serie; Frutas y Animales, para identificar la foto; y Preguntas, cuatro de trivia contrarreloj. En cada pista hay que encontrar la palabra escondida en la grilla, deslizando el dedo desde la primera letra hasta la última.",
  howToPlayTitle: "¿Cómo jugar?",
  howToPlayText: "Elegí un día de la semana y arrancá: vas a pasar por las 4 rondas del día en orden (Funkos/Escudos/Sombras/Logos, Emojinalo, Frutas y Animales, Preguntas). En cada pista buscá la palabra en la grilla de letras y deslizá el dedo desde la primera letra hasta la última, en línea recta (horizontal, vertical o diagonal). Si te trabás, podés apretar \"Ver anuncio para descubrir las palabras\" y te las mostramos. Completá las 4 rondas para terminar el día — los domingos arranca una semana nueva con desafíos distintos.",
  categoriesTitle: "Las 4 rondas de cada día",
  categoriesText: "Funkos, Escudos, Sombras y Logos: mirá la imagen y adiviná qué personaje, club, silueta o marca es.\nEmojinalo: un emoji te da la pista — puede esconder un país, su capital, una palabra cualquiera, una película o una serie.\nFrutas y Animales: identificá la fruta, verdura o animal de la foto.\nPreguntas: cuatro preguntas de cultura general, cine, historia y más, contra el reloj.",
  faqTitle: "Preguntas frecuentes",
  faq: [
    { q: "¿Ensopalo es gratis?", a: "Sí, jugar a Ensopalo es completamente gratis. La app se sostiene con publicidad, nunca vas a tener que pagar para jugar." },
    { q: "¿Necesito crear una cuenta?", a: "No. Tu progreso se guarda en este dispositivo automáticamente, no hace falta registrarse ni iniciar sesión." },
    { q: "¿Puedo jugar todos los días?", a: "Sí. Cada semana se desbloquean los días de domingo a sábado a medida que van llegando, y siempre podés volver a jugar los días que ya pasaron. Cada semana trae contenido nuevo en las 4 rondas." },
    { q: "¿Qué pasa si me quedo trabado en una palabra?", a: "Podés tocar \"Ver anuncio para descubrir las palabras\" en cualquier ronda y te mostramos las respuestas para poder seguir." },
    { q: "¿En qué idiomas puedo jugar?", a: "Ensopalo está disponible en español, inglés, portugués, francés y alemán. Podés cambiar el idioma desde el selector de la parte de abajo de esta pantalla." },
  ],

  roundLabel: (n, total) => `Ronda ${n}/${total}`,
  questionLabel: "Pregunta",
  categoryFunkos: "Funkos",
  categoryEscudos: "Escudos",
  categorySombras: "Sombras",
  categoryLogos: "Logos",
  categoryCountry: "País",
  categoryCapital: "Capital",
  categoryWhatis: "Qué es",
  categoryMovie: "Película",
  categorySeries: "Serie",
  categoryFrutas: "Frutas y Vegetales",
  categoryAnimales: "Animales",
  revealButton: "Ver anuncio para descubrir las palabras",
  rewardedAdConfirmButton: "Reclamar recompensa",
  rewardedAdSkipButton: "Cerrar",
  rewardedAdWaitLabel: (seconds) => `Esperá ${seconds}s...`,
  successTitle: "¡Muy bien!",
  nextRoundIn: (s) => `Siguiente ronda en ${s}...`,
  dayCompleteTitle: "¡Día completo!",
  dayCompleteBody: (found, total) => `Encontraste ${found} de ${total} pares.`,
  backToHomeButton: "Volver al inicio",
  playAgainButton: "Jugar de nuevo",
};

const en: Translation = {
  appTitle: "Ensopalo",
  home: "Home",
  playMenu: "Play",
  language: "Language",
  privacyPolicyLabel: "Privacy Policy",

  tagline: "search · find · win",
  greetingMorning: "Good morning ☀️",
  greetingAfternoon: "Good afternoon 🌤️",
  greetingEvening: "Good evening 🌙",
  daysWithoutPlayingMessage: (days) => `it's been ${days} days since you last played`,
  readyToPlay: "Ready to play Ensopalo?",
  playButton: "PLAY",
  continueGame: "CONTINUE",
  viewResult: "COMPLETED",
  lockedDay: "LOCKED",
  unlocksOn: "Unlocks on",
  weeklySection: "Weekly",
  statusCompleted: "Completed",
  statusInProgress: "In progress",
  statusNotStarted: "Not played",
  daySun: "Sunday", dayMon: "Monday", dayTue: "Tuesday", dayWed: "Wednesday",
  dayThu: "Thursday", dayFri: "Friday", daySat: "Saturday",
  removeAdsButton: "Remove ads",
  removeAdsButtonBuying: "Redirecting to MercadoPago...",
  aboutTitle: "What is Ensopalo?",
  aboutText: "Ensopalo is Boludeando's daily word search. Every day brings 4 different rounds: Funkos, Shields, Shadows and Logos, where you guess from a picture; Emojinalo, where an emoji hides a country, a capital, a word, a movie or a series; Fruits and Animals, where you identify the photo; and Questions, four trivia questions against the clock. In every clue you have to find the hidden word in the grid by swiping from the first letter to the last.",
  howToPlayTitle: "How to play?",
  howToPlayText: "Pick a day of the week and start: you'll go through the day's 4 rounds in order (Funkos/Shields/Shadows/Logos, Emojinalo, Fruits and Animals, Questions). For each clue, look for the word in the letter grid and swipe from its first letter to its last, in a straight line (horizontal, vertical or diagonal). Stuck? Tap \"Watch an ad to reveal the words\" and we'll show them to you. Complete all 4 rounds to finish the day — a new week with different challenges starts every Sunday.",
  categoriesTitle: "The 4 rounds of every day",
  categoriesText: "Funkos, Shields, Shadows and Logos: look at the picture and guess which character, club, silhouette or brand it is.\nEmojinalo: an emoji is your clue — it can hide a country, its capital, any word, a movie or a series.\nFruits and Animals: identify the fruit, vegetable or animal in the photo.\nQuestions: four trivia questions about pop culture, movies, history and more, against the clock.",
  faqTitle: "Frequently asked questions",
  faq: [
    { q: "Is Ensopalo free?", a: "Yes, playing Ensopalo is completely free. The app runs on ads, so you'll never have to pay to play." },
    { q: "Do I need to create an account?", a: "No. Your progress is saved automatically on this device — no sign-up or login required." },
    { q: "Can I play every day?", a: "Yes. Every week, the days from Sunday through Saturday unlock as they arrive, and you can always go back and play days you missed. Every week brings new content across the 4 rounds." },
    { q: "What if I get stuck on a word?", a: "You can tap \"Watch an ad to reveal the words\" in any round and we'll show you the answers so you can keep going." },
    { q: "What languages can I play in?", a: "Ensopalo is available in Spanish, English, Portuguese, French and German. You can switch languages from the selector at the bottom of this screen." },
  ],

  roundLabel: (n, total) => `Round ${n}/${total}`,
  questionLabel: "Question",
  categoryFunkos: "Funkos",
  categoryEscudos: "Crests",
  categorySombras: "Shadows",
  categoryLogos: "Logos",
  categoryCountry: "Country",
  categoryCapital: "Capital",
  categoryWhatis: "What is it",
  categoryMovie: "Movie",
  categorySeries: "TV Show",
  categoryFrutas: "Fruits & Veggies",
  categoryAnimales: "Animals",
  revealButton: "Watch an ad to reveal the words",
  rewardedAdConfirmButton: "Claim reward",
  rewardedAdSkipButton: "Close",
  rewardedAdWaitLabel: (seconds) => `Wait ${seconds}s...`,
  successTitle: "Well done!",
  nextRoundIn: (s) => `Next round in ${s}...`,
  dayCompleteTitle: "Day complete!",
  dayCompleteBody: (found, total) => `You found ${found} of ${total} pairs.`,
  backToHomeButton: "Back to home",
  playAgainButton: "Play again",
};

const pt: Translation = {
  appTitle: "Ensopalo",
  home: "Início",
  playMenu: "Jogar",
  language: "Idioma",
  privacyPolicyLabel: "Política de Privacidade",

  tagline: "busque · encontre · vença",
  greetingMorning: "Bom dia ☀️",
  greetingAfternoon: "Boa tarde 🌤️",
  greetingEvening: "Boa noite 🌙",
  daysWithoutPlayingMessage: (days) => `faz ${days} dias que você não joga`,
  readyToPlay: "Pronto para jogar Ensopalo?",
  playButton: "JOGAR",
  continueGame: "CONTINUAR",
  viewResult: "COMPLETO",
  lockedDay: "BLOQUEADO",
  unlocksOn: "Libera em",
  weeklySection: "Semanal",
  statusCompleted: "Completo",
  statusInProgress: "Em andamento",
  statusNotStarted: "Não jogado",
  daySun: "Domingo", dayMon: "Segunda", dayTue: "Terça", dayWed: "Quarta",
  dayThu: "Quinta", dayFri: "Sexta", daySat: "Sábado",
  removeAdsButton: "Remover anúncios",
  removeAdsButtonBuying: "Redirecionando para o MercadoPago...",
  aboutTitle: "O que é o Ensopalo?",
  aboutText: "Ensopalo é o caça-palavras diário do Boludeando. Todo dia traz 4 rodadas diferentes: Funkos, Escudos, Sombras e Logos, onde você adivinha a partir de uma imagem; Emojinalo, em que um emoji esconde um país, uma capital, uma palavra, um filme ou uma série; Frutas e Animais, para identificar a foto; e Perguntas, quatro de trivia contra o tempo. Em cada pista você precisa encontrar a palavra escondida na grade, deslizando o dedo da primeira letra até a última.",
  howToPlayTitle: "Como jogar?",
  howToPlayText: "Escolha um dia da semana e comece: você vai passar pelas 4 rodadas do dia em ordem (Funkos/Escudos/Sombras/Logos, Emojinalo, Frutas e Animais, Perguntas). Em cada pista, procure a palavra na grade de letras e deslize o dedo da primeira letra até a última, em linha reta (horizontal, vertical ou diagonal). Se travar, toque em \"Assistir a um anúncio para revelar as palavras\" e nós te mostramos. Complete as 4 rodadas para terminar o dia — todo domingo começa uma semana nova com desafios diferentes.",
  categoriesTitle: "As 4 rodadas de cada dia",
  categoriesText: "Funkos, Escudos, Sombras e Logos: olhe a imagem e adivinhe qual personagem, clube, silhueta ou marca é.\nEmojinalo: um emoji é a sua pista — pode esconder um país, sua capital, qualquer palavra, um filme ou uma série.\nFrutas e Animais: identifique a fruta, verdura ou animal da foto.\nPerguntas: quatro perguntas de cultura geral, cinema, história e mais, contra o tempo.",
  faqTitle: "Perguntas frequentes",
  faq: [
    { q: "O Ensopalo é grátis?", a: "Sim, jogar Ensopalo é totalmente grátis. O app se sustenta com publicidade, você nunca vai precisar pagar para jogar." },
    { q: "Preciso criar uma conta?", a: "Não. Seu progresso é salvo automaticamente neste dispositivo, não precisa se cadastrar nem fazer login." },
    { q: "Posso jogar todos os dias?", a: "Sim. Toda semana os dias de domingo a sábado são desbloqueados conforme vão chegando, e você sempre pode voltar e jogar os dias que já passaram. Toda semana traz conteúdo novo nas 4 rodadas." },
    { q: "O que acontece se eu travar numa palavra?", a: "Você pode tocar em \"Assistir a um anúncio para revelar as palavras\" em qualquer rodada e mostramos as respostas para você continuar." },
    { q: "Em quais idiomas posso jogar?", a: "O Ensopalo está disponível em espanhol, inglês, português, francês e alemão. Você pode trocar o idioma no seletor na parte de baixo desta tela." },
  ],

  roundLabel: (n, total) => `Rodada ${n}/${total}`,
  questionLabel: "Pergunta",
  categoryFunkos: "Funkos",
  categoryEscudos: "Escudos",
  categorySombras: "Sombras",
  categoryLogos: "Logos",
  categoryCountry: "País",
  categoryCapital: "Capital",
  categoryWhatis: "O que é",
  categoryMovie: "Filme",
  categorySeries: "Série",
  categoryFrutas: "Frutas e Vegetais",
  categoryAnimales: "Animais",
  revealButton: "Assistir a um anúncio para revelar as palavras",
  rewardedAdConfirmButton: "Resgatar recompensa",
  rewardedAdSkipButton: "Fechar",
  rewardedAdWaitLabel: (seconds) => `Espere ${seconds}s...`,
  successTitle: "Muito bem!",
  nextRoundIn: (s) => `Próxima rodada em ${s}...`,
  dayCompleteTitle: "Dia completo!",
  dayCompleteBody: (found, total) => `Você encontrou ${found} de ${total} pares.`,
  backToHomeButton: "Voltar ao início",
  playAgainButton: "Jogar de novo",
};

const fr: Translation = {
  appTitle: "Ensopalo",
  home: "Accueil",
  playMenu: "Jouer",
  language: "Langue",
  privacyPolicyLabel: "Politique de confidentialité",

  tagline: "cherche · trouve · gagne",
  greetingMorning: "Bonjour ☀️",
  greetingAfternoon: "Bon après-midi 🌤️",
  greetingEvening: "Bonsoir 🌙",
  daysWithoutPlayingMessage: (days) => `ça fait ${days} jours que tu n'as pas joué`,
  readyToPlay: "Prêt à jouer à Ensopalo ?",
  playButton: "JOUER",
  continueGame: "CONTINUER",
  viewResult: "TERMINÉ",
  lockedDay: "VERROUILLÉ",
  unlocksOn: "Se débloque le",
  weeklySection: "Hebdomadaire",
  statusCompleted: "Terminé",
  statusInProgress: "En cours",
  statusNotStarted: "Pas joué",
  daySun: "Dimanche", dayMon: "Lundi", dayTue: "Mardi", dayWed: "Mercredi",
  dayThu: "Jeudi", dayFri: "Vendredi", daySat: "Samedi",
  removeAdsButton: "Retirer les publicités",
  removeAdsButtonBuying: "Redirection vers MercadoPago...",
  aboutTitle: "Qu'est-ce que Ensopalo ?",
  aboutText: "Ensopalo est la grille de mots mêlés quotidienne de Boludeando. Chaque jour propose 4 manches différentes : Funkos, Écussons, Ombres et Logos, où tu devines à partir d'une image ; Emojinalo, où un emoji cache un pays, une capitale, un mot, un film ou une série ; Fruits et Animaux, pour identifier la photo ; et Questions, quatre questions de culture générale contre la montre. Pour chaque indice, il faut trouver le mot caché dans la grille en glissant du doigt depuis la première lettre jusqu'à la dernière.",
  howToPlayTitle: "Comment jouer ?",
  howToPlayText: "Choisis un jour de la semaine et commence : tu vas passer par les 4 manches du jour dans l'ordre (Funkos/Écussons/Ombres/Logos, Emojinalo, Fruits et Animaux, Questions). Pour chaque indice, cherche le mot dans la grille de lettres et glisse du doigt depuis sa première lettre jusqu'à sa dernière, en ligne droite (horizontale, verticale ou diagonale). Bloqué ? Appuie sur « Regarder une pub pour révéler les mots » et on te les montre. Termine les 4 manches pour finir la journée — une nouvelle semaine avec des défis différents commence chaque dimanche.",
  categoriesTitle: "Les 4 manches de chaque jour",
  categoriesText: "Funkos, Écussons, Ombres et Logos : regarde l'image et devine de quel personnage, club, silhouette ou marque il s'agit.\nEmojinalo : un emoji est ton indice — il peut cacher un pays, sa capitale, n'importe quel mot, un film ou une série.\nFruits et Animaux : identifie le fruit, le légume ou l'animal de la photo.\nQuestions : quatre questions de culture générale, cinéma, histoire et plus, contre la montre.",
  faqTitle: "Questions fréquentes",
  faq: [
    { q: "Ensopalo est-il gratuit ?", a: "Oui, jouer à Ensopalo est totalement gratuit. L'appli fonctionne grâce à la publicité, tu n'auras jamais à payer pour jouer." },
    { q: "Dois-je créer un compte ?", a: "Non. Ta progression est enregistrée automatiquement sur cet appareil, pas besoin de t'inscrire ni de te connecter." },
    { q: "Puis-je jouer tous les jours ?", a: "Oui. Chaque semaine, les jours du dimanche au samedi se débloquent au fur et à mesure, et tu peux toujours revenir jouer les jours déjà passés. Chaque semaine apporte du nouveau contenu dans les 4 manches." },
    { q: "Que se passe-t-il si je bloque sur un mot ?", a: "Tu peux appuyer sur « Regarder une pub pour révéler les mots » dans n'importe quelle manche, et on t'affiche les réponses pour continuer." },
    { q: "Dans quelles langues puis-je jouer ?", a: "Ensopalo est disponible en espagnol, anglais, portugais, français et allemand. Tu peux changer de langue depuis le sélecteur en bas de cet écran." },
  ],

  roundLabel: (n, total) => `Manche ${n}/${total}`,
  questionLabel: "Question",
  categoryFunkos: "Funkos",
  categoryEscudos: "Écussons",
  categorySombras: "Ombres",
  categoryLogos: "Logos",
  categoryCountry: "Pays",
  categoryCapital: "Capitale",
  categoryWhatis: "Qu'est-ce que c'est",
  categoryMovie: "Film",
  categorySeries: "Série",
  categoryFrutas: "Fruits et Légumes",
  categoryAnimales: "Animaux",
  revealButton: "Regarder une pub pour révéler les mots",
  rewardedAdConfirmButton: "Réclamer la récompense",
  rewardedAdSkipButton: "Fermer",
  rewardedAdWaitLabel: (seconds) => `Attends ${seconds}s...`,
  successTitle: "Bien joué !",
  nextRoundIn: (s) => `Manche suivante dans ${s}...`,
  dayCompleteTitle: "Journée terminée !",
  dayCompleteBody: (found, total) => `Tu as trouvé ${found} sur ${total} paires.`,
  backToHomeButton: "Retour à l'accueil",
  playAgainButton: "Rejouer",
};

const de: Translation = {
  appTitle: "Ensopalo",
  home: "Start",
  playMenu: "Spielen",
  language: "Sprache",
  privacyPolicyLabel: "Datenschutzrichtlinie",

  tagline: "such · find · gewinn",
  greetingMorning: "Guten Morgen ☀️",
  greetingAfternoon: "Guten Tag 🌤️",
  greetingEvening: "Guten Abend 🌙",
  daysWithoutPlayingMessage: (days) => `du hast seit ${days} Tagen nicht gespielt`,
  readyToPlay: "Bereit, Ensopalo zu spielen?",
  playButton: "SPIELEN",
  continueGame: "WEITER",
  viewResult: "ABGESCHLOSSEN",
  lockedDay: "GESPERRT",
  unlocksOn: "Freigeschaltet am",
  weeklySection: "Wöchentlich",
  statusCompleted: "Abgeschlossen",
  statusInProgress: "In Bearbeitung",
  statusNotStarted: "Nicht gespielt",
  daySun: "Sonntag", dayMon: "Montag", dayTue: "Dienstag", dayWed: "Mittwoch",
  dayThu: "Donnerstag", dayFri: "Freitag", daySat: "Samstag",
  removeAdsButton: "Werbung entfernen",
  removeAdsButtonBuying: "Weiterleitung zu MercadoPago...",
  aboutTitle: "Was ist Ensopalo?",
  aboutText: "Ensopalo ist das tägliche Wortsuchrätsel von Boludeando. Jeden Tag gibt es 4 verschiedene Runden: Funkos, Wappen, Schatten und Logos, bei denen du anhand eines Bildes rätst; Emojinalo, bei dem ein Emoji ein Land, eine Hauptstadt, ein Wort, einen Film oder eine Serie versteckt; Obst und Tiere, um das Foto zu erkennen; und Fragen, vier Quizfragen gegen die Zeit. Bei jedem Hinweis musst du das versteckte Wort im Raster finden, indem du vom ersten bis zum letzten Buchstaben wischst.",
  howToPlayTitle: "Wie spielt man?",
  howToPlayText: "Wähle einen Wochentag und leg los: Du durchläufst die 4 Runden des Tages der Reihe nach (Funkos/Wappen/Schatten/Logos, Emojinalo, Obst und Tiere, Fragen). Suche bei jedem Hinweis das Wort im Buchstabenraster und wische vom ersten bis zum letzten Buchstaben in gerader Linie (horizontal, vertikal oder diagonal). Kommst du nicht weiter, tippe auf „Werbung ansehen, um die Wörter aufzudecken“ und wir zeigen sie dir. Schließe alle 4 Runden ab, um den Tag zu beenden — jeden Sonntag beginnt eine neue Woche mit neuen Herausforderungen.",
  categoriesTitle: "Die 4 Runden jedes Tages",
  categoriesText: "Funkos, Wappen, Schatten und Logos: Schau dir das Bild an und rate, welcher Charakter, Verein, welche Silhouette oder Marke es ist.\nEmojinalo: Ein Emoji ist dein Hinweis — es kann ein Land, dessen Hauptstadt, ein beliebiges Wort, einen Film oder eine Serie verstecken.\nObst und Tiere: Erkenne das Obst, Gemüse oder Tier auf dem Foto.\nFragen: Vier Quizfragen zu Popkultur, Filmen, Geschichte und mehr, gegen die Zeit.",
  faqTitle: "Häufig gestellte Fragen",
  faq: [
    { q: "Ist Ensopalo kostenlos?", a: "Ja, Ensopalo zu spielen ist komplett kostenlos. Die App finanziert sich über Werbung, du musst nie fürs Spielen bezahlen." },
    { q: "Muss ich ein Konto erstellen?", a: "Nein. Dein Fortschritt wird automatisch auf diesem Gerät gespeichert, keine Registrierung oder Anmeldung nötig." },
    { q: "Kann ich jeden Tag spielen?", a: "Ja. Jede Woche werden die Tage von Sonntag bis Samstag nach und nach freigeschaltet, und du kannst jederzeit zurückgehen und bereits vergangene Tage spielen. Jede Woche gibt es neue Inhalte in den 4 Runden." },
    { q: "Was passiert, wenn ich bei einem Wort nicht weiterkomme?", a: "Du kannst in jeder Runde auf „Werbung ansehen, um die Wörter aufzudecken“ tippen, und wir zeigen dir die Antworten, damit du weitermachen kannst." },
    { q: "In welchen Sprachen kann ich spielen?", a: "Ensopalo ist auf Spanisch, Englisch, Portugiesisch, Französisch und Deutsch verfügbar. Du kannst die Sprache über die Auswahl am unteren Bildschirmrand wechseln." },
  ],

  roundLabel: (n, total) => `Runde ${n}/${total}`,
  questionLabel: "Frage",
  categoryFunkos: "Funkos",
  categoryEscudos: "Wappen",
  categorySombras: "Schatten",
  categoryLogos: "Logos",
  categoryCountry: "Land",
  categoryCapital: "Hauptstadt",
  categoryWhatis: "Was ist das",
  categoryMovie: "Film",
  categorySeries: "Serie",
  categoryFrutas: "Obst & Gemüse",
  categoryAnimales: "Tiere",
  revealButton: "Werbung ansehen, um die Wörter aufzudecken",
  rewardedAdConfirmButton: "Belohnung einlösen",
  rewardedAdSkipButton: "Schließen",
  rewardedAdWaitLabel: (seconds) => `Warte ${seconds}s...`,
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
  // fr/de ocultos del selector (siguen soportados en `translations`, solo no se ofrecen en la UI)
  // { code: "fr", name: "Français", flag: "🇫🇷" },
  // { code: "de", name: "Deutsch", flag: "🇩🇪" },
];
