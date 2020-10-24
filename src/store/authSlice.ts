import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import firebase from "api/firebaseApi";
import * as google from "api/googleApi";
import { RootState } from "store/rootReducer";

export type AuthState = {
  accessToken: string | undefined;
  fetching: boolean;
  error: string | undefined;
  signedIn: boolean;
};

export type ThirdPartyAuthType = "Google";

export const setSignedIn = createAction("auth/setSignedIn");

const initialState: AuthState = {
  accessToken: undefined,
  fetching: false,
  error: undefined,
  signedIn: false,
};

export const thirdPartyLogin = createAsyncThunk(
  "auth/login",
  async (option: ThirdPartyAuthType, thunkApi) => {
    // Currently only using Google.
    if (option != "Google") {
      return;
    }

    const oauthResult = await google.signin();
    if (oauthResult == null) {
      return thunkApi.rejectWithValue(new Error("Google signin failed."));
    }

    try {
      const { idToken, accessToken, user } = oauthResult;
      await firebase.auth(idToken, accessToken);
      await firebase.setUser(user);
      return accessToken;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk<
  undefined,
  undefined,
  {
    state: RootState;
    rejectValue: string;
  }
>("auth/logout", async (_, thunkApi) => {
  await firebase.logout();
  const { accessToken } = thunkApi.getState().auth;
  if (accessToken == null) {
    return thunkApi.rejectWithValue("Empty accessToken");
  }

  await google.logout(<string>accessToken);
  return;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(thirdPartyLogin.pending, (state) => {
      state.fetching = true;
      state.error = undefined;
    });
    builder.addCase(thirdPartyLogin.fulfilled, (state, { payload }) => {
      state.signedIn = true;
      state.fetching = false;
      state.error = undefined;
      state.accessToken = payload;
    });
    builder.addCase(thirdPartyLogin.rejected, (state, { error }) => {
      state.fetching = false;
      state.error = error.message;
    });
    builder.addCase(logout.pending, (state) => {
      state.signedIn = false;
      state.fetching = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.signedIn = false;
      state.fetching = false;
      state.accessToken = undefined;
    });
    builder.addCase(logout.rejected, (state, { error }) => {
      state.signedIn = false;
      state.fetching = false;
      state.error = error.message;
      state.accessToken = undefined;
    });
    builder.addCase(setSignedIn, (state) => {
      state.signedIn = true;
    });
  },
});

export const selectAuth = (state: RootState): AuthState => state.auth;

export default authSlice.reducer;
