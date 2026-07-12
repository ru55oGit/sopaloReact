import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Layout from "../components/Layout";
import { useLanguage } from "../i18n/LanguageContext";
import { SupportedLanguage } from "../i18n/translations";

interface PolicyContent {
  title: string;
  intro: string;
  sections: { heading: string; body: ReactNode }[];
}

const content: Record<SupportedLanguage, PolicyContent> = {
  es: {
    title: "Política de Privacidad",
    intro: "En Sopalo respetamos tu privacidad. Esta política explica qué información se recopila y cómo se usa.",
    sections: [
      { heading: "1. Información que recopilamos", body: "Sopalo no recopila datos personales. Tu progreso (rondas resueltas, idioma elegido) se guarda localmente en tu dispositivo (localStorage) y no se envía a ningún servidor." },
      { heading: "2. Cookies", body: "Este sitio utiliza únicamente almacenamiento local del navegador para guardar tu idioma y tu progreso. No usamos cookies de seguimiento." },
      { heading: "3. Menores de edad", body: "Este sitio no está dirigido a menores de 13 años ni recopila intencionalmente información de ellos." },
      { heading: "4. Cambios en esta política", body: "Podemos actualizar esta política en cualquier momento." },
    ],
  },
  en: {
    title: "Privacy Policy",
    intro: "At Sopalo we respect your privacy. This policy explains what information is collected and how it's used.",
    sections: [
      { heading: "1. Information we collect", body: "Sopalo does not collect personal data. Your progress (rounds solved, chosen language) is saved locally on your device (localStorage) and is never sent to any server." },
      { heading: "2. Cookies", body: "This site only uses local browser storage to save your language and progress. We don't use tracking cookies." },
      { heading: "3. Children", body: "This site is not directed at children under 13 and does not intentionally collect information from them." },
      { heading: "4. Changes to this policy", body: "We may update this policy at any time." },
    ],
  },
  pt: {
    title: "Política de Privacidade",
    intro: "No Sopalo respeitamos sua privacidade. Esta política explica quais informações são coletadas e como são usadas.",
    sections: [
      { heading: "1. Informações que coletamos", body: "O Sopalo não coleta dados pessoais. Seu progresso (rodadas resolvidas, idioma escolhido) é salvo localmente no seu dispositivo (localStorage) e nunca é enviado a nenhum servidor." },
      { heading: "2. Cookies", body: "Este site utiliza apenas armazenamento local do navegador para salvar seu idioma e progresso. Não usamos cookies de rastreamento." },
      { heading: "3. Menores de idade", body: "Este site não é direcionado a menores de 13 anos nem coleta intencionalmente informações deles." },
      { heading: "4. Alterações nesta política", body: "Podemos atualizar esta política a qualquer momento." },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    intro: "Chez Sopalo, nous respectons ta vie privée. Cette politique explique quelles informations sont collectées et comment elles sont utilisées.",
    sections: [
      { heading: "1. Informations que nous collectons", body: "Sopalo ne collecte aucune donnée personnelle. Ta progression (manches résolues, langue choisie) est enregistrée localement sur ton appareil (localStorage) et n'est jamais envoyée à un serveur." },
      { heading: "2. Cookies", body: "Ce site utilise uniquement le stockage local du navigateur pour enregistrer ta langue et ta progression. Nous n'utilisons pas de cookies de suivi." },
      { heading: "3. Mineurs", body: "Ce site ne s'adresse pas aux enfants de moins de 13 ans et ne collecte pas intentionnellement d'informations les concernant." },
      { heading: "4. Modifications de cette politique", body: "Nous pouvons mettre à jour cette politique à tout moment." },
    ],
  },
  de: {
    title: "Datenschutzrichtlinie",
    intro: "Bei Sopalo respektieren wir deine Privatsphäre. Diese Richtlinie erklärt, welche Informationen gesammelt werden und wie sie verwendet werden.",
    sections: [
      { heading: "1. Informationen, die wir sammeln", body: "Sopalo sammelt keine personenbezogenen Daten. Dein Fortschritt (gelöste Runden, gewählte Sprache) wird lokal auf deinem Gerät (localStorage) gespeichert und niemals an einen Server gesendet." },
      { heading: "2. Cookies", body: "Diese Seite verwendet nur den lokalen Browser-Speicher, um deine Sprache und deinen Fortschritt zu speichern. Wir verwenden keine Tracking-Cookies." },
      { heading: "3. Minderjährige", body: "Diese Seite richtet sich nicht an Kinder unter 13 Jahren und sammelt nicht absichtlich Informationen von ihnen." },
      { heading: "4. Änderungen dieser Richtlinie", body: "Wir können diese Richtlinie jederzeit aktualisieren." },
    ],
  },
};

export default function PrivacyPolicy() {
  const { currentLanguage } = useLanguage();
  const page = content[currentLanguage];

  return (
    <Layout showFooter>
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
