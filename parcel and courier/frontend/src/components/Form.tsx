import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";
import { Input } from "./ui/input";
import { FaBox, FaLock, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface SelectOption {
  value: string;
  label: string;
  flag?: string;
}

interface LanguagePreferenceProps {
  onContinue: () => void;
  languages?: SelectOption[];
  username?: string;
  countries?: SelectOption[];
  setCountry?: (country: string) => void;
  setLanguage?: (language: string) => void;
  password?: string;
  setUsername?: (username: string) => void;
  setPassword?: (password: string) => void;
  currentCountry?: string;
  currentLanguage?: string;
  forWhich: "language" | "admin_login" | "parcel_tracking";
  parcelID?: string;
  setParcelID?: (parcelID: string) => void;
}

export default function Form({
  onContinue,
  languages,
  username,
  currentCountry,
  currentLanguage,
  countries,
  parcelID,
  setLanguage,
  setCountry,
  setPassword,
  setUsername,
  setParcelID,
  password,
  forWhich = "language",
}: LanguagePreferenceProps) {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const handleContinue = () => {
    onContinue();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-[#232110] font-['Space_Grotesk','Noto_Sans',sans-serif] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: isMounted ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-1 justify-center py-5 px-4 sm:px-10 lg:px-40">
        <div className="flex flex-col w-full max-w-[512px] py-5">
          <motion.h2
            className="text-[28px] font-bold tracking-tight text-center pb-3 pt-5"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {forWhich === "admin_login" && t("login-forms.admin_login.title")}
            {forWhich === "parcel_tracking" &&
              t("login-forms.tracking_login.title")}
            {forWhich === "language" && t("language.select_language")}
          </motion.h2>
          <motion.div
            className="flex flex-col gap-4 px-4 py-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {forWhich === "language" && (
              <>
                <motion.div
                  className="flex flex-col gap-4 px-4 py-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="flex flex-col min-w-40 flex-1 relative">
                    <select
                      value={currentLanguage}
                      defaultValue={localStorage.getItem("i18nextLng")!}
                      onChange={(e) =>
                        setLanguage ? setLanguage(e.target.value) : null
                      }
                      className="w-full rounded-xl bg-[#353218] border border-[#6a642f] text-white h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#6a642f] appearance-none"
                    >
                      {languages?.map((language) => (
                        <option key={language.value} value={language.value}>
                          {language.flag} {language.label}
                        </option>
                      ))}
                    </select>
                    <i className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#ccc68e]">
                      <FaChevronDown />
                    </i>
                  </label>
                </motion.div>

                <motion.div
                  className="flex flex-col gap-4 px-4 py-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="flex flex-col min-w-40 flex-1 relative">
                    <select
                      value={currentCountry}
                      onChange={(e) =>
                        setCountry ? setCountry(e.target.value) : null
                      }
                      className="w-full rounded-xl bg-[#353218] border border-[#6a642f] text-white h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#6a642f] appearance-none"
                    >
                      {countries?.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <i className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#ccc68e]">
                      <FaChevronDown />
                    </i>
                  </label>
                </motion.div>
              </>
            )}

            {forWhich === "admin_login" && (
              <>
                <div className="flex flex-col gap-2 px-4 py-3 items-start">
                  <label className="flex gap-x-3 min-w-40 flex-1 relative">
                    <FaUser />
                    <span className="text-sm font-medium">
                      {t("login-forms.common.username")}
                    </span>
                  </label>
                  <Input
                    value={username}
                    onChange={(e) =>
                      setUsername ? setUsername(e.target.value) : null
                    }
                    className="w-full rounded-sm bg-[#353218] border border-[#6a642f] text-white p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#6a642f]"
                    placeholder={t("login-forms.admin_login.placeholder")}
                  />
                </div>
                <div className="flex flex-col gap-2 px-4 py-3 items-start">
                  <label className="flex gap-x-3 min-w-40 flex-1 relative">
                    <FaLock />
                    <span className="text-sm font-medium">
                      {t("login-forms.common.password")}
                    </span>
                  </label>
                  <Input
                    value={password}
                    type="password"
                    onChange={(e) =>
                      setPassword ? setPassword(e.target.value) : null
                    }
                    className="w-full rounded-sm bg-[#353218] border border-[#6a642f] text-white p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#6a642f]"
                    placeholder={t(
                      "login-forms.admin_login.placeholder_password"
                    )}
                  />
                </div>
              </>
            )}

            {forWhich === "parcel_tracking" && (
              <div className="flex flex-col gap-2 px-4 py-3 items-start">
                <label className="flex gap-x-3 min-w-40 flex-1 relative">
                  <FaBox />
                  <span className="text-sm font-medium">
                    {t("login-forms.tracking_login.title")}
                  </span>
                </label>
                <Input
                  value={parcelID}
                  onChange={(e) =>
                    setParcelID ? setParcelID(e.target.value) : null
                  }
                  className="w-full rounded-xl bg-[#353218] border border-[#6a642f] text-white h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#6a642f]"
                  placeholder={t("login-forms.tracking_login.placeholder")}
                />
              </div>
            )}
          </motion.div>

          <motion.div
            className="flex justify-center px-4 py-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.button
              onClick={handleContinue}
              className="w-[calc(100%-40px)] rounded-md h-10 px-4 bg-[#f9e106] text-[#232110] text-sm font-bold tracking-[0.015em] cursor-pointer"
            >
              <span className="truncate">
                {forWhich === "parcel_tracking" &&
                  t("login-forms.common.track")}
                {forWhich === "admin_login" && t("login-forms.common.login")}
                {forWhich === "language" && t("common.continue")}
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
