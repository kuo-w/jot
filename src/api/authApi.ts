import { LoginOAuthResult } from "types";
import * as google from "@api/googleApi";
import firebaseApi from "@api/firebaseApi";
import firebase from "firebase";

const getCurrentUser = async () => {
  return new Promise<firebase.User | null>((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

const authGoogleLogin = async (): Promise<string | undefined> => {
  let oauthResult: LoginOAuthResult = null;

  try {
    oauthResult = await google.signin();

    if (oauthResult == null) {
      throw new Error("OAuth result return null");
    }
  } catch (error) {
    console.error("Google auth error:");
    console.error(error);
    throw new Error(`Google login failed`);
  }

  try {
    const { idToken, accessToken, user } = oauthResult;
    await firebaseApi.auth(idToken, accessToken);
    await firebaseApi.setUser(user);
    return accessToken;
  } catch (error) {
    console.error("Firebase - auth fail:");
    console.error(error);
    throw new Error("Google login failed");
  }
};

const authAnonymousLogin = async (): Promise<undefined> => {
  // TODO: add linking anonymous account to permanent account.
  // SEE: https://firebase.google.com/docs/auth/web/anonymous-auth

  try {
    console.log("AUTH API::TRYING ANONYMOUS SIGN IN");
    await firebase.auth().signInAnonymously();
    console.log("AUTH API::ANONYMOUS SIGN IN COMPLETE");
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log("AUTH API::ANONYMOUS USER DID SIGN IN");
        await firebaseApi.setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          isAnonymous: user.isAnonymous,
          lastSignInTime: user.metadata.lastSignInTime,
          createdAt: user.metadata.creationTime,
        });
      }
    });
    return;
  } catch (error) {
    // Handle Errors here.
    console.error("Firebase - anonymous login error");
    console.error(`Code: ${error.code}`);
    console.error(`Message: ${error.message}`);
    throw new Error("Failed guest login");
  }
};

const logout = async (accessToken: string | undefined = undefined) => {
  try {
    if (accessToken) {
      await google.logout(accessToken);
    }

    await firebaseApi.logout();
    firebase.auth().currentUser?.delete();
  } catch (error) {
    console.error("Failed logout");
    console.error(error);
    throw new Error("Failed logout");
  }
};

const actionOnAuth = async (callbackOnAuth: () => void) => {
  console.log("AUTH API::LISTENING FOR AUTH CHANGE");
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("AUTH API::AUTHSTATECHANGED");
      console.log("RUNNING CALLBACK");
      callbackOnAuth();
    }
  });
};

export default {
  logout,
  getCurrentUser,
  actionOnAuth,
  authAnonymousLogin,
  authGoogleLogin,
};
