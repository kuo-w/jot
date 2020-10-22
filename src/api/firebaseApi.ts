import firebase from "firebase";
import "@firebase/firestore";
import type { Timestamp } from "@firebase/firestore-types";

import { GoogleUser } from "expo-google-app-auth/src/Google";
import { CreatedAtTimestamp, Jot } from "types";

const jotConverter = {
  toFirestore(jot: Jot): firebase.firestore.DocumentData {
    return {
      ...jot,
      createdAt: _toTimestamp(jot.createdAt),
      userid: _uid(),
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Jot {
    const data = <Jot & CreatedAtTimestamp>snapshot.data(options);
    return { ...data, createdAt: data.createdAt.toDate() };
  },
};

const db = firebase.firestore();
const jotsRef = db.collection("/jots").withConverter(jotConverter);
const usersRef = db.collection("/users");

const _uid = (): string | undefined => {
  try {
    return firebase.auth().currentUser?.uid;
  } catch (error) {
    console.error(`Error getting user UID: ${error}`);
    return undefined;
  }
};

const _toTimestamp = (date: Date): Timestamp => {
  return firebase.firestore.Timestamp.fromDate(date);
};

const auth = async (
  idToken: string,
  accessToken: string
): Promise<firebase.auth.UserCredential | null> => {
  try {
    const credential = firebase.auth.GoogleAuthProvider.credential(
      idToken,
      accessToken
    );
    const result = await firebase.auth().signInWithCredential(credential);
    return result;
  } catch (error) {
    console.error(`Error signing into Firebase: ${error}`);
    return null;
  }
};

const setUser = async (user: GoogleUser): Promise<void> => {
  try {
    const userUID = _uid();
    if (userUID == undefined) {
      throw new Error("Current user is not authorized.");
    }

    await usersRef.doc(userUID).set(user);
  } catch (error) {
    console.log(`Error setting user: ${user}`);
    throw error;
  }
};

const getJots = async (): Promise<Jot[] | undefined> => {
  try {
    const snapshot = await jotsRef.where("userid", "==", _uid()).get();
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(`Error getting jots for UID ${_uid()}`);
    return undefined;
  }
};

const setJot = async (jot: Jot): Promise<void> => {
  try {
    await jotsRef.add(jot);
  } catch (error) {
    console.error(error);
    // TODO: handle error
    // Add queue to retry at a later time
    // Or rethrow error to show message to user
  }
};

const logout = async (): Promise<void> => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error(error);
  }
};

export { auth, setUser, logout, setJot, getJots };
