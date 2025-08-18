import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../locales/en.json";
import es from "../locales/es.json";
import zh from "../locales/zh.json";
import hi from "../locales/hi.json";
import ar from "../locales/ar.json";
import fr from "../locales/fr.json";
import ru from "../locales/ru.json";
import pt from "../locales/pt.json";
import de from "../locales/de.json";
import ja from "../locales/ja.json";

const resources: Record<string, { translation: Record<string, unknown> }> = {
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  hi: { translation: hi },
  ar: { translation: ar },
  fr: { translation: fr },
  ru: { translation: ru },
  pt: { translation: pt },
  de: { translation: de },
  ja: { translation: ja },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "es", "zh", "hi", "ar", "fr", "ru", "pt", "de", "ja"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",

      htmlTag:
        typeof document !== "undefined" ? document.documentElement : undefined,
    },
    react: {
      useSuspense: false,
    },
  });

export const changeLanguage = (lng: string) => {
  if (typeof document !== "undefined") {
    const html = document.documentElement;
    html.lang = lng;
    html.dir = lng === "ar" ? "rtl" : "ltr";
  }
  return i18n.changeLanguage(lng);
};

export default i18n;
