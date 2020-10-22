import { firestore } from "firebase";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";
import type { Timestamp } from "@firebase/firestore-types";

export type Jot = {
  text: string;
  createdAt: Date;
  guid: string;
  userid: string;
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
