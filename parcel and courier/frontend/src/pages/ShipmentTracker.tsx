import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L, { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaTruck, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { TAppDispatch, TRootState } from "@/app/store";
import type { IShipment } from "@/lib/types";
import { fetchShipments } from "@/features/shipmentSlice";
import { createRequest } from "@/features/changeAddressSlice";
import { initRealtime, sendRealtimeEvent } from "@/supabase/supabaseRealTime";
import { supabase } from "@/supabase/supabase";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// -------------------- Map Helpers --------------------
function FitBounds({ points }: { points: LatLngTuple[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length)
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 12 });
  }, [map, points]);
  return null;
}

function ChangeCenter({ center }: { center?: LatLngTuple }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// -------------------- Address Form --------------------
function AddressForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (value: string) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
      className="mt-3 space-y-2"
    >
      <label className="block text-sm text-[#ccc68e]">
        {t("tracker.provide_address") || "Provide new Address"}
        <input
          placeholder={t("tracker.address_placeholder") || "e.g. Lagos"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 w-full rounded-md bg-[#232110] border border-[#3b3b2a] px-3 py-2 text-white text-sm"
        />
      </label>
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onCancel}>
          {t("common.cancel") || "Cancel"}
        </Button>
        <Button
          type="submit"
          variant="secondary"
          className="bg-[#f9e106]  text-[#232110]"
        >
          {t("common.submit") || "Submit"}
        </Button>
      </div>
    </form>
  );
}

// -------------------- Shipment Progress --------------------
function ShipmentProgress({
  transportHistory,
  onMarkerClick,
}: {
  transportHistory: IShipment["transport_history"];
  onMarkerClick: (coord: LatLngTuple) => void;
}) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4 max-h-full overflow-y-scroll">
      {transportHistory?.map((ev, index) => {
        const isFirst = index === 0;
        const isLast = index === transportHistory.length - 1;
        const Icon = isFirst
          ? FaMapMarkerAlt
          : isLast
          ? FaCheckCircle
          : FaTruck;
        const color = isFirst ? "#f9e106" : isLast ? "green" : "#f9e106";
        const status = isFirst
          ? t("tracker.shipped") || "Shipped"
          : isLast
          ? t("tracker.delivered") || "Delivered"
          : t("tracker.in_transit") || "In Transit";
        return (
          <div
            key={ev.transport_id}
            className="flex gap-3 items-start cursor-pointer"
            onClick={() => onMarkerClick(ev.coordinates as LatLngTuple)}
          >
            <div className="mt-1 text-[color]">
              <Icon style={{ color }} />
            </div>
            <div>
              <p className="font-medium">{status}</p>
              <p className="text-[#ccc68e] text-sm">{ev.current_time}</p>
              <p className="text-sm mt-1">{ev.current_location}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -------------------- Main Component --------------------
export default function ShipmentTracker() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<TAppDispatch>();

  const [shipment, setShipment] = useState<IShipment | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [center, setCenter] = useState<LatLngTuple>([51.505, -0.09]);
  const mapRef = useRef(null);

  const { shipment: shipments, loading } = useSelector(
    (state: TRootState) => state.shipment
  );

  useEffect(() => {
    if (!shipments.length) dispatch(fetchShipments());
  }, [dispatch, shipments]);

  useEffect(() => {
    const found = shipments.find((s) => s.parcel_id === id);
    if (found) {
      setShipment(found);
      const coords = found.transport_history?.[0]?.coordinates;
      if (coords?.length === 2) setCenter(coords as LatLngTuple);
    }
  }, [id, shipments]);

  const routes: LatLngTuple[] = useMemo(
    () =>
      shipment?.transport_history?.map((h) => h.coordinates as LatLngTuple) ||
      [],
    [shipment]
  );

  const handleAddressSubmit = async (newAddress: string) => {
    if (!shipment) return;
    await dispatch(
      createRequest({
        parcel_id: shipment.parcel_id,
        new_address: newAddress,
        old_address: shipment.destination!,
      })
    );
    sendRealtimeEvent("INSERT", {
      parcel_id: shipment.parcel_id,
      new_address: newAddress,
      old_address: shipment.destination!,
    });
    await Swal.fire({
      title: t("tracker.success") || "Success!",
      text: t("tracker.address_submitted") || "Address change submitted.",
      icon: "success",
    });
    setShowAddressForm(false);
  };

  useEffect(() => {
    const channel = initRealtime(dispatch);
    return () => void supabase.removeChannel(channel);
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#232110]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#f9e106] animate-pulse" />
          <p className="text-white font-semibold">
            {t("tracker.loading_info") || "Loading Tracking Info..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#232110] text-white font-sans">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between border-b border-[#4a4621] px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <FaTruck size={24} className="text-[#f9e106]" />
          <h1 className="text-lg font-bold">
            {t("common.welcome") || "United Parcel Service"}
          </h1>
        </div>
        <nav className="flex flex-wrap items-center gap-3 mt-2 sm:mt-0 sm:gap-5">
          <Button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {t("common.contact") || "Contact"}
          </Button>
          <Button className="rounded-full bg-[#4a4621] px-4 py-2 text-sm">
            {t("common.login") || "Login"}
          </Button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Tracking & Image */}
        <section className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold">
              {t("tracker.tracking_details") || "Tracking Details"}
            </h2>
            <p className="text-[#ccc68e]">
              {t("tracker.tracking_id") || "Tracking ID"}: {shipment?.parcel_id}
            </p>
            <div className="mt-4 bg-[#181811] p-4 rounded-xl">
              <p className="font-semibold">
                {t("tracker.package_info") || "Package Information"}
              </p>
              <p className="text-[#ccc68e]">
                {t("tracker.estimated_delivery") || "Estimated Delivery"}: {shipment?.delivery_date}
              </p>
              <div className="mt-3">
                <Button
                  onClick={() => navigate(`/parcel/${shipment?.parcel_id}`)}
                >
                  {t("tracker.view_details") || "View Details"}
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-96 mt-2 md:mt-0">
            <img
              src={shipment?.img_url}
              alt={t("tracker.package_preview") || "Package preview"}
              className="w-full h-48 sm:h-56 object-cover rounded-xl shadow-md"
            />
          </div>
        </section>

        {/* Map & Progress */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="bg-[#181811] p-4 rounded-xl">
            <h3 className="font-semibold mb-3">
              {t("tracker.map_route") || "Map & Route"}
            </h3>
            <MapContainer
              ref={mapRef}
              className="h-64 sm:h-96 w-full rounded-md"
              center={center}
              zoom={6}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <FitBounds points={routes.length ? routes : [[51.505, -0.09]]} />
              <Polyline
                positions={routes}
                pathOptions={{ color: "#1be73d", weight: 4 }}
              />
              <ChangeCenter center={center} />
              {shipment?.transport_history?.map((ev) => (
                <Marker
                  key={ev.transport_id}
                  position={ev.coordinates || [51.505, -0.09]}
                  icon={
                    new L.Icon({
                      iconUrl: markerIcon,
                      iconRetinaUrl: markerIcon2x,
                      shadowUrl: markerShadow,
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [0, -41],
                    })
                  }
                >
                  <Popup>
                    <div className="max-w-xs">
                      <p className="font-semibold">{ev.current_location}</p>
                      <p className="text-sm text-[#ccc68e]">
                        {ev.current_country}
                      </p>
                      <p className="mt-2 text-sm">{ev.current_time}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <div className="mt-3 flex justify-end">
              <Button
                className="bg-[#f9e106] text-[#232110]"
                onClick={() => setShowAddressForm((s) => !s)}
              >
                {t("tracker.change_address") || "Need a change of delivery address?"}
              </Button>
            </div>

            {showAddressForm && (
              <AddressForm
                onSubmit={handleAddressSubmit}
                onCancel={() => setShowAddressForm(false)}
              />
            )}
          </div>

          <aside className="bg-[#181811] p-4 rounded-xl">
            <h4 className="font-semibold mb-3">
              {t("tracker.shipment_progress") || "Shipment Progress"}
            </h4>
            <ShipmentProgress
              transportHistory={shipment?.transport_history}
              onMarkerClick={setCenter}
            />
          </aside>
        </section>

        <footer
          id="contact"
          className="mt-8 text-center text-[#ccc68e] text-sm"
        >
          {t("tracker.contact_us") || "Contact us at"}{" "}
          <a
            className="text-[#f9e106]"
            href="mailto:unitedparcels880@gmail.com"
          >
            unitedparcels880@gmail.com
          </a>{" "}
          {t("tracker.or_whatsapp") || "or WhatsApp"}{" "}
          <a className="text-[#f9e106]" href="https://wa.me/31610928914">
            +31610928914
          </a>
          .
        </footer>
      </main>
    </div>
  );
}