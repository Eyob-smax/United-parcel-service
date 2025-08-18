import type { TAppDispatch, TRootState } from "@/app/store";
import Form from "@/components/Form";
import { fetchShipments } from "@/features/shipmentSlice";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function TrackIDInput() {
  const [parcelID, setParcelID] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch<TAppDispatch>();
  const { shipment } = useSelector((state: TRootState) => state.shipment);

  // Fetch shipments if not already loaded
  useEffect(() => {
    if (!shipment?.length) dispatch(fetchShipments());
  }, [dispatch, shipment]);

  // Handle admin redirect
  useEffect(() => {
    if (parcelID.toLowerCase() === "admin") {
      Swal.fire({
        title: "Redirecting...",
        text: "You are being redirected to the admin login page.",
        icon: "info",
        timer: 1000,
        background: "#232110",
        color: "#bbba9b",
        showConfirmButton: false,
      }).then(() => navigate("/admin-login"));
    }
  }, [parcelID, navigate]);

  // Track shipment
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
        title: "Found",
        text: `Shipment found: ${found.parcel_id}`,
      });

      navigate(`/shipment-tracking/${id}`);
    },
    [shipment, navigate]
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
