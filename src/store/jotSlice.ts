import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import jotApi from "api/jotApi";
import { AppDispatch, RootState } from "@store/index";
import { Jot, JotGetAll } from "types";
import storageApi, { StorageKey } from "@api/storageApi";
import { categorizeTopics } from "./topicSlice";

export type JotsState = {
    jots: Jot[];
    loading: boolean;
    error: string | undefined;
};
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
// Updates new item to local storage and cloud storage if possible.
export const save = createAsyncThunk<
    Jot[],
    { guid?: string; text: string; topics: string[] },
    {
        state: RootState;
        rejectValue: string;
        dispatch: AppDispatch;
    }
>("jots/save", async ({ text, topics, guid }, thunkApi) => {
    try {
        let result: Jot[] = [];
        if (guid) {
            // Edit
            const itemToUpdate = thunkApi
                .getState()
                .jots.jots.find((j) => j.guid == guid);

            if (itemToUpdate == undefined)
                return thunkApi.rejectWithValue("Editing non-existent item");

            result = await jotApi.edit(itemToUpdate, { text, topics });
        } else {
            result = await jotApi.save(text, topics);
        }

        thunkApi.dispatch(categorizeTopics(result));
        return result;
    } catch (error) {
        console.error(error);
        return thunkApi.rejectWithValue("Error saving entry.");
    }
});

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

        const canGetRemote =
            state.network.isInternetReachable && state.auth.signedIn;

        // Fetch data.
        const result = await jotApi.getAll(canGetRemote);

        thunkApi.dispatch(categorizeTopics(result.items));
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
            .addCase(getall.fulfilled, (state, { payload }) => {
                state.loading = false;

                if (!payload) return;

                if (jotApi.itemsAreEqual(state.jots, payload.items)) return;

                state.jots = payload.items;
            })
            .addCase(getall.rejected, (state, { error }) => {
                state.error = error.message;
                state.loading = false;
            })
            .addCase(save.pending, (state) => {
                state.loading = true;
            })
            .addCase(save.fulfilled, (state, { payload }) => {
                state.jots = payload;
                state.loading = false;
            })
            .addCase(save.rejected, (state, { error }) => {
                state.error = error.message;
                state.loading = false;
            })
            .addCase(clearLocally.fulfilled, (state) => {
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
