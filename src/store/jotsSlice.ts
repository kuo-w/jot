import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import jotApi from "api/jotApi";
import { AppDispatch, RootState } from "@store/index";
import { Jot, JotGetAll } from "types";
import storageApi, { StorageKey } from "@api/storageApi";
import dayjs from "dayjs";
import { MIN_WAIT_TIME_REMOTE_FETCH_MINS } from "../../config";

export type JotsState = {
  jots: Jot[];
  loading: boolean;
  error: string | undefined;
  remoteFetchTime: string | undefined;
};

export const save = createAsyncThunk(
  "jots/save",
  async (text: string, thunkApi) => {
    try {
      return await jotApi.save(text);
    } catch (error) {
      console.error(error);
      return thunkApi.rejectWithValue("Error saving entry.");
    }
  }
);

export const setRemoteFetchTime = createAction<string | undefined>(
  "jots/setRemoteFetchTime"
);

export const clearLocally = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
  }
>("jots/clearLocally", async () => {
  console.log("JOT THUNK::CLEARING LOCAL DATA");
  await storageApi.clear(StorageKey.JOTS);
  await storageApi.clear(StorageKey.REMOTEFETCHTIME);
});

export const getall = createAsyncThunk<
  JotGetAll | undefined,
  undefined,
  {
    state: RootState;
    rejectValue: string;
    dispatch: AppDispatch;
  }
>("jots/getall", async (_, thunkApi) => {
  try {
    console.log("JOT THUNK::GET ALL");

    const state = thunkApi.getState();

    const lastFetchTime =
      state.jots.remoteFetchTime ??
      (await storageApi.get<string>(StorageKey.REMOTEFETCHTIME));

    if (lastFetchTime) {
      thunkApi.dispatch(setRemoteFetchTime(lastFetchTime));
    }

    const minWaitTime = dayjs().subtract(
      MIN_WAIT_TIME_REMOTE_FETCH_MINS,
      "minute"
    );
    const remoteGetWaitPeriodElapsed =
      lastFetchTime == undefined ||
      dayjs(lastFetchTime).diff(minWaitTime, "minute") < 0;

    const shouldGetRemote =
      state.network.isInternetReachable &&
      remoteGetWaitPeriodElapsed &&
      state.auth.signedIn;

    console.log(`JOT THUNK::INTERNET? ${state.network.isInternetReachable}`);
    console.log(`REMOTEFETCHTIME? ${lastFetchTime}`);
    console.log(`REMOTEWAITELAPSED? ${remoteGetWaitPeriodElapsed}`);
    console.log(`SIGNEDIN? ${state.auth.signedIn}`);
    console.log(`SHOULDFETCHREMOTE? ${shouldGetRemote}`);

    const result = await jotApi.getall(shouldGetRemote);

    if (result.remoteFetch) {
      storageApi.write<string>(StorageKey.REMOTEFETCHTIME, new Date().toJSON());
    }

    return result;
  } catch (error) {
    console.error(error);
    return thunkApi.rejectWithValue("Error getting data.");
  }
});

export const jotsInitialState: JotsState = {
  jots: [],
  loading: false,
  error: undefined,
  remoteFetchTime: undefined,
};

export const jotsSlice = createSlice({
  name: "jots",
  initialState: jotsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getall.pending, (state) => {
        state.loading = true;
      })
      .addCase(getall.fulfilled, (state, { payload }) => {
        console.log(`JOT REDUCER::GETALL PAYLOAD`);
        console.log(payload);
        state.loading = false;

        if (!payload) {
          return;
        }

        if (jotApi.itemsAreEqual(state.jots, payload.items)) {
          return;
        }

        state.jots = payload.items;
        if (payload.remoteFetch) {
          state.remoteFetchTime = new Date().toJSON();
        }
      })
      .addCase(getall.rejected, (state, { error }) => {
        state.error = error.message;
        state.loading = false;
      })
      .addCase(save.pending, (state) => {
        state.loading = true;
      })
      .addCase(save.fulfilled, (state, { payload }) => {
        console.log("JOT REDUCER::SET FULFILLED PAYLOAD");
        console.log(payload);
        state.jots = payload;
        state.loading = false;
      })
      .addCase(save.rejected, (state, { error }) => {
        state.error = error.message;
        state.loading = false;
      })
      .addCase(setRemoteFetchTime, (state, { payload }) => {
        if (!payload) {
          return (state.remoteFetchTime = undefined);
        }

        if (
          state.remoteFetchTime &&
          dayjs(payload).diff(state.remoteFetchTime, "minute") == 0
        ) {
          return;
        }

        state.remoteFetchTime = payload;
      })
      .addCase(clearLocally.fulfilled, (state) => {
        state.remoteFetchTime = undefined;
        state.jots = [];
      });
  },
});

export const selectJots = (state: RootState): JotsState => {
  return state.jots;
};

export default jotsSlice.reducer;
