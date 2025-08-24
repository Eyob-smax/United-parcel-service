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
import am from "../locales/am.json";
import dutch from "../locales/dutch.json";
import egyptian_arabic from "../locales/egyptian_arabic.json";
import bhojpuri from "../locales/bhojpuri.json";
import gu from "../locales/gu.json";
import id from "../locales/id.json";
import kn from "../locales/kn.json";
import javanese from "../locales/javanese.json";
import ko from "../locales/ko.json";
import ml from "../locales/ml.json";
import it from "../locales/it.json";
import ne from "../locales/ne.json";
import pa from "../locales/pa.json";
import ro from "../locales/ro.json";
import sindhi from "../locales/sindhi.json";
import sw from "../locales/sw.json";
import si from "../locales/si.json";
import ta from "../locales/ta.json";
import th from "../locales/th.json";
import tr from "../locales/tr.json";
import wp from "../locales/wp.json";
import wuc from "../locales/wuc.json";
import vi from "../locales/vi.json";
import te from "../locales/te.json";
import om from "../locales/om.json";
import mr from "../locales/mr.json";
import nl from "../locales/nl.json";
import uk from "../locales/uk.json";
import od from "../locales/od.json";
import persian from "../locales/persian.json";
import serbo_crotian from "../locales/serbo_crotian.json";
import sudanese from "../locales/sudanese.json";

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
  am: { translation: am },
  dutch: { translation: dutch },
  egyptian_arabic: { translation: egyptian_arabic },
  om: { translation: om },
  te: { translation: te },
  vi: { translation: vi },
  wuc: { translation: wuc },
  wp: { translation: wp },
  tr: { translation: tr },
  th: { translation: th },
  ta: { translation: ta },
  si: { translation: si },
  sw: { translation: sw },
  sindhi: { translation: sindhi },
  gu: { translation: gu },
  kn: { translation: kn },
  javanese: { translation: javanese },
  ko: { translation: ko },
  ml: { translation: ml },
  it: { translation: it },
  ne: { translation: ne },
  pa: { translation: pa },
  ro: { translation: ro },
  id: { translation: id },
  bhojpuri: { translation: bhojpuri },
  mr: { translation: mr },
  uk: { translation: uk },
  nl: { translation: nl },
  od: { translation: od },
  persian: { translation: persian },
  serbo_crotian: { translation: serbo_crotian },
  sudanese: { translation: sudanese },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: [
      "en",
      "es",
      "zh",
      "hi",
      "ar",
      "fr",
      "ru",
      "pt",
      "de",
      "ja",
      "am",
      "dutch",
      "egyptian_Arabic",
      "bhojpuri",
      "gu",
      "kn",
      "javanese",
      "ko",
      "ml",
      "it",
      "ne",
      "pa",
      "ro",
      "te",
      "vi",
      "wuc",
      "wp",
      "tr",
      "th",
      "ta",
      "si",
      "sw",
      "sindhi",
      "om",
      "mr",
      "serbo_crotian",
      "sudanese",
      "persian",
      "nl",
      "uk",
      "od",
    ],
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
