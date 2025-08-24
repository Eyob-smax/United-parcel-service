import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaCalendarAlt, FaDoorOpen } from "react-icons/fa";
import { useFetcher, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { IShipment } from "@/lib/types";
import type { TAppDispatch, TRootState } from "@/app/store";
import { useTranslation } from "react-i18next";
import { fetchShipments } from "@/features/shipmentSlice";
import Swal from "sweetalert2";

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
  package_name: string;
  quantity: number;
  destinationCountry: string;
}

interface EditShipmentProps {
  onLogout: () => void;
}
const EditShipment: React.FC<EditShipmentProps> = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<TAppDispatch>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  console.log(image);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const {
    shipment: shipments,
    loading,
    error: shipmentError,
  } = useSelector((state: TRootState) => state.shipment);

  const { authenticated } = useSelector((state: TRootState) => state.user);

  useEffect(() => {
    if (!authenticated) {
      Swal.fire({
        title: t("alerts.unauthorized") || "Unauthorized",
        text:
          t("alerts.authorization_error") ||
          "You need to be logged in to edit shipments.",
        icon: "warning",
      }).then(() => {
        navigate("/home");
      });
    }
  }, [authenticated, navigate, t]);

  const [currentShipment, setCurrentShipment] = useState<IShipment | undefined>(
    undefined
  );

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
    package_name: "",
    quantity: 1,
    destinationCountry: "",
  });

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      const found = await Promise.resolve(
        shipments.find((s: IShipment) => s.parcel_id === id)
      );
      setCurrentShipment(found);
      console.log(shipments, id);
      if (found) {
        setFormData({
          parcelId: found.parcel_id || "",
          senderName: found.sender_name || "",
          senderAddress: found.sender_address || "",
          senderPhone: found.sender_phone_no || "",
          recipientName: found.recipient_name || "",
          recipientAddress: found.recipient_address || "",
          recipientPhone: found.recipient_phone_no || "",
          origin: found.origin || "",
          destination: found.destination || "",
          packageDescription: found.package_desc || "",
          pickupDate: found.pickup_date || "",
          deliveryDate: found.delivery_date || "",
          status: found.status || "pending",
          package_name: found.package_name || "",
          quantity: found.quantity || 1,
          destinationCountry: found.destination_country || "",
        });
        setImagePreview(found.img_url || null);
      }
    })();
  }, [shipments, id, dispatch]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      // setFormData({
      //   parcelId: "",
      //   senderName: "",
      //   senderAddress: "",
      //   senderPhone: "",
      //   recipientName: "",
      //   recipientAddress: "",
      //   recipientPhone: "",
      //   origin: "",
      //   destination: "",
      //   packageDescription: "",
      //   pickupDate: "",
      //   deliveryDate: "",
      //   status: "pending",
      //   package_name: "",
      //   quantity: 1,
      //   destinationCountry: "",
      // });
      // setImage(null);
      // setImagePreview(null);
      navigate("/admin-dashboard");
    }
  }, [fetcher.data, navigate]);

  if (shipmentError) {
    Swal.fire({
      icon: "error",
      title: t("alerts.network_error"),
      text: t("alerts.something_went_wrong") + shipmentError,
    });
  }

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
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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
      setImagePreview(currentShipment?.img_url || null);
    }
  };

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  useEffect(() => {
    if (fetcher.data && !fetcher.data.success) {
      if (fetcher.data.error === "Missing required fields") {
        Swal.fire({
          icon: "error",
          title: t("alerts.error"),
          text: t("alerts.missing_information") + fetcher.data.error,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("alerts.error"),
          text: t("alerts.something_went_wrong") + fetcher.data.error,
        });
      }
    }
  }, [fetcher.data, t]);

  if (fetcher.state === "submitting" || fetcher.state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#232110]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#f9e106] animate-pulse" />
          <p className="text-white font-semibold">
            {t("admin.updating_shipment") || "Updating Shipment..."}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#232110]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#f9e106] animate-pulse" />
          <p className="text-white font-semibold">
            {t("admin.loading_details") || "loading Shipment..."}
          </p>
        </div>
      </div>
    );
  }

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
                <FaEdit size={24} />
                <p className="text-white text-sm font-medium">
                  {t("admin.edit_shipment") || "Edit Shipment"}
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
              {t("admin.edit_shipment") || "Edit Shipment"}
            </p>
          </motion.div>
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <fetcher.Form method="put" encType="multipart/form-data">
              <h3 className="text-lg font-bold tracking-[-0.015em] px-4 pb-2 pt-4">
                {t("admin.parcel_info") || "Parcel Information"}
              </h3>
              {[
                {
                  label: t("admin.parcel_id") || "Parcel ID",
                  name: "parcelId",
                  placeholder: t("admin.enter_parcel_id") || "Enter parcel ID",
                  readOnly: true,
                },
                {
                  label: t("admin.package_name") || "Package Name",
                  name: "packageName",
                  placeholder:
                    t("admin.enter_package_name") || "Enter package name",
                },
                {
                  label: t("admin.quantity") || "Quantity",
                  name: "quantity",
                  placeholder: t("admin.enter_quantity") || "Enter quantity",
                  type: "number",
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
                >
                  <label
                    htmlFor={field.name}
                    className="flex flex-col min-w-40 flex-1"
                  >
                    <p className="text-base font-medium pb-2">{field.label}</p>
                    <input
                      name={field.name}
                      id={field.name}
                      defaultValue={formData[field.name as keyof FormData]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      type={field.type || "text"}
                      readOnly={field.readOnly || false}
                      className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] placeholder:text-[#bbba9b]"
                    />
                  </label>
                </div>
              ))}
              <h3 className="text-lg font-bold tracking-[-0.015em] px-4 pb-2 pt-4">
                {t("admin.sender_details") || "Sender Details"}
              </h3>
              {[
                {
                  label: t("login-forms.common.username") || "Name",
                  name: "senderName",
                  placeholder:
                    t("admin.enter_sender_name") || "Enter sender's name",
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
                    t("admin.enter_sender_phone") ||
                    "Enter sender's phone number",
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
                >
                  <label
                    htmlFor={field.name}
                    className="flex flex-col min-w-40 flex-1"
                  >
                    <p className="text-base font-medium pb-2">{field.label}</p>
                    <input
                      name={field.name}
                      id={field.name}
                      defaultValue={formData[field.name as keyof FormData]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] placeholder:text-[#bbba9b]"
                    />
                  </label>
                </div>
              ))}
              <h3 className="text-lg font-bold tracking-[-0.015em] px-4 pb-2 pt-4">
                {t("admin.recipient_details") || "Recipient Details"}
              </h3>
              {[
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
                    t("admin.enter_recipient_address") ||
                    "Enter recipient's address",
                },
                {
                  label: t("admin.phone_number") || "Phone Number",
                  name: "recipientPhone",
                  placeholder:
                    t("admin.enter_recipient_phone") ||
                    "Enter recipient's phone number",
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
                >
                  <label
                    htmlFor={field.name}
                    className="flex flex-col min-w-40 flex-1"
                  >
                    <p className="text-base font-medium pb-2">{field.label}</p>
                    <input
                      name={field.name}
                      id={field.name}
                      defaultValue={formData[field.name as keyof FormData]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] placeholder:text-[#bbba9b]"
                    />
                  </label>
                </div>
              ))}
              <h3 className="text-lg font-bold tracking-[-0.015em] px-4 pb-2 pt-4">
                {t("admin.origin_destination") || "Origin & Destination"}
              </h3>
              {[
                {
                  label: t("admin.origin") || "Origin",
                  name: "origin",
                  placeholder: t("admin.enter_origin") || "Enter origin",
                },
                {
                  label: t("admin.destination") || "Destination",
                  name: "destination",
                  placeholder:
                    t("admin.enter_destination") || "Enter destination",
                },
                {
                  label:
                    t("admin.destination_country") || "Destination Country",
                  name: "destinationCountry",
                  placeholder:
                    t("admin.enter_destination_country") ||
                    "Enter destination country",
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
                >
                  <label
                    htmlFor={field.name}
                    className="flex flex-col min-w-40 flex-1"
                  >
                    <p className="text-base font-medium pb-2">{field.label}</p>
                    <input
                      name={field.name}
                      id={field.name}
                      defaultValue={formData[field.name as keyof FormData]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] placeholder:text-[#bbba9b]"
                    />
                  </label>
                </div>
              ))}
              <h3 className="text-lg font-bold tracking-[-0.015em] px-4 pb-2 pt-4">
                {t("admin.package_details") || "Package Details"}
              </h3>
              {[
                {
                  label: t("admin.description") || "Description",
                  name: "packageDescription",
                  placeholder:
                    t("admin.enter_package_desc") ||
                    "Enter package description",
                  type: "textarea",
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
                >
                  <label
                    htmlFor={field.name}
                    className="flex flex-col min-w-40 flex-1"
                  >
                    <p className="text-base font-medium pb-2">{field.label}</p>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        id={field.name}
                        defaultValue={formData[field.name as keyof FormData]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-32 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] placeholder:text-[#bbba9b]"
                      />
                    ) : (
                      <input
                        name={field.name}
                        id={field.name}
                        defaultValue={formData[field.name as keyof FormData]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] placeholder:text-[#bbba9b]"
                      />
                    )}
                  </label>
                </div>
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
              <h3 className="text-lg font-bold tracking-[-0.015em] px-4 pb-2 pt-4">
                {t("admin.shipping_dates") || "Shipping Dates"}
              </h3>
              {[
                {
                  label: t("admin.pickup_date") || "Pickup Date",
                  name: "pickupDate",
                  placeholder:
                    t("admin.select_pickup_date") || "Select pickup date",
                },
                {
                  label: t("admin.delivery_date") || "Delivery Date",
                  name: "deliveryDate",
                  placeholder:
                    t("admin.select_delivery_date") || "Select delivery date",
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
                >
                  <label
                    htmlFor={field.name}
                    className="flex flex-col min-w-40 flex-1"
                  >
                    <p className="text-base font-medium pb-2">{field.label}</p>
                    <div className="flex w-full items-stretch rounded-lg">
                      <input
                        name={field.name}
                        id={field.name}
                        defaultValue={formData[field.name as keyof FormData]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        type="date"
                        className="w-full rounded-lg rounded-r-none bg-[#27271b] border border-[#55553a] border-r-0 h-14 p-[15px] pr-2 text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] placeholder:text-[#bbba9b]"
                      />
                      <div className="flex items-center justify-center pr-[15px] rounded-r-lg border border-[#55553a] border-l-0 bg-[#27271b]">
                        <FaCalendarAlt size={24} className="text-[#bbba9b]" />
                      </div>
                    </div>
                  </label>
                </div>
              ))}
              <h3 className="text-lg font-bold tracking-[-0.015em] px-4 pb-2 pt-4">
                {t("admin.transport_info") || "Transport Information"}
              </h3>
              <div className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label
                  htmlFor="status"
                  className="flex flex-col min-w-40 flex-1"
                >
                  <p className="text-base font-medium pb-2">
                    {t("admin.status") || "Status"}
                  </p>
                  <select
                    name="status"
                    id="status"
                    defaultValue={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-[#27271b] border border-[#55553a] h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-0 focus:border-[#55553a] placeholder:text-[#bbba9b]"
                  >
                    <option value="pending">
                      {t("admin.status_pending") || "Pending"}
                    </option>
                    <option value="shipped off">
                      {t("admin.status_shipped") || "Shipped off"}
                    </option>
                    <option value="on transit">
                      {t("admin.status_transit") || "On transit"}
                    </option>
                    <option value="delivered">
                      {t("admin.status_delivered") || "Delivered"}
                    </option>
                  </select>
                </label>
              </div>
              <div className="flex px-4 py-3 justify-end">
                <motion.button
                  type="submit"
                  className="min-w-[84px] w-full sm:max-w-[480px] rounded-lg h-10 px-4 bg-[#f9f506] text-[#181811] text-sm font-bold tracking-[0.015em]"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="truncate">
                    {fetcher.state === "idle"
                      ? t("admin.update_shipment") || "Update Shipment"
                      : t("admin.updating") || "Updating..."}
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

export default EditShipment;
