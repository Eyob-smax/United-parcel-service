import type { IAddressChangeRequest } from "@/lib/types";
import { supabase } from "@/supabase/supabase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  loading: boolean;
  error: null | string;
  requests: IAddressChangeRequest[];
};

const initialState: TInitialState = {
  error: null,
  loading: false,
  requests: [],
};

export const createRequest = createAsyncThunk(
  "changeAddress/createRequest",
  async (newRequest: IAddressChangeRequest, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("address_change_request")
      .insert(newRequest);

    if (error) {
      console.error("Error creating address change request:", error);
      return rejectWithValue(error.message);
    }

    return data;
  }
);

export const fetchRequests = createAsyncThunk(
  "changeAddress/fetchRequest",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("address_change_request")
      .select("*");

    if (error) {
      console.error("Error fetching address change requests:", error);
      return rejectWithValue(error.message);
    }
    console.log("Fetched address change requests:", data);
    return data;
  }
);

export const deleteRequest = createAsyncThunk(
  "changeAddress/deleteRequest",
  async (id: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("address_change_request")
      .delete()
      .eq("parcel_id", id);

    if (error) {
      console.error("Error deleting address change request:", error);
      return rejectWithValue(error.message);
    }

    return data;
  }
);

export const updateRequest = createAsyncThunk(
  "changeAddress/updateRequest",
  async (
    {
      parcel_id,
      new_address,
      old_address,
      status,
    }: Partial<IAddressChangeRequest>,
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase
      .from("address_change_request")
      .update({ parcel_id, new_address, old_address, status })
      .eq("parcel_id", parcel_id);

    if (error) {
      console.error("Error updating address change request:", error);
      return rejectWithValue(error.message);
    }

    return data;
  }
);

const changeAddressSlice = createSlice({
  name: "changeAddress",
  initialState: initialState,
  reducers: {
    updateSyncRequest: (state, { payload }) => {
      const index = state.requests.findIndex(
        (req) => req.parcel_id === payload.parcel_id
      );
      if (index !== -1) {
        state.requests[index] = payload;
      }
    },
    insertSyncRequest: (state, { payload }) => {
      state.requests.push(payload);
    },
    removeSyncRequest: (state, { payload }) => {
      state.requests = state.requests.filter(
        (req) => req.parcel_id !== payload.id
      );
    },
    clearSyncRequests: (state) => {
      state.requests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRequest.fulfilled, (state, { payload }) => {
        if (!payload) return;
        state.requests.push(payload);
        state.loading = false;
      })
      .addCase(createRequest.pending, (state) => {
        state.error = null;
        state.loading = true;
        state.requests = state.requests.reverse();
      })
      .addCase(createRequest.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      })
      .addCase(fetchRequests.fulfilled, (state, { payload }) => {
        state.requests = payload.reverse();
        state.loading = false;
      })
      .addCase(fetchRequests.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchRequests.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      });
  },
});

export const {
  updateSyncRequest,
  insertSyncRequest,
  removeSyncRequest,
  clearSyncRequests,
} = changeAddressSlice.actions;

export default changeAddressSlice.reducer;
