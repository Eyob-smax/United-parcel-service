import type { TAppDispatch, TRootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { fetchRequests, updateRequest } from "@/features/changeAddressSlice";
import { updateShipmentById } from "@/features/shipmentSlice";
import type { IAddressChangeRequest } from "@/lib/types";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// ✅ Responsive hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const AddressChangeRequest: React.FC = () => {
  const dispatch = useDispatch<TAppDispatch>();
  const { t } = useTranslation();
  const { requests, loading, error } = useSelector(
    (state: TRootState) => state.addressChange
  );

  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  // Retry on error
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: t("alerts.network_error") || "Network Error",
        text:
          t("alerts.failed_to_load_requests") ||
          "Failed to load requests. Retry?",
        showCancelButton: true,
        confirmButtonText: t("common.retry") || "Retry",
      }).then((result) => {
        if (result.isConfirmed) dispatch(fetchRequests());
      });
    }
  }, [error, dispatch, t]);

  const handleRequestAction = async (
    action: "Approve" | "Reject",
    parcelId: string,
    destination: string
  ) => {
    if (!parcelId) return;

    const status: IAddressChangeRequest["status"] =
      action === "Approve" ? "Approved" : "Rejected";

    if (status === "Approved" && destination) {
      await dispatch(
        updateShipmentById({ parcelId, shipmentData: { destination } })
      );
    }

    await dispatch(
      updateRequest({ parcel_id: parcelId, new_address: destination, status })
    );

    Swal.fire({
      icon: status === "Approved" ? "success" : "info",
      title: status === "Approved" ? t("alerts.success") : t("alerts.error"),
      text:
        status === "Approved"
          ? t("alerts.request_approved") || "The request has been approved."
          : t("alerts.request_rejected") || "The request has been rejected.",
    }).then(() => dispatch(fetchRequests()));
  };

  const columns: {
    key: keyof IAddressChangeRequest;
    label: string | React.ReactNode;
    render?: (
      val: IAddressChangeRequest[keyof IAddressChangeRequest]
    ) => React.ReactNode;
  }[] = useMemo(
    () => [
      {
        key: "parcel_id",
        label: t("address-change.parcel_id") || "Parcel ID",
      },
      {
        key: "old_address",
        label: t("address-change.old_address") || "Old Address",
      },
      {
        key: "new_address",
        label: t("address-change.new_address") || "New Address",
      },
      {
        key: "status",
        label: t("address-change.status") || "Status",
        render: (status: IAddressChangeRequest["status"]) => (
          <span
            className={
              status === "Approved"
                ? "text-green-500"
                : status === "Pending"
                ? "text-yellow-500"
                : "text-red-500"
            }
          >
            {status}
          </span>
        ),
      },
    ],
    [t]
  );

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#232110] overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between border-b border-b-[#4a4621] px-4 sm:px-6 md:px-10 py-3">
        <h2 className="text-white text-lg font-bold">
          {t("common.header_title") || "United Parcel Services"}
        </h2>
        <nav className="flex gap-4 sm:gap-8">
          {[
            { label: t("header.home"), to: "/home" },
            { label: t("header.dashboard"), to: "/admin-dashboard" },
            { label: t("header.request"), to: "/address-change-request" },
            { label: t("header.messages"), to: "/messages" },
          ].map((item) => (
            <Link
              key={item.label}
              className="text-white text-sm hover:underline"
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
        <div className="w-full max-w-5xl flex flex-col gap-6">
          <header>
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
              {t("address-change.title") || "Address Change Requests"}
            </h1>
            <p className="text-[#ccc68e] text-sm">
              {t("address-change.description") ||
                "Review and manage visitor requests for address changes."}
            </p>
          </header>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : requests.length === 0 ? (
            <p className="text-[#ccc68e] text-center py-10">
              {t("address-change.no-requests") || "No requests found."}
            </p>
          ) : !isMobile ? (
            // Desktop table
            <div className="overflow-hidden rounded-xl border border-[#6a642f]">
              <table className="w-full">
                <thead className="bg-[#353218]">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key as string}
                        className="px-4 py-3 text-left text-white"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-white">
                      {t("address-change.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr
                      key={request.parcel_id}
                      className="border-t border-t-[#6a642f]"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key as string}
                          className="px-4 py-2 text-[#ccc68e]"
                        >
                          {col.render
                            ? col.render(
                                request[col.key as keyof IAddressChangeRequest]
                              )
                            : request[col.key as keyof IAddressChangeRequest]}
                        </td>
                      ))}
                      <td className="flex gap-2 px-4 py-2">
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() =>
                            handleRequestAction(
                              "Approve",
                              request.parcel_id,
                              request.new_address
                            )
                          }
                        >
                          {t("address-change.approve") || "Approve"}
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() =>
                            handleRequestAction(
                              "Reject",
                              request.parcel_id,
                              request.new_address
                            )
                          }
                        >
                          {t("address-change.reject") || "Reject"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Mobile cards
            <div className="flex flex-col gap-4">
              {requests.map((request) => (
                <div
                  key={request.parcel_id}
                  className="rounded-xl border border-[#6a642f] bg-[#232110] p-4"
                >
                  {columns.map((col) => (
                    <div
                      key={col.key as string}
                      className="flex justify-between text-sm mb-1"
                    >
                      <span className="text-white">{col.label}</span>
                      <span className="text-[#ccc68e]">
                        {col.render
                          ? col.render(
                              request[col.key as keyof IAddressChangeRequest]
                            )
                          : request[col.key as keyof IAddressChangeRequest]}
                      </span>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white flex-1"
                      onClick={() =>
                        handleRequestAction(
                          "Approve",
                          request.parcel_id,
                          request.new_address
                        )
                      }
                    >
                      {t("address-change.approve") || "Approve"}
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white flex-1"
                      onClick={() =>
                        handleRequestAction(
                          "Reject",
                          request.parcel_id,
                          request.new_address
                        )
                      }
                    >
                      {t("address-change.reject") || "Reject"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddressChangeRequest;
