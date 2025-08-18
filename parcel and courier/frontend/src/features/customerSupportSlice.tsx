import type { ICustomerSupport } from "@/lib/types";
import { supabase } from "@/supabase/supabase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  loading: boolean;
  error: string | null;
  messages: ICustomerSupport[];
};

const initialState: TInitialState = {
  loading: false,
  error: null,
  messages: [],
};

export const createMessage = createAsyncThunk(
  "customerSupport/createMessage",
  async (message: ICustomerSupport, { rejectWithValue }) => {
    let publicUrl: string | null = null;

    if (message.attachment instanceof File && message.attachment.size > 0) {
      const fileName = `${Date.now()}-${message.attachment.name.replace(
        /\s+/g,
        "_"
      )}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("united-parcel-service_customer-service")
        .upload(fileName, message.attachment, {
          upsert: true,
          cacheControl: "3600",
          contentType: message.attachment.type,
        });

      if (storageError) {
        console.error("Upload error:", storageError.message);
        return rejectWithValue(storageError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("united-parcel-service_customer-service")
        .getPublicUrl(storageData.path);
      publicUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("customer_support")
      .insert({
        message: message.message,
        email: message.email,
        img_url: publicUrl,
        name: message.name,
      })
      .select("*");
    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data[0] as ICustomerSupport;
  }
);

export const fetchMessages = createAsyncThunk(
  "customerSupport/fetchMessages",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from("customer_support").select("*");
    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const deleteMessageById = createAsyncThunk(
  "customerSupport/deleteMessage",
  async (id: string, { rejectWithValue }) => {
    const { error } = await supabase
      .from("customer_support")
      .delete()
      .eq("support_id", id);
    if (error) {
      return rejectWithValue(error.message);
    }
    return id;
  }
);

const customerSupportSlice = createSlice({
  name: "customerSupport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    });
    builder
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, { payload }) => {
        if (!payload) return;
        state.loading = false;
        state.messages.push(payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMessageById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMessageById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.messages = state.messages.filter(
          (message) => message.support_id !== payload
        );
      })
      .addCase(deleteMessageById.rejected, (state, { payload }) => {
        state.error = payload as string;
      });
  },
});

export default customerSupportSlice.reducer;
