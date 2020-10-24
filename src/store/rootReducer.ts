import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import authReducer from "store/authSlice";
import jotsReducer from "store/jotsSlice";
import networkReducer from "store/networkSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jots: jotsReducer,
    network: networkReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
