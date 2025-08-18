import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}
const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
  <Link
    to={to}
    className="text-white text-sm font-medium hover:text-[#3a3927] transition-colors"
  >
    {children}
  </Link>
);

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  onClick,
}) => (
  <motion.button
    className={`min-w-[84px] max-w-[480px] rounded-lg h-10 px-4 bg-[#3a3927] text-white text-sm font-bold truncate ${className}`}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

interface Service {
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  image: string;
}
const ServiceCard: React.FC<Service> = ({
  titleKey,
  subtitleKey,
  descriptionKey,
  image,
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex flex-col md:flex-row items-stretch justify-start rounded-lg bg-[#1f1f1a] overflow-hidden shadow-lg min-h-[300px]"
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="w-full md:w-1/2 h-64 md:h-auto">
        <img
          src={image}
          alt={t(titleKey)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex w-full md:w-1/2 flex-col gap-2 py-4 px-4">
        <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
          {t(titleKey)}
        </p>
        <p className="text-[#bbba9b] text-base font-medium">{t(subtitleKey)}</p>
        <p className="text-[#bbba9b] text-sm">{t(descriptionKey)}</p>
      </div>
    </motion.div>
  );
};

const SolutionsDetail: React.FC = () => {
  const { t } = useTranslation();

  const services: Service[] = useMemo(
    () => [
      {
        titleKey: "solutions.domestic.title",
        subtitleKey: "solutions.domestic.subtitle",
        descriptionKey: "solutions.domestic.description",
        image:
          "https://i.postimg.cc/hvzKx0p0/C30867-FC-EB78-4-BE7-9610-3-FA873-C8-F5-E3.jpg",
      },
      {
        titleKey: "solutions.tracking.title",
        subtitleKey: "solutions.tracking.subtitle",
        descriptionKey: "solutions.tracking.description",
        image:
          "https://i.postimg.cc/zXHfRqQ1/872-FFF41-2-C36-4-BB1-B97-F-BBF787447-A9-A.jpg",
      },
      {
        titleKey: "solutions.specialized.title",
        subtitleKey: "solutions.specialized.subtitle",
        descriptionKey: "solutions.specialized.description",
        image:
          "https://i.postimg.cc/fbCWhyVY/BBD21-F34-8584-478-F-8-E93-A954-B1-B6-E89-D.jpg",
      },
      {
        titleKey: "solutions.warehousing.title",
        subtitleKey: "solutions.warehousing.subtitle",
        descriptionKey: "solutions.warehousing.description",
        image:
          "https://i.postimg.cc/KcHzz1JN/993-A79-D9-48-FE-4-F63-9-A4-A-D00737-E390-E0.jpg",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#181811] font-['Space_Grotesk','Noto_Sans',sans-serif]">
      <header className="flex flex-col md:flex-row items-center justify-between border-b border-[#3a3927] px-4 md:px-10 py-3">
        <div className="flex items-center gap-4 text-white">
          <div className="w-4 h-4">
            <img
              src="https://i.postimg.cc/nLNLjrc5/DADF8527-8603-4857-AAF0-4308-D15-C512-C.jpg"
              alt="logo"
            />
          </div>
          <h2 className="text-lg font-bold tracking-[-0.015em]">
            {t("common.header_title") || "United Parcel Service"}
          </h2>
        </div>
        <div className="flex flex-1 flex-col md:flex-row justify-end gap-4 md:gap-8 mt-2 md:mt-0">
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-9">
            <NavLink to="/home">{t("header.home")}</NavLink>
            <NavLink to="/about">{t("header.about")}</NavLink>
          </div>
          <Button onClick={() => (window.location.href = "/track-parcel")}>
            {t("common.track")}
          </Button>
        </div>
      </header>

      <motion.main
        className="flex flex-1 justify-center py-5 px-4 sm:px-8 lg:px-16 xl:px-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col w-full max-w-[960px] space-y-6">
          <motion.section
            className="min-h-[300px] bg-cover bg-center flex flex-col justify-end rounded-lg"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 25%), url('https://i.postimg.cc/tRwqbL4v/032-A6682-A47-F-4199-83-C2-345-FCD50-F1-BA.jpg')`,
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="p-4 text-white text-xl md:text-2xl lg:text-[28px] font-bold tracking-tight">
              {t("solutions.title")}
            </p>
          </motion.section>

          <section className="flex flex-col gap-4">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </section>
        </div>
      </motion.main>
    </div>
  );
};

export default SolutionsDetail;
