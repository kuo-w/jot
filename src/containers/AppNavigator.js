import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "react-navigation";
import JotScreen from "./JotScreen";
import HistoryScreen from "./HistoryScreen";
import SettingsScreen from "./SettingsScreen";

export default createBottomTabNavigator(
  {
    Jot: JotScreen,
    History: HistoryScreen,
    Settings: SettingsScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case "Jot":
            iconName = "md-create";
            break;
          case "History":
            iconName = "md-time";
            break;
          case "Settings":
            iconName = "md-cog";
            break;
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: "#c2185b",
      inactiveTintColor: "gray",
      style: {
        backgroundColor: "#010101"
      }
    }
  }
);
