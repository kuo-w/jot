import React from "react";
import { StatusBar } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { Provider } from "react-redux";

import AppNavigator from "./src/containers/AppNavigator";
import AuthLoadingScreen from "./src/containers/AuthLoadingScreen";
import SignInScreen from "./src/containers/SignInScreen";

import firebase from "firebase";
import { FIREBASE_CONFIG } from "./config.js";
import network from "./src/helpers/network.js";

import store from "./src/store.js"

network();

firebase.initializeApp(FIREBASE_CONFIG);

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
      <StatusBar hidden={true} />
      <AppContainer />
    </Provider>
  );
};
