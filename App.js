import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { Provider } from "react-redux";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./src/reducers";

import AppNavigator from "./src/containers/AppNavigator";
import AuthLoadingScreen from "./src/containers/AuthLoadingScreen";
import SignInScreen from "./src/containers/SignInScreen";

import firebase from "firebase";
import "@firebase/firestore";
import { FIREBASE_CONFIG } from "./config.js";

firebase.initializeApp(FIREBASE_CONFIG);

const store = createStore(rootReducer, applyMiddleware(thunk));

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppNavigator,
      Auth: SignInScreen
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};
