import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import jotApi from "api/jotApi";
import { AppDispatch, RootState } from "@store/index";
import { Jot, JotGetAll } from "types";
import storageApi, { StorageKey } from "@api/storageApi";
import dayjs from "dayjs";

type JotsState = {
  jots: Jot[];
  loading: boolean;
  error: string | undefined;
  remoteFetchTime: string | undefined;
};

export const resetRemoteFetchTime = createAction("jots/resetRemoteFetchTime");

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

const setRemoteFetchTime = createAction<string>("jots/setRemoteFetchTime");

export const clearLocally = createAsyncThunk<
  null,
  undefined,
  {
    dispatch: AppDispatch;
  }
>("jots/clearLocally", async (_, { dispatch }) => {
  console.log("JOT THUNK::CLEARING LOCAL DATA");
  await storageApi.clear(StorageKey.JOTS);
  await storageApi.clear(StorageKey.REMOTEFETCHTIME);
  dispatch(resetRemoteFetchTime());
  dispatch(getall());
  return null;
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

    const thirtyMinutesAgo = dayjs().subtract(30, "minute");
    const remoteGetWaitPeriodElapsed =
      lastFetchTime == undefined ||
      dayjs(lastFetchTime).diff(thirtyMinutesAgo, "minute") < 0;

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

const initialState: JotsState = {
  jots: [],
  loading: false,
  error: undefined,
  remoteFetchTime: undefined,
};

export const jotsSlice = createSlice({
  name: "jots",
  initialState,
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

        if (payload == undefined) {
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
        if (
          state.remoteFetchTime &&
          dayjs(payload).diff(state.remoteFetchTime, "minute") == 0
        ) {
          return;
        }

        state.remoteFetchTime = payload;
      })
      .addCase(resetRemoteFetchTime, (state) => {
        state.remoteFetchTime = undefined;
      });
  },
});

export const selectJots = (state: RootState): JotsState => {
  return state.jots;
};

export default jotsSlice.reducer;
