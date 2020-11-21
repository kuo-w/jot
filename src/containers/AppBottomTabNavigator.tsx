import { Feather, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { navActiveTintColor, navBgColor, navInactiveTintColor } from "colors";
import { AppNavigatorParamList } from "types";

const Tab = createBottomTabNavigator<AppNavigatorParamList>();
Tab.Navigator.displayName = "BottomTabNavigator";
Tab.Navigator.defaultProps = {
  tabBarOptions: {
    keyboardHidesTabBar: true,
    showLabel: false,
    activeTintColor: navActiveTintColor,
    inactiveTintColor: navInactiveTintColor,
    style: {
      backgroundColor: navBgColor,
      borderTopColor: navBgColor,
    },
  },
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ color }) => {
      const icons: { [routeName: string]: JSX.Element } = {
        Jot: <Ionicons name={"md-create"} size={25} color={color} />,
        History: <Ionicons name={"md-time"} size={25} color={color} />,
        Settings: <Ionicons name={"md-cog"} size={25} color={color} />,
        Topics: <Feather name={"hash"} size={25} color={color}></Feather>,
      };

      return icons[route.name];
    },
  }),
};

export default Tab;
