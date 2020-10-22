import { NetInfoState } from "@react-native-community/netinfo";
import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as networkApi from "api/networkApi";
import { store } from "store/rootReducer";
/* 
https://docs.expo.io/versions/v39.0.0/sdk/netinfo/
https://github.com/react-native-netinfo/react-native-netinfo#netinfostate
*/

export type NetworkState = {
  isInternetReachable: boolean | undefined;
  loading: boolean;
};

const setNetState = createAction<NetInfoState>("network/setNetState");

networkApi.addListener((nstate) => {
  store.dispatch(setNetState(nstate));
});

export const fetchNetState = createAsyncThunk(
  "network/fetchNetState",
  async () => {
    return await networkApi.getNetState();
  }
);

const initialState: NetworkState = {
  isInternetReachable: undefined,
  loading: false,
};

createSlice({
  name: "network",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNetState.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchNetState.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isInternetReachable = <boolean>payload.isInternetReachable;
    });
  },
});
