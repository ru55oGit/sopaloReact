import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Layout from "../components/Layout";
import AdsenseScript from "../components/AdsenseScript";
import { useLanguage } from "../i18n/LanguageContext";
import { SupportedLanguage } from "../i18n/translations";

interface PolicyContent {
  title: string;
  intro: string;
  sections: { heading: string; body: ReactNode }[];
}

const linkStyle = { color: "#ffd" };

const content: Record<SupportedLanguage, PolicyContent> = {
  es: {
    title: "Política de Privacidad",
    intro: "En Ensopalo respetamos tu privacidad. Esta política explica qué información se recopila y cómo se usa.",
    sections: [
      { heading: "1. Información que recopilamos", body: "Ensopalo no recopila datos personales. Tu progreso (rondas resueltas, idioma elegido) se guarda localmente en tu dispositivo (localStorage) y no se envía a ningún servidor." },
      {
        heading: "2. Publicidad — Google AdSense",
        body: (
          <>
            Usamos <strong>Google AdSense</strong> para mostrar anuncios. Google puede usar cookies para personalizar los anuncios según tus intereses y el contenido que visitás. Para más información, consultá la{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Política de Privacidad de Google
            </a>. Podés optar por no recibir publicidad personalizada en{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Configuración de anuncios de Google
            </a>.
          </>
        ),
      },
      { heading: "3. Cookies", body: "Este sitio utiliza almacenamiento local del navegador (para guardar tu idioma y progreso) y cookies de terceros de Google AdSense para la entrega de anuncios. Al continuar usando el sitio, aceptás el uso de cookies." },
      { heading: "4. Servicios de terceros", body: "Únicamente utilizamos Google AdSense como servicio de terceros. No compartimos datos con otras empresas ni vendemos información a terceros." },
      { heading: "5. Menores de edad", body: "Este sitio no está dirigido a menores de 13 años ni recopila intencionalmente información de ellos." },
      { heading: "6. Cambios en esta política", body: "Podemos actualizar esta política en cualquier momento. Te recomendamos revisarla periódicamente." },
      {
        heading: "7. Contacto",
        body: (
          <>
            Si tenés preguntas sobre esta política, podés contactarnos en{" "}
            <a href="mailto:patricio.ezequiel.toledo@gmail.com" style={linkStyle}>patricio.ezequiel.toledo@gmail.com</a>.
          </>
        ),
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    intro: "At Ensopalo we respect your privacy. This policy explains what information is collected and how it's used.",
    sections: [
      { heading: "1. Information we collect", body: "Ensopalo does not collect personal data. Your progress (rounds solved, chosen language) is saved locally on your device (localStorage) and is never sent to any server." },
      {
        heading: "2. Advertising — Google AdSense",
        body: (
          <>
            We use <strong>Google AdSense</strong> to display ads. Google may use cookies to personalize ads based on your interests and the content you visit. For more information, see Google's{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Privacy Policy
            </a>. You can opt out of personalized advertising in{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Google Ads Settings
            </a>.
          </>
        ),
      },
      { heading: "3. Cookies", body: "This site uses local browser storage (to save your language and progress) and third-party cookies from Google AdSense to serve ads. By continuing to use the site, you accept the use of cookies." },
      { heading: "4. Third-party services", body: "We only use Google AdSense as a third-party service. We don't share data with other companies or sell information to third parties." },
      { heading: "5. Children", body: "This site is not directed at children under 13 and does not intentionally collect information from them." },
      { heading: "6. Changes to this policy", body: "We may update this policy at any time. We recommend reviewing it periodically." },
      {
        heading: "7. Contact",
        body: (
          <>
            If you have questions about this policy, you can reach us at{" "}
            <a href="mailto:patricio.ezequiel.toledo@gmail.com" style={linkStyle}>patricio.ezequiel.toledo@gmail.com</a>.
          </>
        ),
      },
    ],
  },
  pt: {
    title: "Política de Privacidade",
    intro: "No Ensopalo respeitamos sua privacidade. Esta política explica quais informações são coletadas e como são usadas.",
    sections: [
      { heading: "1. Informações que coletamos", body: "O Ensopalo não coleta dados pessoais. Seu progresso (rodadas resolvidas, idioma escolhido) é salvo localmente no seu dispositivo (localStorage) e nunca é enviado a nenhum servidor." },
      {
        heading: "2. Publicidade — Google AdSense",
        body: (
          <>
            Usamos o <strong>Google AdSense</strong> para exibir anúncios. O Google pode usar cookies para personalizar os anúncios de acordo com seus interesses e o conteúdo que você visita. Para mais informações, consulte a{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Política de Privacidade do Google
            </a>. Você pode optar por não receber publicidade personalizada em{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Configurações de anúncios do Google
            </a>.
          </>
        ),
      },
      { heading: "3. Cookies", body: "Este site utiliza armazenamento local do navegador (para salvar seu idioma e progresso) e cookies de terceiros do Google AdSense para a entrega de anúncios. Ao continuar usando o site, você aceita o uso de cookies." },
      { heading: "4. Serviços de terceiros", body: "Utilizamos apenas o Google AdSense como serviço de terceiros. Não compartilhamos dados com outras empresas nem vendemos informações a terceiros." },
      { heading: "5. Menores de idade", body: "Este site não é direcionado a menores de 13 anos nem coleta intencionalmente informações deles." },
      { heading: "6. Alterações nesta política", body: "Podemos atualizar esta política a qualquer momento. Recomendamos revisá-la periodicamente." },
      {
        heading: "7. Contato",
        body: (
          <>
            Se você tiver dúvidas sobre esta política, pode nos contatar em{" "}
            <a href="mailto:patricio.ezequiel.toledo@gmail.com" style={linkStyle}>patricio.ezequiel.toledo@gmail.com</a>.
          </>
        ),
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    intro: "Chez Ensopalo, nous respectons ta vie privée. Cette politique explique quelles informations sont collectées et comment elles sont utilisées.",
    sections: [
      { heading: "1. Informations que nous collectons", body: "Ensopalo ne collecte aucune donnée personnelle. Ta progression (manches résolues, langue choisie) est enregistrée localement sur ton appareil (localStorage) et n'est jamais envoyée à un serveur." },
      {
        heading: "2. Publicité — Google AdSense",
        body: (
          <>
            Nous utilisons <strong>Google AdSense</strong> pour afficher des publicités. Google peut utiliser des cookies pour personnaliser les publicités selon tes centres d'intérêt et le contenu que tu visites. Pour plus d'informations, consulte la{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Politique de confidentialité de Google
            </a>. Tu peux refuser la publicité personnalisée dans les{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Paramètres des annonces Google
            </a>.
          </>
        ),
      },
      { heading: "3. Cookies", body: "Ce site utilise le stockage local du navigateur (pour enregistrer ta langue et ta progression) et des cookies tiers de Google AdSense pour la diffusion des publicités. En continuant à utiliser le site, tu acceptes l'utilisation de cookies." },
      { heading: "4. Services tiers", body: "Nous utilisons uniquement Google AdSense comme service tiers. Nous ne partageons pas de données avec d'autres entreprises et ne vendons pas d'informations à des tiers." },
      { heading: "5. Mineurs", body: "Ce site ne s'adresse pas aux enfants de moins de 13 ans et ne collecte pas intentionnellement d'informations les concernant." },
      { heading: "6. Modifications de cette politique", body: "Nous pouvons mettre à jour cette politique à tout moment. Nous te recommandons de la consulter périodiquement." },
      {
        heading: "7. Contact",
        body: (
          <>
            Si tu as des questions sur cette politique, tu peux nous contacter à{" "}
            <a href="mailto:patricio.ezequiel.toledo@gmail.com" style={linkStyle}>patricio.ezequiel.toledo@gmail.com</a>.
          </>
        ),
      },
    ],
  },
  de: {
    title: "Datenschutzrichtlinie",
    intro: "Bei Ensopalo respektieren wir deine Privatsphäre. Diese Richtlinie erklärt, welche Informationen gesammelt werden und wie sie verwendet werden.",
    sections: [
      { heading: "1. Informationen, die wir sammeln", body: "Ensopalo sammelt keine personenbezogenen Daten. Dein Fortschritt (gelöste Runden, gewählte Sprache) wird lokal auf deinem Gerät (localStorage) gespeichert und niemals an einen Server gesendet." },
      {
        heading: "2. Werbung — Google AdSense",
        body: (
          <>
            Wir verwenden <strong>Google AdSense</strong>, um Anzeigen zu schalten. Google kann Cookies verwenden, um Anzeigen basierend auf deinen Interessen und den von dir besuchten Inhalten zu personalisieren. Weitere Informationen findest du in Googles{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Datenschutzrichtlinie
            </a>. Du kannst personalisierte Werbung ablehnen in den{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Google-Anzeigeneinstellungen
            </a>.
          </>
        ),
      },
      { heading: "3. Cookies", body: "Diese Seite verwendet lokalen Browser-Speicher (um deine Sprache und deinen Fortschritt zu speichern) sowie Cookies von Drittanbietern von Google AdSense zur Anzeigenschaltung. Durch die weitere Nutzung der Seite stimmst du der Verwendung von Cookies zu." },
      { heading: "4. Dienste von Drittanbietern", body: "Wir verwenden ausschließlich Google AdSense als Drittanbieterdienst. Wir teilen keine Daten mit anderen Unternehmen und verkaufen keine Informationen an Dritte." },
      { heading: "5. Minderjährige", body: "Diese Seite richtet sich nicht an Kinder unter 13 Jahren und sammelt nicht absichtlich Informationen von ihnen." },
      { heading: "6. Änderungen dieser Richtlinie", body: "Wir können diese Richtlinie jederzeit aktualisieren. Wir empfehlen dir, sie regelmäßig zu überprüfen." },
      {
        heading: "7. Kontakt",
        body: (
          <>
            Wenn du Fragen zu dieser Richtlinie hast, kannst du uns unter{" "}
            <a href="mailto:patricio.ezequiel.toledo@gmail.com" style={linkStyle}>patricio.ezequiel.toledo@gmail.com</a> erreichen.
          </>
        ),
      },
    ],
  },
};

export default function PrivacyPolicy() {
  const { currentLanguage } = useLanguage();
  const page = content[currentLanguage];

  return (
    <Layout showFooter>
      <AdsenseScript />
      <Box sx={{ width: "100%", px: 2, pb: 4, color: "#fff" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, mt: 1 }}>{page.title}</Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.7 }}>{page.intro}</Typography>
        {page.sections.map((section) => (
          <Box key={section.heading}>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>{section.heading}</Typography>
            <Typography sx={{ mb: 2, lineHeight: 1.7 }}>{section.body}</Typography>
          </Box>
        ))}
      </Box>
    </Layout>
  );
}
