import React, { ReactElement, useEffect } from "react";

import JotScreen from "@containers/JotScreen";
import HistoryScreen from "@containers/HistoryScreen";
import SettingsScreen from "@containers/SettingsScreen";
import Tab from "@containers/AppBottomTabNavigator";
import { checkUserAuth } from "@store/authSlice";
import { getall } from "@store/jotsSlice";
import { useAppDispatch } from "@store/index";

const AppNavigator = (): ReactElement => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      console.log("APP NAV::DISPATCH CHECKAUTH EFFECT");
      await dispatch(checkUserAuth());
      dispatch(getall());
    })();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Jot" component={JotScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
