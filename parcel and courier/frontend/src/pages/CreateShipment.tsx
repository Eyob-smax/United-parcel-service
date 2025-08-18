import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaCalendarAlt, FaDoorOpen } from "react-icons/fa";
import { useFetcher, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { TRootState } from "@/app/store";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

interface FormData {
  parcelId: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  origin: string;
  destination: string;
  packageDescription: string;
  packageWeight: string;
  packageDimensions: string;
  pickupDate: string;
  deliveryDate: string;
  status: "pending" | "shipped off" | "on transit" | "delivered";
  package_name: string;
  quantity: number;
}

interface FormField {
  label: string;
  name: keyof FormData;
  placeholder: string;
  type?: string;
  options?: { value: string; label: string }[];
}

interface FormSectionProps {
  title: string;
  fields: FormField[];
  formData: FormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const FormInput: React.FC<
  FormField & {
    value: string | number;
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
  }
> = ({ label, name, placeholder, type = "text", value, onChange, options }) => (
  <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3 px-2 py-3">
    <label htmlFor={name} className="flex flex-col relative">
      <p className="text-base font-medium pb-2 text-white">{label}</p>

      {options ? (
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-14 p-3 text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] text-white placeholder:text-[#bbba9b]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-14 p-3 text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] text-white placeholder:text-[#bbba9b]"
          />
          {type === "date" && (
            <FaCalendarAlt
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#bbba9b]"
              size={20}
            />
          )}
        </div>
      )}
    </label>
  </div>
);

const FormSection: React.FC<FormSectionProps> = ({
  title,
  fields,
  formData,
  onInputChange,
}) => (
  <section className="py-4">
    <h3 className="text-lg font-bold tracking-tight px-4 pb-2 text-white">
      {title}
    </h3>
    <div className="flex flex-wrap -mx-2">
      {fields.map((field) => (
        <FormInput
          key={field.name}
          {...field}
          value={formData[field.name]}
          onChange={onInputChange}
        />
      ))}
    </div>
  </section>
);

const CreateShipment: React.FC = () => {
  const { t } = useTranslation();
  const { authenticated } = useSelector((state: TRootState) => state.user);
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [formData, setFormData] = useState<FormData>({
    parcelId: "",
    senderName: "",
    senderAddress: "",
    senderPhone: "",
    recipientName: "",
    recipientAddress: "",
    recipientPhone: "",
    origin: "",
    destination: "",
    packageDescription: "",
    packageWeight: "",
    packageDimensions: "",
    pickupDate: "",
    deliveryDate: "",
    status: "pending",
    package_name: "",
    quantity: 1,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (!authenticated) {
      Swal.fire({
        title: t("alerts.unauthorized") || "Unauthorized",
        text:
          t("alerts.authorization_error") ||
          "Please log in to create a shipment.",
        icon: "warning",
        background: "#232110",
        color: "#bbba9b",
        confirmButtonText: t("common.ok") || "OK",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) navigate("/");
      });
    }
  }, [authenticated, navigate, t]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation
    const requiredFields: (keyof FormData)[] = [
      "parcelId",
      "senderName",
      "senderAddress",
      "senderPhone",
      "recipientName",
      "recipientAddress",
      "recipientPhone",
      "origin",
      "destination",
      "package_name",
      "quantity",
      "pickupDate",
      "deliveryDate",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        Swal.fire({
          title: t("alerts.error") || "Validation Error",
          text:
            t("alerts.missing_information") ||
            "Please fill all required fields.",
          icon: "error",
          background: "#232110",
          color: "#bbba9b",
          confirmButtonText: t("common.ok") || "OK",
        });
        return;
      }
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value.toString());
    });
    if (image) payload.append("image", image);

    fetcher.submit(payload, { method: "post" });
  };

  const formSections: { title: string; fields: FormField[] }[] = [
    {
      title: t("admin.parcel_info") || "Parcel Information",
      fields: [
        {
          label: t("admin.parcel_id") || "Parcel ID",
          name: "parcelId",
          placeholder: t("admin.enter_parcel_id") || "Enter Parcel ID",
        },
        {
          label: t("admin.package_name") || "Package Name",
          name: "package_name",
          placeholder: t("admin.enter_package_name") || "Enter package name",
        },
        {
          label: t("admin.quantity") || "Quantity",
          name: "quantity",
          placeholder: t("admin.enter_quantity") || "Enter quantity",
          type: "number",
        },
      ],
    },
    {
      title: t("admin.shipping_dates") || "Shipping Dates",
      fields: [
        {
          label: t("admin.pickup_date") || "Pickup Date",
          name: "pickupDate",
          placeholder: t("admin.select_pickup_date") || "Select pickup date",
          type: "date",
        },
        {
          label: t("admin.delivery_date") || "Delivery Date",
          name: "deliveryDate",
          placeholder:
            t("admin.select_delivery_date") || "Select delivery date",
          type: "date",
        },
      ],
    },
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-[#181811] text-white font-['Space_Grotesk','Noto_Sans',sans-serif]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isMounted ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row flex-1 max-w-7xl mx-auto py-5 px-4 sm:px-6 gap-4 lg:gap-6">
        <div className="flex flex-col w-full lg:w-64 xl:w-80">
          <motion.div
            className="flex flex-col justify-between bg-[#181811] p-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col gap-4">
              <motion.button
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#3a3927] text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <FaPlus size={24} />
                <p className="text-sm font-medium">
                  {t("admin.create_shipment") || "Create Shipment"}
                </p>
              </motion.button>
              <motion.button
                onClick={() => navigate("/admin-dashboard")}
                className="flex items-center gap-3 px-3 py-2 text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <FaDoorOpen size={24} />
                <p className="text-sm font-medium">
                  {t("admin.logout") || "Logout"}
                </p>
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col w-full">
          <motion.div
            className="flex justify-between items-center p-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t("admin.create_shipment") || "Create Shipment"}
            </h2>
          </motion.div>

          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <fetcher.Form method="post" onSubmit={handleSubmit}>
              {formSections.map((section, index) => (
                <FormSection
                  key={index}
                  title={section.title}
                  fields={section.fields}
                  formData={formData}
                  onInputChange={handleInputChange}
                />
              ))}

              {/* Image Upload */}
              <section className="py-4">
                <h3 className="text-lg font-bold tracking-tight px-4 pb-2 text-white">
                  {t("admin.upload_image") || "Upload Package Image"}
                </h3>
                <div className="flex flex-col p-4">
                  <motion.div
                    className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#55553a] px-6 py-14"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <motion.label
                      htmlFor="image-upload"
                      className="cursor-pointer rounded-lg h-10 px-4 bg-[#3a3927] text-white text-sm font-bold flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {t("admin.upload") || "Upload"}
                    </motion.label>
                    {imagePreview && (
                      <motion.img
                        src={imagePreview}
                        alt="Package Preview"
                        className="w-32 h-32 object-cover rounded-lg mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                </div>
              </section>

              <div className="flex px-4 py-3 justify-end">
                <motion.button
                  type="submit"
                  className="min-w-[84px] rounded-lg h-10 px-4 bg-[#f9f506] text-[#181811] text-sm font-bold tracking-tight"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  disabled={fetcher.state !== "idle"}
                >
                  {fetcher.state === "idle"
                    ? t("admin.create_shipment") || "Create Shipment"
                    : t("admin.creating") || "Creating..."}
                </motion.button>
              </div>
            </fetcher.Form>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateShipment;
