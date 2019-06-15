import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "react-navigation";
import JotScreen from "./JotScreen";
import HistoryScreen from "./HistoryScreen";

export default createBottomTabNavigator(
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
