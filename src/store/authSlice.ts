import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as firebase from "api/firebaseApi.js";
import * as google from "api/googleApi.js";
import { RootState } from "store/rootReducer";

export type AuthState = {
  accessToken: string | null;
  fetching: boolean;
  error: string | undefined;
  signedIn: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  fetching: false,
  error: undefined,
  signedIn: false,
};

export const login = createAsyncThunk("auth/login", async (_, thunkApi) => {
  const oauthResult = await google.signin();
  if (oauthResult == null) {
    return thunkApi.rejectWithValue(new Error("Google signin failed."));
  }

  try {
    const { idToken, accessToken, user } = oauthResult;
    await firebase.auth(idToken, accessToken);
    await firebase.setUser(user);
    return { accessToken };
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

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
    builder.addCase(login.pending, (state) => {
      state.fetching = true;
      state.error = undefined;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.signedIn = true;
      state.fetching = false;
      state.error = undefined;
    });
    builder.addCase(login.rejected, (state, { error }) => {
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
    });
    builder.addCase(logout.rejected, (state, { error }) => {
      state.signedIn = false;
      state.fetching = false;
      state.error = error.message;
    });
  },
});

export const selectAuth = (state: RootState): AuthState => state.auth;

export default authSlice.reducer;
