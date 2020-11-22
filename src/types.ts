import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "@store/index";
import type { Timestamp } from "@firebase/firestore-types";
import { ReactNode } from "react";
import { LoginResult } from "@api/googleApi";
import { GoogleUser } from "expo-google-app-auth";

export type AppUser = {};

export type FirebaseUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  createdAt: string | undefined;
  lastSignInTime: string | undefined;
  isAnonymous: boolean;
};

export type Topic = {
  name: string;
  count: number;
};

export type Jot = {
  text: string;
  createdAt: string;
  guid: string;
  userid?: string;
  topics?: string[];
};

export type IconName = "checkmark" | "hash";

export type JotGetAll = {
  items: Jot[];
  remoteFetch: boolean;
};

export type CreatedAtTimestamp = {
  createdAt: Timestamp;
};

export type ShouldFetchRemote = boolean;

export type ThunkResult<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppNavigatorParamList = {
  Jot: undefined;
  History: { topic: string } | undefined;
  SignIn: undefined;
  Topics: undefined;
};

export type RootStackParamList = {
  AuthLoading: undefined;
  SignInOptions: undefined;
  App: undefined;
  Settings: undefined;
};

export type RemoteApi = {
  getAll: () => Promise<Jot[] | undefined>;
  set: (jot: Jot) => Promise<void>;
  setUser: (user: GoogleUser | FirebaseUser) => Promise<void>;
  update: (items: Jot[]) => Promise<void>;
};

export type AuthApi = {
  initializeAuthApi: (api: RemoteApi) => void;
  logout: (accessToken?: string | undefined) => Promise<void>;
  getCurrentUser: () => Promise<AppUser | firebase.User | null>;
  actionOnAuth: (callbackOnAuth: () => void) => void;
  authAnonymousLogin: () => Promise<undefined>;
  authGoogleLogin: () => Promise<string | undefined>;
};

export type ScrollView = {
  props: {
    [scrollToFocusedInput: string]: (reactNode: ReactNode) => void;
  };
};

export type LoginOAuthResult = LoginResult | null;

export type AuthOption = "Google" | "Anonymous";
