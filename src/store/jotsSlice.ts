import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jotApi from "api/jotApi";
import { RootState } from "store";
import { Jot } from "types";

export type JotsState = {
  items: Jot[];
  loading: boolean;
  error: string | undefined;
};

export const save = createAsyncThunk(
  "jots/save",
  async (data: Jot, thunkApi) => {
    try {
      return await jotApi.save(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getall = createAsyncThunk("jots/getall", async (_, thunkApi) => {
  try {
    return await jotApi.getall();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const initialState: JotsState = {
  items: new Array<Jot>(),
  loading: false,
  error: undefined,
};

export const jotsSlice = createSlice({
  name: "jots",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getall.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getall.fulfilled, (state, { payload }) => {
      state.items = payload;
      state.loading = false;
    });
    builder.addCase(getall.rejected, (state, { error }) => {
      state.error = error.message;
      state.loading = false;
    });
    builder.addCase(save.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(save.fulfilled, (state, { payload }) => {
      state.items = payload;
      state.loading = false;
    });
    builder.addCase(save.rejected, (state, { error }) => {
      state.error = error.message;
      state.loading = false;
    });
  },
});

export const selectJots = (state: RootState): JotsState => state.jots;

export default jotsSlice.reducer;
