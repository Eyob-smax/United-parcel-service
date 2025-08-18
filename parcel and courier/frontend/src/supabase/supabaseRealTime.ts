import {
  insertSyncRequest,
  removeSyncRequest,
  updateSyncRequest,
} from "@/features/changeAddressSlice";
import { supabase } from "./supabase";
import { type TAppDispatch } from "@/app/store";

export const initRealtime = (dispatch: TAppDispatch) => {
  const channel = supabase.channel("address_change_request");

  channel.on("broadcast", { event: "INSERT" }, ({ payload }) => {
    console.log(payload);
    dispatch(insertSyncRequest(payload));
  });

  channel.on("broadcast", { event: "UPDATE" }, ({ payload }) => {
    dispatch(updateSyncRequest(payload));
  });

  channel.on("broadcast", { event: "DELETE" }, ({ payload }) => {
    dispatch(removeSyncRequest(payload.parcel_id));
  });

  channel.subscribe();

  return channel;
};

export const sendRealtimeEvent = (
  event: "INSERT" | "UPDATE" | "DELETE",
  data: unknown
) => {
  supabase.channel("address_change_request").send({
    type: "broadcast",
    event,
    payload: data,
  });
};
