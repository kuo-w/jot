import * as AppAuth from "expo-app-auth";
import {
    GOOGLE_CONFIG_CREDENTIALS,
    FIREBASE_CONFIG_CREDENTIALS,
} from "./credentials.js";

const {
    expoClientId,
    androidClientId,
    androidStandaloneAppClientId,
} = GOOGLE_CONFIG_CREDENTIALS;

const GOOGLE_CONFIG = {
    expoClientId,
    androidClientId,
    androidStandaloneAppClientId,
    scopes: ["profile", "email"],
    redirectUrl: `${AppAuth.OAuthRedirect}:/oauth2redirect/google`,
};

const {
    apiKey,
    authDomain,
    databaseURL,
    storageBucket,
    projectId,
    messagingSenderId,
    appId,
} = FIREBASE_CONFIG_CREDENTIALS;

const FIREBASE_CONFIG = {
    apiKey,
    authDomain,
    databaseURL,
    storageBucket,
    projectId,
    messagingSenderId,
    appId,
};

const MIN_WAIT_TIME_REMOTE_FETCH_MINS = 525600; // 1 year

const STUB_REMOTE_API = true;

export {
    FIREBASE_CONFIG,
    GOOGLE_CONFIG,
    STUB_REMOTE_API,
    MIN_WAIT_TIME_REMOTE_FETCH_MINS,
};
