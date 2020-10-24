import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "store/rootReducer";
import type { Timestamp } from "@firebase/firestore-types";
import { ReactNode } from "react";

export type Jot = {
  text: string;
  createdAt: Date;
  guid: string;
  userid?: string;
};

export type CreatedAtTimestamp = {
  createdAt: Timestamp;
};

export type ThunkResult<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppNavigatorParamList = {
  Jot: undefined;
  History: undefined;
  Settings: undefined;
  SignIn: undefined;
};

export type RootStackParamList = {
  AuthLoading: undefined;
  SignInOptions: undefined;
  App: undefined;
};

export type ScrollView = {
  props: {
    [scrollToFocusedInput: string]: (reactNode: ReactNode) => void;
  };
};
