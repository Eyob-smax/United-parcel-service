import { useCallback, useEffect } from "react";
import type { TAppDispatch, TRootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchShipments } from "@/features/shipmentSlice";
import {
  addTransitHistory,
  updateTransitHistory,
} from "@/features/transitStatusSlice";
import type { ITransportHistory } from "@/lib/types";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

interface TrackingFormProps {
  event: ITransportHistory;
  type: "Edit" | "Add";
  onClose: () => void;
}

interface FormField {
  id: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  type: string;
}

const TrackingForm: React.FC<TrackingFormProps> = ({
  event,
  type,
  onClose,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<TAppDispatch>();
  const { error, loading } = useSelector((state: TRootState) => state.transit);

  const showAlert = useCallback(
    (
      icon: "error" | "warning" | "info" | "success",
      title: string,
      text: string,
      confirmText = "OK"
    ) => {
      Swal.fire({
        icon,
        title,
        text,
        confirmButtonText: confirmText,
        customClass: {
          popup:
            "rounded-2xl shadow-xl bg-white dark:bg-gray-900 max-w-sm sm:max-w-md",
          title: "text-lg font-semibold text-gray-900 dark:text-white",
          htmlContainer: "text-sm text-gray-600 dark:text-gray-300",
          confirmButton:
            "bg-[#f9e106] text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-300",
        },
        buttonsStyling: false,
      });
    },
    []
  );

  useEffect(() => {
    if (error) showAlert("error", "Oops...", error, "Retry");
  }, [error, showAlert]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const payload = {
        transport_id: formData.get("transport_id") as string,
        current_location: (formData.get("currentLocation") as string)?.trim(),
        current_date: formData.get("currentDate") as string,
        current_time: new Date().toLocaleTimeString(),
        parcel_id: event.parcel_id,
        current_country: (formData.get("currentCountry") as string)?.trim(),
      };

      if (
        !payload.current_location ||
        !payload.current_date ||
        !payload.current_country
      ) {
        showAlert(
          "warning",
          t("alerts.error") || "Missing Fields",
          t("alerts.missing_information")
        );
        return;
      }

      if (type === "Edit") {
        await dispatch(updateTransitHistory(payload));
      } else {
        await dispatch(addTransitHistory(payload));
      }

      await dispatch(fetchShipments());
      onClose();
    },
    [dispatch, event.parcel_id, onClose, type, showAlert, t]
  );

  const formFields: FormField[] = [
    {
      id: "currentLocation",
      label: t("tracking.current_location") || "Current Location",
      placeholder: "e.g Addis Ababa",
      defaultValue: type === "Edit" ? event.current_location : "",
      type: "text",
    },
    {
      id: "currentCountry",
      label: t("tracking.current_country") || "Current Country",
      placeholder: "e.g Ethiopia",
      defaultValue: type === "Edit" ? event.current_country : "",
      type: "text",
    },
    {
      id: "currentDate",
      label: t("tracking.current_date") || "Current Date",
      defaultValue: type === "Edit" ? event.current_date : "",
      type: "date",
    },
  ];

  const FormFieldInput: React.FC<FormField> = ({
    id,
    label,
    placeholder,
    defaultValue,
    type,
  }) => (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg p-4 text-sm font-normal focus:outline-none border border-[#f9e106] placeholder:text-[#bbba9b]"
      />
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 md:px-10">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {formFields.map((field) => (
            <FormFieldInput key={field.id} {...field} />
          ))}
        </div>

        <Input type="hidden" value={event.transport_id} name="transport_id" />

        <div className="w-full mt-6 flex justify-center">
          <Button
            type="submit"
            className="px-6 py-2 rounded-md text-sm font-bold tracking-tight border border-[#f9e106] hover:bg-yellow-400"
            disabled={loading}
          >
            {loading ? `${type}ing...` : type}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TrackingForm;
