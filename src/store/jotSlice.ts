import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import jotApi from "api/jotApi";
import { AppDispatch, RootState } from "@store/index";
import { Jot, JotGetAll } from "types";
import storageApi, { StorageKey } from "@api/storageApi";
import dayjs from "dayjs";
import { MIN_WAIT_TIME_REMOTE_FETCH_MINS } from "../../config";
import { categorizeTopics } from "./topicSlice";
import thunk from "redux-thunk";

export type JotsState = {
  jots: Jot[];
  loading: boolean;
  error: string | undefined;
  remoteFetchTime: string | undefined;
};

// Updates new item to local storage and cloud storage if possible.
export const save = createAsyncThunk(
  "jots/save",
  async ({ text, topics }: { text: string; topics: string[] }, thunkApi) => {
    try {
      const result = await jotApi.save(text, topics);
      thunkApi.dispatch(categorizeTopics(result));
      return result;
    } catch (error) {
      console.error(error);
      return thunkApi.rejectWithValue("Error saving entry.");
    }
  }
);

// Called on successful sync or to reset fetch time so fetch not blocked by wait period.
export const setRemoteFetchTime = createAction<string | undefined>(
  "jots/setRemoteFetchTime"
);

export const renameTopic = createAsyncThunk<
  Jot[],
  { oldTopic: string; newTopic: string },
  {
    state: RootState;
    rejectValue: string;
    dispatch: AppDispatch;
  }
>("jots/renameTopic", async ({ oldTopic, newTopic }, thunkApi) => {
  try {
    const currItems = thunkApi.getState().jots.jots;
    const updated = await jotApi.renameTopic(currItems, oldTopic, newTopic);
    thunkApi.dispatch(categorizeTopics(updated));

    return updated;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

// Clears local storage data and state.
export const clearLocally = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
  }
>("jots/clearLocally", async (_, { dispatch }) => {
  console.log("JOT THUNK::CLEARING LOCAL DATA");
  await storageApi.clear(StorageKey.JOTS);
  await storageApi.clear(StorageKey.REMOTEFETCHTIME);
  dispatch(categorizeTopics([]));
});

// Syncs data sources and returns the result.
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

    // Determine if remote fetch possible.
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
    console.log(`JOT THUNK::REMOTEFETCHTIME? ${lastFetchTime}`);
    console.log(`JOT THUNK::REMOTEWAITELAPSED? ${remoteGetWaitPeriodElapsed}`);
    console.log(`JOT THUNK::SIGNEDIN? ${state.auth.signedIn}`);
    console.log(`JOT THUNK::SHOULDFETCHREMOTE? ${shouldGetRemote}`);

    // Fetch data.
    const result = await jotApi.getall(shouldGetRemote);

    console.log("ADDING RANDOM DATA");
    [...Array(20)].forEach(() => {
      result.items.push({
        text: "meh",
        createdAt: new Date().toString(),
        guid: Math.random().toString(36).substr(2, 5),
      });
    });

    // Pass data around.
    if (result.remoteFetch) {
      storageApi.write<string>(StorageKey.REMOTEFETCHTIME, new Date().toJSON());
    }

    thunkApi.dispatch(set(result));
    thunkApi.dispatch(categorizeTopics(result.items));
    return result;
  } catch (error) {
    console.error(error);
    return thunkApi.rejectWithValue("Error getting data.");
  }
});

// Dispatched on return of async getall action.
const set = createAction<JotGetAll>("jots/set");

export const jotsInitialState: JotsState = {
  jots: [],
  loading: false,
  error: undefined,
  remoteFetchTime: undefined,
};

export const jotSlice = createSlice({
  name: "jots",
  initialState: jotsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getall.pending, (state) => {
        state.loading = true;
      })
      .addCase(getall.fulfilled, () => {})
      .addCase(set, (state, { payload }) => {
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
      })
      .addCase(renameTopic.fulfilled, (state, { payload }) => {
        state.jots = payload;
      });
  },
});

export const selectJots = (state: RootState): JotsState => {
  return state.jots;
};

export default jotSlice.reducer;
