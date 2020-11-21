import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { Jot, Topic } from "types";
import { RootState } from ".";

export type TopicState = {
  topics: Topic[];
};

const topicInitialState: TopicState = {
  topics: [],
};

export const categorizeTopics = createAction("topic/set", (items: Jot[]) => {
  const reducer = (acc: { [topic: string]: number }, item: Jot) => {
    item.topics?.forEach((name) => {
      acc[name] ??= 0;
      acc[name] += 1;
    });
    return acc;
  };

  const topicMap = items.reduce(reducer, {});
  const topics = Object.entries(topicMap).map(([name, count]) => ({
    name,
    count,
  }));

  return {
    payload: topics,
  };
});

export const topicSlice = createSlice({
  name: "topic",
  initialState: topicInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      categorizeTopics,
      (state, { payload }: { payload: Topic[] }) => {
        state.topics = payload;
      }
    );
  },
});

export const selectTopics = (state: RootState): TopicState => {
  return state.topics;
};

export default topicSlice.reducer;
