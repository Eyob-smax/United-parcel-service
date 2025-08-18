import type { TAppDispatch, TRootState } from "@/app/store";
import Form from "@/components/Form";
import { fetchShipments } from "@/features/shipmentSlice";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function TrackIDInput() {
  const [parcelID, setParcelID] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<TAppDispatch>();
  const { shipment } = useSelector((state: TRootState) => state.shipment);

  useEffect(() => {
    if (!shipment?.length) dispatch(fetchShipments());
  }, [dispatch, shipment]);

  useEffect(() => {
    if (parcelID.toLowerCase() === "admin") {
      Swal.fire({
        title: t("alerts.redirecting") || "Redirecting...",
        text:
          t("alerts.admin_redirect") ||
          "You are being redirected to the admin login page.",
        icon: "info",
        timer: 1000,
        background: "#232110",
        color: "#bbba9b",
        showConfirmButton: false,
      }).then(() => navigate("/admin-login"));
    }
  }, [parcelID, navigate, t]);

  const track = useCallback(
    async (id: string) => {
      if (!id) return;

      const found = shipment?.find(
        (s) => s.parcel_id.toLowerCase().trim() === id.toLowerCase().trim()
      );

      if (!found) {
        await Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "No shipment found with the provided ID.",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: t("alerts.success") || "Shipment Found",
        text:
          t("alerts.parcel_found", { id }) || `Shipment with ID ${id} found.`,
      });

      navigate(`/shipment-tracking/${id}`);
    },
    [shipment, navigate, t]
  );

  return (
    <Form
      key={"parcel_tracking"}
      forWhich="parcel_tracking"
      onContinue={() => track(parcelID)}
      setParcelID={setParcelID}
      parcelID={parcelID}
    />
  );
}
