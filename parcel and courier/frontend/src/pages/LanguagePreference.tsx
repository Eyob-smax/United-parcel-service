import Form from "@/components/Form";
import { useEffect, useState } from "react";
import i18n from "i18next";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LanguagePreference() {
  const navigate = useNavigate();
  const storedLanguage = localStorage.getItem("i18nextLng");
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(id);
  }, []);

  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "gb", label: "United Kingdom" },
    { value: "et", label: "Ethiopia" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "jp", label: "Japan" },
    { value: "cn", label: "China" },
    { value: "in", label: "India" },
    { value: "br", label: "Brazil" },
    { value: "au", label: "Australia" },
    { value: "za", label: "South Africa" },
    { value: "ng", label: "Nigeria" },
    { value: "ke", label: "Kenya" },
    { value: "gh", label: "Ghana" },
    { value: "mx", label: "Mexico" },
    { value: "es", label: "Spain" },
    { value: "it", label: "Italy" },
    { value: "ru", label: "Russia" },
    { value: "sa", label: "Saudi Arabia" },
    { value: "ae", label: "United Arab Emirates" },
    { value: "eg", label: "Egypt" },
    { value: "tr", label: "Turkey" },
    { value: "pk", label: "Pakistan" },
    { value: "bd", label: "Bangladesh" },
    { value: "id", label: "Indonesia" },
    { value: "th", label: "Thailand" },
    { value: "vn", label: "Vietnam" },
    { value: "kr", label: "South Korea" },
    { value: "my", label: "Malaysia" },
    { value: "sg", label: "Singapore" },
    { value: "ph", label: "Philippines" },
    { value: "ar", label: "Argentina" },
    { value: "cl", label: "Chile" },
    { value: "co", label: "Colombia" },
    { value: "pe", label: "Peru" },
    { value: "ve", label: "Venezuela" },
    { value: "se", label: "Sweden" },
    { value: "no", label: "Norway" },
    { value: "dk", label: "Denmark" },
    { value: "fi", label: "Finland" },
    { value: "nl", label: "Netherlands" },
    { value: "be", label: "Belgium" },
    { value: "ch", label: "Switzerland" },
    { value: "pl", label: "Poland" },
    { value: "ua", label: "Ukraine" },
    { value: "ir", label: "Iran" },
    { value: "iq", label: "Iraq" },
    { value: "sy", label: "Syria" },
  ];

  const languages = [
    { value: "en", label: "English", flag: "🇬🇧" },
    { value: "es", label: "Spanish", flag: "🇪🇸" },
    { value: "zh", label: "Mandarin", flag: "🇨🇳" },
    { value: "hi", label: "Hindi", flag: "🇮🇳" },
    { value: "ar", label: "Arabic", flag: "🇸🇦" },
    { value: "fr", label: "French", flag: "🇫🇷" },
    { value: "ru", label: "Russian", flag: "🇷🇺" },
    { value: "pt", label: "Portuguese", flag: "🇵🇹" },
    { value: "de", label: "German", flag: "🇩🇪" },
    { value: "ja", label: "Japanese", flag: "🇯🇵" },
    { value: "am", label: "Amharic", flag: "🇪🇹" },
    { value: "bhojpuri", label: "Bhojpuri", flag: "🇮🇳" },
    { value: "gu", label: "Gujarati", flag: "🇮🇳" },
    { value: "kn", label: "Kannada", flag: "🇮🇳" },
    { value: "javanese", label: "Javanese", flag: "🇮🇩" },
    { value: "ko", label: "Korean", flag: "🇰🇷" },
    { value: "ml", label: "Malayalam", flag: "🇮🇳" },
    { value: "it", label: "Italian", flag: "🇮🇹" },
    { value: "ne", label: "Nepali", flag: "🇳🇵" },
    { value: "pa", label: "Pashto", flag: "🇵🇰" },
    { value: "ro", label: "Romanian", flag: "🇷🇴" },
    { value: "te", label: "Telugu", flag: "🇮🇳" },
    { value: "vi", label: "Vietnamese", flag: "🇻🇳" },
    { value: "wuc", label: "Wu Chinese", flag: "🇨🇳" },
    { value: "wp", label: "Western Punjabi", flag: "🇵🇰" },
    { value: "tr", label: "Turkish", flag: "🇹🇷" },
    { value: "th", label: "Thai", flag: "🇹🇭" },
    { value: "si", label: "Sinhala", flag: "🇱🇰" },
    { value: "ta", label: "Tamil", flag: "🇮🇳" },
    { value: "sw", label: "Swahili", flag: "🇰🇪" },
    { value: "sindhi", label: "Sindhi", flag: "🇵🇰" },
    { value: "om", label: "Oromifa", flag: "🇪🇹" },
    { value: "egyptian_arabic", label: "Egyptian Arabic", flag: "🇪🇬" },
    { value: "persian", label: "Persian", flag: "🇮🇷" },
    { value: "mr", label: "Marathi", flag: "🇮🇳" },
    { value: "nl", label: "Dutch", flag: "🇳🇱" },
    { value: "uk", label: "Ukrainian", flag: "🇺🇦" },
    { value: "od", label: "Odia", flag: "🇮🇳" },
    { value: "serbo_crotian", label: "Serbo-Croatian", flag: "🇷🇸" },
    { value: "sudanese", label: "Sudanese", flag: "🇸🇩" },
  ];

  const [currentLanguage, setCurrentLanguage] = useState<string>(
    storedLanguage || languages[0].value
  );
  const [currentCountry, setCurrentCountry] = useState<string>("us");

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#232110]">
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://i.postimg.cc/nLNLjrc5/DADF8527-8603-4857-AAF0-4308-D15-C512-C.jpg"
            height={150}
            width={150}
            alt="logo"
          />
          <div className="w-16 h-16 rounded-full bg-[#f9e106] animate-pulse" />
          <p className="text-white font-semibold">
            {t("admin.loading_shipments") || "Loading Shipments..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form
      key={"language_preference"}
      forWhich="language"
      onContinue={() => navigate("/home")}
      countries={countries}
      currentCountry={currentCountry}
      setCountry={setCurrentCountry}
      languages={languages}
      setLanguage={handleLanguageChange}
      currentLanguage={currentLanguage}
    />
  );
}
