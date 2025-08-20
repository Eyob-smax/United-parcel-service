import { store } from "@/app/store";
import { createShipment, updateShipmentById } from "@/features/shipmentSlice";
import type { IShipment } from "@/lib/types";
import { supabase } from "@/supabase/supabase";

export async function shipment({ request }: { request: Request }) {
  const formData = await request.formData();
  const parcelId = formData.get("parcelId") as string;
  const imageUrl = formData.get("imageUrl") as File;
  const senderName = formData.get("senderName") as string;
  const senderAddress = formData.get("senderAddress") as string;
  const senderPhone = formData.get("senderPhone") as string;
  const status = formData.get("status") as
    | "pending"
    | "shipped off"
    | "on transit"
    | "delivered";
  const destination = formData.get("destination") as string;
  const origin = formData.get("origin") as string;
  const recipientName = formData.get("recipientName") as string;
  const recipientAddress = formData.get("recipientAddress") as string;
  const recipientPhone = formData.get("recipientPhone") as string;
  const pickupDate = formData.get("pickupDate") as string;
  const deliveryDate = formData.get("deliveryDate") as string;
  const packageName = formData.get("packageName") as string;
  const quantity = formData.get("quantity") as string;

  if (
    !senderName ||
    !destination ||
    !origin ||
    !recipientName ||
    !pickupDate ||
    !deliveryDate
  ) {
    return { success: false, error: "Missing required fields" };
  }

  if (!(imageUrl instanceof File)) {
    console.error("Invalid file type for imageUrl");
    return { success: false, error: "Invalid file" };
  }

  const fileName = `${Date.now()}-${
    imageUrl?.name.replace(/\s+/g, "_") || "default"
  }`;

  const { data: storageData, error: storageError } = await supabase.storage
    .from("united-parcel-service")
    .upload(fileName, imageUrl, {
      upsert: false,
      cacheControl: "3600",
      contentType: imageUrl?.type,
    });

  if (storageError) {
    console.error("Upload error:", storageError.message);
    return { success: false, error: storageError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from("united-parcel-service")
    .getPublicUrl(storageData.path);

  const shipmentData: IShipment = {
    parcel_id: parcelId,
    sender_name: senderName,
    sender_address: senderAddress,
    sender_phone_no: senderPhone,
    recipient_name: recipientName,
    recipient_address: recipientAddress,
    recipient_phone_no: recipientPhone,
    origin,
    destination,
    img_url: publicUrlData.publicUrl,
    pickup_date: pickupDate,
    delivery_date: deliveryDate,
    quantity: Number(quantity),
    package_name: packageName,
    status,
    destination_country: formData.get("destinationCountry") as string,
  };
  try {
    await store.dispatch(createShipment(shipmentData)).unwrap();
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }

  return { success: true, data: shipmentData };
}

export async function updateShipment({ request }: { request: Request }) {
  const formData = await request.formData();
  const parcelId = formData.get("parcelId") as string;
  const imageUrl = formData.get("imageUrl") as File | null;
  const senderName = formData.get("senderName") as string;
  const senderAddress = formData.get("senderAddress") as string;
  const senderPhone = formData.get("senderPhone") as string;
  const status = formData.get("status") as
    | "pending"
    | "shipped off"
    | "on transit"
    | "delivered";
  const destination = formData.get("destination") as string;
  const origin = formData.get("origin") as string;
  const recipientName = formData.get("recipientName") as string;
  const recipientAddress = formData.get("recipientAddress") as string;
  const recipientPhone = formData.get("recipientPhone") as string;
  const pickupDate = formData.get("pickupDate") as string;
  const deliveryDate = formData.get("deliveryDate") as string;
  const packageDescription = formData.get("packageDescription") as string;
  const packageName = formData.get("packageName") as string;
  const quantity = formData.get("quantity") as string;
  const destinationCountry = formData.get("destinationCountry") as string;

  if (
    !parcelId ||
    !senderName ||
    !destination ||
    !origin ||
    !recipientName ||
    !pickupDate ||
    !deliveryDate ||
    !packageName
  ) {
    return { success: false, error: "Missing required fields" };
  }

  let publicUrl = "";
  if (imageUrl instanceof File && imageUrl.size > 0) {
    const fileName = `${Date.now()}-${imageUrl.name.replace(/\s+/g, "_")}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("united-parcel-service")
      .upload(fileName, imageUrl, {
        upsert: true,
        cacheControl: "3600",
        contentType: imageUrl.type,
      });

    if (storageError) {
      console.error("Upload error:", storageError.message);
      return { success: false, error: storageError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("united-parcel-service")
      .getPublicUrl(storageData.path);
    publicUrl = publicUrlData.publicUrl;
  }

  const shipmentData: Partial<IShipment> = {
    sender_name: senderName,
    sender_address: senderAddress,
    sender_phone_no: senderPhone,
    recipient_name: recipientName,
    recipient_address: recipientAddress,
    recipient_phone_no: recipientPhone,
    origin,
    destination,
    img_url: publicUrl || undefined,
    pickup_date: pickupDate,
    delivery_date: deliveryDate,
    package_desc: packageDescription,
    status,
    package_name: packageName,
    quantity: Number(quantity),
    destination_country: destinationCountry,
  };

  try {
    const updatedShipment = await store
      .dispatch(updateShipmentById({ parcelId, shipmentData }))
      .unwrap();
    return { success: true, data: updatedShipment };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
