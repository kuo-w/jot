import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import authReducer from "@store/authSlice";
import jotReducer from "@store/jotSlice";
import networkReducer from "@store/networkSlice";
import topicReducer from "@store/topicSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jots: jotReducer,
    network: networkReducer,
    topics: topicReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
