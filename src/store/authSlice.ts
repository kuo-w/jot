import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "@store/index";
import { ToastAndroid } from "react-native";
import authApi from "@api/authApi";
import { AuthOption } from "types";
import { getall, setRemoteFetchTime } from "./jotSlice";

export type AuthState = {
  accessToken: string | undefined;
  fetching: boolean;
  error: string | undefined;
  signedIn: boolean;
  auth: AuthOption | undefined;
};

export const setSignedIn = createAction("auth/setSignedIn");

export const checkUserAuth = createAsyncThunk(
  "auth/checkUserAuth",
  async () => {
    const user = await authApi.getCurrentUser();
    console.log("AUTH ACTION::HAS USER");
    console.log(user != null);
    return user != null;
  }
);

export const authInitialState: AuthState = {
  accessToken: undefined,
  fetching: false,
  error: undefined,
  signedIn: false,
  auth: undefined,
};

export const Login = createAsyncThunk<
  string | undefined,
  { method: AuthOption; onSuccess: () => void },
  {
    dispatch: AppDispatch;
    rejectValue: string | Error;
  }
>("auth/login", async ({ method, onSuccess }, thunkApi) => {
  console.log("AUTH THUNK::LOGIN");

  let result;
  try {
    if (method === "Google") {
      result = await authApi.authGoogleLogin();
    } else if (method === "Anonymous") {
      result = await authApi.authAnonymousLogin();
    } else {
      throw new Error(`Implement auth option: ${method}`);
    }
  } catch (error) {
    console.error("AUTH THUNK::LOGIN ERROR");
    console.error(error);
    return thunkApi.rejectWithValue(error);
  }

  console.log("AUTH THUNK::LOGIN SUCCESSFUL");
  thunkApi.dispatch(setRemoteFetchTime(undefined));
  authApi.actionOnAuth(() => {
    console.log("AUTH API::IN CALLBACK");
    onSuccess();
    thunkApi.dispatch(setSignedIn());
    thunkApi.dispatch(getall());
  });

  return result;
});

export const logout = createAsyncThunk<
  void,
  undefined,
  {
    state: RootState;
  }
>("auth/logout", async (_, thunkApi) => {
  try {
    const { accessToken } = thunkApi.getState().auth;
    if (accessToken == null) {
      await authApi.logout();
      return;
    }
    await authApi.logout(accessToken);
  } catch (error) {
    thunkApi.rejectWithValue("Failed to signout");
  }
  console.log("DONE");
  return;
});

export const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Login.pending, (state) => {
        state.fetching = true;
        state.error = undefined;
      })
      .addCase(Login.fulfilled, (state, { payload }) => {
        state.signedIn = true;
        state.fetching = false;
        state.error = undefined;
        state.accessToken = payload;
      })
      .addCase(Login.rejected, (state, { error }) => {
        ToastAndroid.show("Login failed", ToastAndroid.SHORT);
        state.fetching = false;
        state.error = error.message;
      })
      .addCase(logout.pending, (state) => {
        state.signedIn = false;
        state.fetching = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.signedIn = false;
        state.fetching = false;
        state.accessToken = undefined;
      })
      .addCase(setSignedIn, (state) => {
        console.log("AUTH REDUCER::SETTING SIGNED IN TRUE");
        state.signedIn = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, { payload }) => {
        state.signedIn = payload;
      });
  },
});

export const selectAuth = (state: RootState): AuthState => state.auth;

export default authSlice.reducer;
