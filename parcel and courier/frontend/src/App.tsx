import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import {
  FaQuestionCircle,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TypeAnimation } from "react-type-animation";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { TAppDispatch, TRootState } from "./app/store";
import { createMessage, fetchMessages } from "./features/customerSupportSlice";
import Swal from "sweetalert2";

console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_KEY);

const App = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<TAppDispatch>();
  const { loading: messageLoading, error: messageError } = useSelector(
    (state: TRootState) => state.customerSupport
  );
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    attachment: null as File | null,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleCustomerService = () => {
    setShowCustomerService((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const scrollIntoSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    if (messageError) {
      Swal.fire({
        title: t("common.error") || "Error!",
        text: t("contact.message_error") || "Error while sending message.",
        icon: "error",
      });
    }
  }, [messageError, t]);

  const handleCustomerSupport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(createMessage(formData));

    if (createMessage.fulfilled.match(result)) {
      await Swal.fire({
        title: t("alerts.success") || "Success!",
        text: t("alerts.message_sent") || "Your message has been sent.",
        icon: "success",
      });
      setFormData({
        name: "",
        email: "",
        message: "",
        attachment: null,
      });
      setShowCustomerService(false);
    } else {
      await Swal.fire({
        title: t("alerts.something_went_wrong") || "Error!",
        text:
          t("alerts.sending_message_error") || "Error while sending message.",
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: t("alerts.retry") || "Retry",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          dispatch(fetchMessages());
        }
      });
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#232110]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#f9e106] animate-pulse" />
          <p className="text-white font-semibold">
            {t("common.loading") || "Loading Shipments..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#181811] font-['Space_Grotesk','Noto_Sans',sans-serif] overflow-x-hidden">
      <div className="flex flex-col h-full grow container mx-auto max-w-7xl">
        <header className="flex items-center justify-between border-b border-[#3a3927] px-4 py-3 sm:px-6 md:px-10">
          <div className="flex items-center gap-4 text-white">
            <div className="w-4 h-4">
              <img
                src="https://i.postimg.cc/nLNLjrc5/DADF8527-8603-4857-AAF0-4308-D15-C512-C.jpg"
                alt="logo"
              />
            </div>
            <h2
              onClick={() => scrollIntoSection("home")}
              className="text-lg font-bold tracking-tight cursor-pointer sm:text-xl"
            >
              {t("common.header_title") || "United Parcel Services"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <nav
              className={`md:flex ${
                isMobileMenuOpen ? "flex" : "hidden"
              } flex-col md:flex-row gap-4 md:gap-8 absolute md:static top-16 left-0 w-full md:w-auto bg-[#181811] md:bg-transparent p-4 md:p-0 z-10 border-b md:border-none border-[#3a3927]`}
            >
              <Link
                to="/about"
                className="text-white text-sm font-medium hover:text-[#f9f506]"
                onClick={() => scrollIntoSection("about")}
              >
                {t("header.about") || "About"}
              </Link>
              <a
                href="#contact"
                className="text-white text-sm font-medium hover:text-[#f9f506]"
                onClick={() => scrollIntoSection("contact")}
              >
                {t("header.contact") || "Contact"}
              </a>
              <a
                href="#services"
                className="text-white text-sm font-medium hover:text-[#f9f506]"
                onClick={() => scrollIntoSection("services")}
              >
                {t("header.services") || "Services"}
              </a>
              <a
                href="#updates"
                className="text-white text-sm font-medium hover:text-[#f9f506]"
                onClick={() => scrollIntoSection("updates")}
              >
                {t("header.updates") || "Updates"}
              </a>
            </nav>
            <Button
              className="md:hidden text-white text-2xl"
              variant="ghost"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </Button>
            <Link
              to="/track-parcel"
              className="hidden md:flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 bg-[#f9f506] text-[#181811] text-sm font-bold tracking-[0.015em]"
            >
              <span className="truncate">{t("common.track") || "Track"}</span>
            </Link>
          </div>
        </header>

        <motion.div
          className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-5 flex flex-1 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col w-full max-w-5xl">
            <section id="home" className="p-4 sm:p-6 md:p-8">
              <div
                className="flex min-h-[300px] sm:min-h-[400px] md:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-lg items-center justify-center p-4 sm:p-6"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://i.postimg.cc/FHQhd3cj/2-C3-DC23-C-1-B8-A-4978-AE57-701466-CAF00-D.jpg")`,
                }}
              >
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-center">
                  <TypeAnimation
                    sequence={[
                      t("common.welcome") ||
                        "Welcome to United Parcel Services",
                      2000,
                      " ",
                      2000,
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                    cursor={true}
                  />
                </h1>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    to="/track-parcel"
                    className="min-w-[84px] max-w-[480px] rounded-lg h-10 px-4 sm:h-12 sm:px-5 bg-[#f9f506] text-[#181811] text-sm sm:text-base font-bold tracking-[0.015em] flex items-center justify-center"
                  >
                    <span className="truncate">
                      {t("common.track_parcel") || "Track Your Parcel"}
                    </span>
                  </Link>
                  <Link
                    to="/solutions"
                    className="min-w-[84px] max-w-[480px] rounded-lg h-10 px-4 sm:h-12 sm:px-5 bg-[#3a3927] text-white text-sm sm:text-base font-bold tracking-[0.015em] flex items-center justify-center"
                  >
                    <span className="truncate">
                      {t("common.explore_solutions") || "Explore Our Solutions"}
                    </span>
                  </Link>
                </div>
              </div>
            </section>

            <section className="px-4 sm:px-6 md:px-8">
              <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight pb-3 pt-5">
                {t("tariff.title") || "Navigating Latest Tariff Development"}
              </h2>
              <p className="text-white text-base font-normal pb-3 pt-1">
                {t("tariff.content") ||
                  "Stay informed about the latest tariff changes affecting international shipping. We're committed to providing transparent and up-to-date information to help you manage your logistics effectively."}
              </p>
              <div className="flex py-3 justify-start">
                <Link
                  to="/solutions"
                  className="min-w-[84px] max-w-[480px] rounded-lg h-10 px-4 bg-[#f9f506] text-[#181811] text-sm font-bold tracking-[0.015em] flex items-center justify-center"
                >
                  <span className="truncate">
                    {t("common.explore_solutions") || "Explore Our Solutions"}
                  </span>
                </Link>
              </div>
            </section>

            <section id="services" className="px-4 sm:px-6 md:px-8">
              <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight pb-3 pt-5">
                {t("header.services") || "Our Services"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: t("services.express_delivery") || "Express Delivery",
                    desc:
                      t("services.express_desc") ||
                      "Fast and reliable delivery for urgent shipments.",
                    img: "https://i.postimg.cc/tRwqbL4v/032-A6682-A47-F-4199-83-C2-345-FCD50-F1-BA.jpg",
                  },
                  {
                    title: t("services.freight") || "Freight Forwarding",
                    desc:
                      t("services.freight_desc") ||
                      "Efficient and cost-effective solutions for large shipments.",
                    img: "https://i.postimg.cc/k5qMZKgn/97-C4245-D-594-C-4569-B95-A-7-F1-EF568-DAED.jpg",
                  },
                  {
                    title: t("services.customs") || "Customs Brokerage",
                    desc:
                      t("services.customs_desc") ||
                      "Expert assistance with customs clearance processes.",
                    img: "https://i.postimg.cc/fbCWhyVY/BBD21-F34-8584-478-F-8-E93-A954-B1-B6-E89-D.jpg",
                  },
                  {
                    title: t("services.warehousing") || "Warehousing",
                    desc:
                      t("services.warehousing_desc") ||
                      "Secure and flexible storage options for your goods.",
                    img: "https://i.postimg.cc/KcHzz1JN/993-A79-D9-48-FE-4-F63-9-A4-A-D00737-E390-E0.jpg",
                  },
                ].map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex flex-col gap-3 pb-3">
                      <div
                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                        style={{ backgroundImage: `url("${service.img}")` }}
                      ></div>
                      <div>
                        <p className="text-white text-base font-medium leading-normal">
                          {service.title}
                        </p>
                        <p className="text-[#bbba9b] text-sm font-normal leading-normal">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section id="updates" className="px-4 sm:px-6 md:px-8">
              <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight pb-3 pt-5">
                {t("header.updates") || "Important Updates"}
              </h2>
              <div className="flex overflow-x-auto snap-x snap-mandatory [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-3">
                {[
                  {
                    title:
                      t("updates.new_routes") ||
                      "Service Update: New Delivery Routes",
                    desc:
                      t("updates.new_routes_desc") ||
                      "We've expanded our delivery network to include new routes for faster service.",
                    img: "https://i.postimg.cc/KzsZRWrz/0-D69-E09-D-7-DFE-445-A-B175-797260728126.jpg",
                  },
                  {
                    title: t("updates.holiday") || "Holiday Shipping Deadlines",
                    desc:
                      t("updates.holiday_desc") ||
                      "Plan your holiday shipments ahead with our updated deadlines.",
                    img: "https://i.postimg.cc/wjKjXSKR/0-B9-A4-E56-B1-A1-489-F-B905-846-A4-B6-E4-EE8.jpg",
                  },
                  {
                    title:
                      t("updates.warehouse") ||
                      "Warehouse Expansion Announcement",
                    desc:
                      t("updates.warehouse_desc") ||
                      "Our new warehouse facility is now open, offering more storage capacity.",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGeUeCOkBDwqiu9cFbjdh9zJKZDtfh8XHsOLow_j5GAhKP0WU0UjixSk-gKxqrfkCkroxrEA2wvSXqv9gjwSrFeVhTEAqx1ZlHII-9V_UHYW1gbQYlQG8hQz8lxEH91sK5a4HKF53P_-zD_L7yM1YpoaY1_JnqhcKxlgwOHCk_oWidt5z0_EVGKtc6cvzBabh4JQtN_zCpvedkv4EnNTvFMMgb3vD3iA3mpQrCyodKFVb6M1uOXUPUhqtx9jkaGd9dE5t5cai9db0",
                  },
                ].map((update, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                    className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-[80%] sm:min-w-[40%] md:min-w-[30%]"
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                      style={{ backgroundImage: `url("${update.img}")` }}
                    ></div>
                    <div>
                      <p className="text-white text-base font-medium leading-normal">
                        {update.title}
                      </p>
                      <p className="text-[#bbba9b] text-sm font-normal leading-normal">
                        {update.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <div className="flex justify-end overflow-hidden px-4 sm:px-5 pb-5 pt-5">
              <motion.button
                className="flex max-w-[480px] items-center justify-center rounded-lg h-14 px-5 bg-[#f9f506] text-[#181811] text-base font-bold tracking-[0.015em] min-w-0 gap-4 pl-4 pr-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCustomerService}
              >
                <div className="text-[#181811] text-2xl">
                  <FaQuestionCircle />
                </div>
                <span className="truncate">
                  {t("contact.customer_service") || "Customer Service"}
                </span>
              </motion.button>
            </div>

            {showCustomerService && (
              <motion.div
                className="fixed bottom-20 right-4 sm:right-10 bg-white p-6 rounded-lg shadow-xl w-[90%] sm:w-96 z-20"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-black text-lg font-bold mb-4">
                  {t("contact.contact_us") || "Contact Us"}
                </h3>
                <form
                  onSubmit={handleCustomerSupport}
                  encType="multipart/form-data"
                  className="flex flex-col gap-4"
                >
                  <Input
                    type="text"
                    placeholder={t("contact.name") || "Name"}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md"
                    required
                  />
                  <Input
                    type="email"
                    placeholder={t("contact.email") || "Email"}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md"
                    required
                  />
                  <Textarea
                    placeholder={t("contact.message") || "Message"}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md min-h-[100px]"
                    required
                  />
                  <Input
                    type="file"
                    name="attachment"
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md"
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      type="submit"
                      className="bg-[#f9f506] hover:text-white hover:border-[#f9f506] hover:border-1 text-[#181811] p-2 rounded-md font-bold"
                      disabled={messageLoading}
                    >
                      {messageLoading
                        ? t("common.loading") || "Sending..."
                        : t("contact.send") || "Send"}
                    </Button>
                    <Button
                      onClick={() => setShowCustomerService(false)}
                      type="button"
                      className="bg-[#black] hover:text-white border-[#f9f506] hover:border-1 text-[#181811] p-2 rounded-md font-bold"
                      disabled={messageLoading}
                    >
                      {t("common.back") || "Send"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            <footer
              id="contact"
              className="flex flex-col gap-6 px-4 sm:px-5 py-10 text-center border-t border-[#3a3927] mt-10"
            >
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#bbba9b] hover:text-[#f9f506] cursor-pointer text-2xl"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#bbba9b] hover:text-[#f9f506] cursor-pointer text-2xl"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#bbba9b] hover:text-[#f9f506] cursor-pointer text-2xl"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              </div>
              <p className="text-white font-semibold">
                © {new Date().getFullYear()} United Parcel Services
              </p>
              <p className="text-[#bbba9b] text-base font-normal leading-normal">
                <Trans
                  i18nKey="contact.contact_info"
                  values={{
                    email: "unitedparcels880@gmail.com",
                    phone: "+31610928914",
                  }}
                  components={{
                    1: (
                      <a
                        href="mailto:unitedparcels880@gmail.com"
                        className="text-[#f9f506] hover:underline"
                      />
                    ),
                    2: (
                      <a
                        href="https://wa.me/31610928914"
                        className="text-[#f9f506] hover:underline"
                      />
                    ),
                  }}
                  defaults="Contact us at <1>unitedparcels880@gmail.com</1> or WhatsApp <2>+31610928914</2>. Follow us on social media."
                />
              </p>
            </footer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default App;
