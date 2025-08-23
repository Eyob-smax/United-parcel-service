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
  pickupDate: string;
  deliveryDate: string;
  status: "pending" | "shipped off" | "on transit" | "delivered";
  packageName: string;
  quantity: number;
  destinationCountry: string;
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const FormInput: React.FC<
  FormField & {
    value: string | number;
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => void;
  }
> = ({ label, name, placeholder, type = "text", value, onChange, options }) => (
  <div className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
    <label htmlFor={name} className="flex flex-col min-w-40 flex-1">
      <p className="text-base font-medium pb-2 text-white">{label}</p>
      {type === "textarea" ? (
        <textarea
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-32 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] text-white placeholder:text-[#bbba9b]"
        />
      ) : options ? (
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] text-white placeholder:text-[#bbba9b]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex w-full items-stretch rounded-lg">
          <input
            name={name}
            id={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] text-white placeholder:text-[#bbba9b]"
          />
          {type === "date" && (
            <div className="flex items-center justify-center pr-[15px] rounded-r-lg border border-[#55553a] border-l-0 bg-[#27271b]">
              <FaCalendarAlt className="text-[#bbba9b]" size={24} />
            </div>
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
    <h3 className="text-lg font-bold tracking-[-0.015em] px-4 pb-2 text-white">
      {title}
    </h3>
    {fields.map((field) => (
      <FormInput
        key={field.name}
        {...field}
        value={formData[field.name]}
        onChange={onInputChange}
      />
    ))}
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
    pickupDate: "",
    deliveryDate: "",
    status: "pending",
    packageName: "",
    quantity: 1,
    destinationCountry: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (fetcher.data && fetcher.data.success === true) {
      Swal.fire({
        icon: "success",
        title: t("alerts.success") || "Success",
        text:
          t("alerts.shipment_created") ||
          "Your shipment has been created successfully",
      }).then(() => {
        navigate("/admin-dashboard");
      });
    }
  }, [fetcher.data, t, navigate, fetcher.state]);

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
      }).then(() => {
        navigate("/home");
      });
    }
  }, [authenticated, navigate, t]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
      "packageDescription",
      "pickupDate",
      "deliveryDate",
      "status",
      "packageName",
      "quantity",
      "destinationCountry",
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
    if (image) payload.append("imageUrl", image);

    fetcher.submit(payload, { method: "post", encType: "multipart/form-data" });
  };

  if (fetcher.state === "submitting" || fetcher.state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#232110]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#f9e106] animate-pulse" />
          <p className="text-white font-semibold">
            {t("admin.creating_shipment") || "Creating Shipment..."}
          </p>
        </div>
      </div>
    );
  }

  const formSections: { title: string; fields: FormField[] }[] = [
    {
      title: t("admin.parcel_info") || "Parcel Information",
      fields: [
        {
          label: t("admin.parcel_id") || "Parcel ID",
          name: "parcelId",
          placeholder: t("admin.enter_parcel_id") || "Enter parcel ID",
        },
        {
          label: t("admin.package_name") || "Package Name",
          name: "packageName",
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
      title: t("admin.sender_details") || "Sender Details",
      fields: [
        {
          label: t("login-forms.common.username") || "Name",
          name: "senderName",
          placeholder: t("admin.enter_sender_name") || "Enter sender's name",
        },
        {
          label: t("admin.address") || "Address",
          name: "senderAddress",
          placeholder:
            t("admin.enter_sender_address") || "Enter sender's address",
        },
        {
          label: t("admin.phone_number") || "Phone Number",
          name: "senderPhone",
          placeholder:
            t("admin.enter_sender_phone") || "Enter sender's phone number",
        },
      ],
    },
    {
      title: t("admin.recipient_details") || "Recipient Details",
      fields: [
        {
          label: t("login-forms.common.username") || "Name",
          name: "recipientName",
          placeholder:
            t("admin.enter_recipient_name") || "Enter recipient's name",
        },
        {
          label: t("admin.address") || "Address",
          name: "recipientAddress",
          placeholder:
            t("admin.enter_recipient_address") || "Enter recipient's address",
        },
        {
          label: t("admin.phone_number") || "Phone Number",
          name: "recipientPhone",
          placeholder:
            t("admin.enter_recipient_phone") ||
            "Enter recipient's phone number",
        },
      ],
    },
    {
      title: t("admin.origin_destination") || "Origin & Destination",
      fields: [
        {
          label: t("admin.origin") || "Origin",
          name: "origin",
          placeholder: t("admin.enter_origin") || "Enter origin",
        },
        {
          label: t("admin.destination") || "Destination",
          name: "destination",
          placeholder: t("admin.enter_destination") || "Enter destination",
        },
        {
          label: t("admin.destination") || "Destination",
          name: "destinationCountry",
          placeholder: t("admin.enter_destination") || "Enter destination",
        },
      ],
    },
    {
      title: t("admin.package_details") || "Package Details",
      fields: [
        {
          label: t("admin.description") || "Description",
          name: "packageDescription",
          placeholder:
            t("admin.enter_package_desc") || "Enter package description",
          type: "textarea",
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
    {
      title: t("admin.transport_info") || "Transport Information",
      fields: [
        {
          label: t("admin.status") || "Status",
          name: "status",
          placeholder: t("admin.select_status") || "Select status",
          options: [
            { value: "pending", label: t("admin.status_pending") || "Pending" },
            {
              value: "shipped off",
              label: t("admin.status_shipped") || "Shipped off",
            },
            {
              value: "on transit",
              label: t("admin.status_transit") || "On transit",
            },
            {
              value: "delivered",
              label: t("admin.status_delivered") || "Delivered",
            },
          ],
        },
      ],
    },
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-[#181811] font-['Space_Grotesk','Noto_Sans',sans-serif] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: isMounted ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col md:flex-row flex-1 justify-center py-5 px-4 sm:px-6 gap-4 md:gap-6">
        <div className="flex flex-col w-full md:w-80">
          <motion.div
            className="flex flex-col justify-between bg-[#181811] p-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col gap-4">
              <motion.button
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#3a3927]"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <FaPlus size={24} />
                <p className="text-white text-sm font-medium">
                  {t("admin.create_shipment") || "Create Shipment"}
                </p>
              </motion.button>
              <motion.button
                onClick={() => navigate("/admin-dashboard")}
                className="flex items-center gap-3 px-3 py-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <FaDoorOpen size={24} />
                <p className="text-white text-sm font-medium">
                  {t("common.back") || "Back"}
                </p>
              </motion.button>
            </div>
          </motion.div>
        </div>
        <div className="flex flex-col w-full md:max-w-[960px]">
          <motion.div
            className="flex flex-wrap justify-between gap-3 p-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-2xl sm:text-[32px] font-bold tracking-tight">
              {t("admin.create_shipment") || "Create Shipment"}
            </p>
          </motion.div>
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <fetcher.Form
              method="post"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              {formSections.map((section, index) => (
                <FormSection
                  key={index}
                  title={section.title}
                  fields={section.fields}
                  formData={formData}
                  onInputChange={handleInputChange}
                />
              ))}
              <h3 className="text-lg font-bold tracking-[-0.015em] px-4 pb-2 pt-4">
                {t("admin.upload_image") || "Upload Package Image"}
              </h3>
              <div className="flex flex-col p-4">
                <motion.div
                  className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#55553a] px-6 py-10 sm:py-14"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-lg font-bold tracking-[-0.015em] text-center">
                    {t("admin.upload_image") || "Upload Image"}
                  </p>
                  <p className="text-sm font-normal text-center">
                    {t("admin.upload_instructions") ||
                      "Click to upload or drag and drop"}
                  </p>
                  <input
                    type="file"
                    name="imageUrl"
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
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
              </div>
              <div className="flex px-4 py-3 justify-end">
                <motion.button
                  type="submit"
                  className="min-w-[84px] w-full sm:max-w-[480px] rounded-lg h-10 px-4 bg-[#f9f506] text-[#181811] text-sm font-bold tracking-[0.015em]"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  disabled={fetcher.state !== "idle"}
                >
                  <span className="truncate">
                    {fetcher.state === "idle"
                      ? t("admin.create_shipment") || "Create Shipment"
                      : t("admin.creating") || "Creating..."}
                  </span>
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
