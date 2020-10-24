import React, { ReactElement } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import JotScreen from "./JotScreen";
import HistoryScreen from "./HistoryScreen";
import SettingsScreen from "./SettingsScreen";
import { AppNavigatorParamList } from "types";

const Tab = createBottomTabNavigator<AppNavigatorParamList>();
Tab.Navigator.displayName = "BottomTabNavigator";
Tab.Navigator.defaultProps = {
  tabBarOptions: {
    showLabel: false,
    activeTintColor: "#c2185b",
    inactiveTintColor: "gray",
    style: {
      backgroundColor: "#010101",
    },
  },
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ color }) => {
      const icons: { [routeName: string]: string } = {
        Jot: "md-create",
        History: "md-time",
        Settings: "md-cog",
      };

      const Icon = (
        <Ionicons name={icons[route.name]} size={25} color={color} />
      );
      return Icon;
    },
  }),
};

const Navigator = (): ReactElement => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Jot" component={JotScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default Navigator;
