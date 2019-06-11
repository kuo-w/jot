import React from "react";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import "@firebase/firestore";

import {
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";

import JotScreen from "./src/components/JotScreen";
import HistoryScreen from "./src/components/HistoryScreen";
import AuthLoadingScreen from "./src/components/AuthLoadingScreen";
import SignInScreen from "./src/components/SignInScreen";

import { FIREBASE_CONFIG } from "./src/constants.js";

firebase.initializeApp(FIREBASE_CONFIG);
try {
  firebase.auth().signOut();
} catch (error) {
  console.warn(error);
}
const TabNavigator = createBottomTabNavigator(
  {
    Jot: JotScreen,
    History: HistoryScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Jot") {
          iconName = "md-create";
        } else if (routeName === "History") {
          iconName = "md-time";
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: "#c2185b",
      inactiveTintColor: "gray",
      style: {
        backgroundColor: "#010101"
      }
    }
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: TabNavigator,
      Auth: SignInScreen
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
