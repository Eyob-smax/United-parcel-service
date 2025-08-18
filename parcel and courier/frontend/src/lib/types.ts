export interface IShipment {
  shipment_id?: string;
  parcel_id: string;
  sender_name: string;
  sender_address: string;
  sender_phone_no: string;
  recipient_name: string;
  recipient_phone_no: string;
  recipient_address: string;
  origin: string;
  destination: string;
  destination_country?: string;
  img_url: string;
  pickup_date: string;
  delivery_date: string;
  package_desc?: string;
  package_name: string;
  quantity: number;
  status: "pending" | "shipped off" | "on transit" | "delivered";
  transport_history?: ITransportHistory[];
}

export interface ICustomerSupport {
  support_id?: string;
  message: string;
  email: string;
  attachment?: File | null;
  img_url?: string;
  name?: string;
}

export interface IAddressChangeRequest {
  parcel_id: string;
  new_address: string;
  old_address: string;
  status?: string;
}

export interface ITransportHistory {
  parcel_id: string;
  transport_id?: string;
  current_location: string;
  current_country: string;
  current_date: string;
  current_time: string;
  coordinates?: [number, number] | null;
}
