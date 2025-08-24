import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ITransportHistory } from "@/lib/types";

interface TrackingFormProps {
  event?: ITransportHistory;
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
      className="w-full rounded-lg p-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#f9e106] border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
    />
  </div>
);

const TrackingForm: React.FC<TrackingFormProps> = ({
  event,
  type,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const showAlert = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const formData = new FormData(e.currentTarget);

      const payload = {
        current_location: (formData.get("currentLocation") as string)?.trim(),
        current_date: formData.get("currentDate") as string,
        current_time: new Date().toLocaleTimeString(),
        parcel_id: event?.parcel_id,
        current_country: (formData.get("currentCountry") as string)?.trim(),
      };

      if (
        !payload.current_location ||
        !payload.current_date ||
        !payload.current_country
      ) {
        setLoading(false);
        showAlert("Please provide all required information.");
        return;
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (type === "Edit") {
          console.log("Simulating updateTransitHistory with payload:", payload);
        } else {
          console.log("Simulating addTransitHistory with payload:", payload);
        }
        showAlert(
          `Success! ${type === "Edit" ? "Updated" : "Added"} tracking event.`
        );
        onClose();
      } catch (err) {
        setError(
          "An unexpected error occurred. Please try again." +
            (err as Error).message
        );
      } finally {
        setLoading(false);
      }
    },
    [event, onClose, type, showAlert]
  );

  const formFields: FormField[] = [
    {
      id: "currentLocation",
      label: "Current Location",
      placeholder: "e.g. Addis Ababa",
      defaultValue: type === "Edit" ? event?.current_location : "",
      type: "text",
    },
    {
      id: "currentCountry",
      label: "Current Country",
      placeholder: "e.g. Ethiopia",
      defaultValue: type === "Edit" ? event?.current_country : "",
      type: "text",
    },
    {
      id: "currentDate",
      label: "Current Date",
      defaultValue: type === "Edit" ? event?.current_date : "",
      type: "date",
    },
  ];

  return (
    <div className="w-full max-w-4xl p-6 md:p-8 lg:p-10 mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        {type === "Add" ? "Add" : "Edit"} Tracking
      </h2>
      {message && (
        <div
          className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
          role="alert"
        >
          {message}
        </div>
      )}
      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200"
          role="alert"
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formFields.map((field) => (
            <FormFieldInput key={field.id} {...field} />
          ))}
        </div>

        {event?.transport_id && (
          <Input type="hidden" value={event.transport_id} name="transport_id" />
        )}

        <div className="w-full mt-8 flex justify-center">
          <Button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold tracking-wide border border-[#f9e106] bg-[#f9e106] text-gray-900 shadow-md hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading
              ? type === "Add"
                ? "Adding..."
                : "Editing..."
              : type === "Add"
              ? "Add"
              : "Edit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TrackingForm;
