import "react-native-get-random-values";
import React from "react";
import { LogBox, StatusBar, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Provider } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigator from "@containers/AppNavigator";
import SignInScreen from "@containers/SignInScreen";
import { store } from "@store/index";

import firebase from "firebase";
import { FIREBASE_CONFIG, STUB_REMOTE_API } from "./config.js";
import { appBgColor } from "colors.js";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import firebaseApi, { firebaseRemoteApi } from "@api/firebaseApi";
import remoteApiStub from "@api/remoteApi.stub";
import { setRemoteApi } from "@api/remoteApi";
import { setNetState } from "@store/networkSlice";
import networkApi from "@api/networkApi";
import SettingsScreen from "@containers/SettingsScreen";
import { RootStackParamList } from "types.js";
dayjs.extend(relativeTime);

LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["Remote debugger"]);

if (!__DEV__) {
    console.log = () => {};
}

if (firebase.apps.length === 0) {
    firebase.initializeApp(FIREBASE_CONFIG);
    firebaseApi.initializeRefs();
}

(() => {
    console.log("APP NAV::ADDING DISPATCH ON NETWORK CHANGE LISTENER");
    networkApi.addListener((nstate) => {
        console.info("APP::DISPATCHING NETWORK STATE CHANGE");
        console.log(nstate);
        store.dispatch(setNetState(nstate));
    });
})();

(() => {
    console.info("APP::INITIALIZE JOTAPI");
    if (STUB_REMOTE_API) {
        // Local debugging
        console.info("APP::STUBBING REMOTE API");
        setRemoteApi(remoteApiStub);
    } else {
        console.info("APP::USING FIREBASE AS REMOTE API");
        setRemoteApi(firebaseRemoteApi);
    }
})();

const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: appBgColor,
    },
};

const Stack = createStackNavigator<RootStackParamList>();

const AppContainer = () => {
    return (
        <Provider store={store}>
            <NavigationContainer theme={AppTheme}>
                <StatusBar hidden={true} />
                <Stack.Navigator headerMode="none">
                    <Stack.Screen name="App" component={AppNavigator} />
                    <Stack.Screen
                        name="SignInOptions"
                        component={SignInScreen}
                    />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
};

export default AppContainer;
