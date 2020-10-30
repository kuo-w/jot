import "react-native-get-random-values";
import React from "react";
import { LogBox, StatusBar } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Provider } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigator from "@containers/AppNavigator";
import SignInScreen from "@containers/SignInScreen";
import { store } from "@store/index";
import * as networkApi from "@api/networkApi";

import firebase from "firebase";
import { FIREBASE_CONFIG, STUB_REMOTE_API } from "./config.js";
import { setNetState } from "@store/networkSlice";
import { appBgColor } from "colors.js";

import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import firebaseApi from "@api/firebaseApi";
import jotApi from "@api/jotApi";
import remoteApiStub from "@api/remoteApi.stub";
import { RemoteApi } from "types.js";

dayjs.extend(relativeTime);

LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["Remote debugger"]);

if (firebase.apps.length === 0) {
  firebase.initializeApp(FIREBASE_CONFIG);
  firebaseApi.initializeRefs();
}

networkApi.addListener((nstate) => {
  console.log("APP::DISPATCHING NETWORK STATE CHANGE");
  console.log(nstate);
  store.dispatch(setNetState(nstate));
});

(async () => {
  console.info("APP::INITIALIZE JOTAPI");
  let api: RemoteApi;
  if (STUB_REMOTE_API) {
    console.info("APP::STUBBING REMOTE API");
    api = remoteApiStub.api;
  } else {
    console.info("APP::USING FIREBASE AS REMOTE API");
    api = firebaseApi.api;
  }
  jotApi.initializeApi(api);
  console.log("APP::CALLING GET ALL");
})();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: appBgColor,
  },
};

const Stack = createStackNavigator();

const AppContainer = () => {
  return (
    <Provider store={store}>
      <NavigationContainer theme={AppTheme}>
        <StatusBar hidden={true} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="App" component={AppNavigator} />
          <Stack.Screen name="SignInOptions" component={SignInScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default AppContainer;
