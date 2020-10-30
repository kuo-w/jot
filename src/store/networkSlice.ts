import { NetInfoState } from "@react-native-community/netinfo";
import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as networkApi from "@api/networkApi";
import { RootState } from "@store/index";

/* 
https://docs.expo.io/versions/v39.0.0/sdk/netinfo/
https://github.com/react-native-netinfo/react-native-netinfo#netinfostate
*/

type NetworkState = {
  isInternetReachable: boolean;
  loading: boolean;
};

export const setNetState = createAction<NetInfoState>("network/setNetState");

const initialState: NetworkState = {
  isInternetReachable: false,
  loading: false,
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setNetState, (state, { payload }) => {
      console.log("NETWORK REDUCER::NETSTATE CHANGE PAYLOAD");
      console.log(payload);

      state.loading = false;
      state.isInternetReachable = <boolean>payload.isInternetReachable;
    });
  },
});

export const selectNetwork = (state: RootState): NetworkState => state.network;

export default networkSlice.reducer;
