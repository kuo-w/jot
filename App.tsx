import React, { ReactElement } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import AppNavigator from "containers/AppNavigator";
import SignInScreen from "containers/SignInScreen";

import firebase from "firebase";
import { FIREBASE_CONFIG } from "./config.js";

import { store } from "store/rootReducer";

firebase.initializeApp(FIREBASE_CONFIG);

const Stack = createStackNavigator();

const AppContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="App" component={AppNavigator} />
        {/* <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} /> */}
        <Stack.Screen name="SignIn" component={SignInScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = (): ReactElement => {
  return (
    <Provider store={store}>
      <StatusBar hidden={true} />
      <AppContainer />
    </Provider>
  );
};

export default App;
