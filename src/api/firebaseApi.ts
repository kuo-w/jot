import firebase from "firebase";
import "@firebase/firestore";
import type { Timestamp } from "@firebase/firestore-types";

import { GoogleUser } from "expo-google-app-auth/src/Google";
import { CreatedAtTimestamp, FirebaseUser, Jot, RemoteApi } from "types";

const jotConverter = {
  toFirestore(jot: Jot): firebase.firestore.DocumentData {
    return {
      ...jot,
      createdAt: _toTimestamp(new Date(jot.createdAt)),
      userid: _uid(),
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Jot {
    const data = <Jot & CreatedAtTimestamp>snapshot.data(options);
    return { ...data, createdAt: data.createdAt.toDate().toJSON() };
  },
};

let jotsRef: firebase.firestore.CollectionReference<Jot>;
let usersRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;

if (firebase.apps.length > 0) {
  const db = firebase.firestore();
  jotsRef = db.collection("/jots").withConverter(jotConverter);
  usersRef = db.collection("/users");
}

const initializeRefs = () => {
  if (jotsRef || usersRef) {
    return;
  }

  const db = firebase.firestore();
  jotsRef = db.collection("/jots").withConverter(jotConverter);
  usersRef = db.collection("/users");
};

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
): Promise<firebase.auth.UserCredential> => {
  try {
    const credential = firebase.auth.GoogleAuthProvider.credential(
      idToken,
      accessToken
    );

    const result = await firebase.auth().signInWithCredential(credential);
    return result;
  } catch (error) {
    console.error(`Firebase - signin fail: ${error}`);
    throw new Error(error);
  }
};

const setUser = async (user: GoogleUser | FirebaseUser): Promise<void> => {
  if (_uid() == undefined) {
    throw new Error("Firebase UID is undefined");
  }

  try {
    await usersRef.doc(_uid()).set(user);
  } catch (error) {
    console.log(`Firebase - user set fail: ${user}`);
    throw new Error(error);
  }
};

const get = async (): Promise<Jot[] | undefined> => {
  if (!_uid() || !jotsRef) return;

  try {
    console.log("FIREBASE API::GET JOTS");

    const snapshot = await jotsRef.where("userid", "==", _uid()).get();
    return snapshot.docs.map((doc: any) => doc.data());
  } catch (error) {
    console.error(`Firebase - get fail: ${error}`);
    return undefined;
  }
};

const set = async (jot: Jot): Promise<void> => {
  if (!_uid() || !jotsRef) return;

  try {
    console.log("FIREBASE API::SET");
    console.log(jot);

    await jotsRef.doc(jot.guid).set(jot);
  } catch (error) {
    console.error(`Firebase - write fail: ${error}`);
  }
};

const update = async (items: Jot[]): Promise<void> => {
  if (!_uid() || !jotsRef) return;

  try {
    await Promise.all(items.map((i) => jotsRef.doc(i.guid).set(i)));
  } catch (error) {
    console.error(`Firebase - update fail`);
    console.error(items);
  }
};

const logout = async (): Promise<void> => {
  try {
    await firebase.auth().signOut();
    console.log("Firebase - logout successful");
  } catch (error) {
    console.error(`Firebase - logout fail: ${error}`);
  }
};

const api: RemoteApi = {
  getAll: get,
  set,
  setUser,
  update,
};

export default { initializeRefs, auth, logout };

export const firebaseRemoteApi = api;
