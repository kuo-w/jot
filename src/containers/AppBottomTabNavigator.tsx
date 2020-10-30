import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { navActiveTintColor, navBgColor } from "colors";
import { AppNavigatorParamList } from "types";

const Tab = createBottomTabNavigator<AppNavigatorParamList>();
Tab.Navigator.displayName = "BottomTabNavigator";
Tab.Navigator.defaultProps = {
  tabBarOptions: {
    keyboardHidesTabBar: true,
    showLabel: false,
    activeTintColor: navActiveTintColor,
    inactiveTintColor: navActiveTintColor,
    style: {
      backgroundColor: navBgColor,
      borderTopColor: navBgColor,
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

export default Tab;
