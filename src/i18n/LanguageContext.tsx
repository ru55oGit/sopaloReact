import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Translation, translations, SupportedLanguage, availableLanguages } from "./translations";

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translation;
  availableLanguages: Array<{ code: SupportedLanguage; name: string; flag: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "sopalo_language";

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("es");

  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;
    if (saved && translations[saved]) {
      setCurrentLanguage(saved);
    }
  }, []);

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t: translations[currentLanguage],
    availableLanguages,
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
