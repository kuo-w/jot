import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppNavigatorParamList, RootStackParamList } from "types";
import { StackNavigationProp } from "@react-navigation/stack";
import { CompositeNavigationProp } from "@react-navigation/native";

import { logout, selectAuth } from "@store/authSlice";
import SettingsOptionButton from "@components/Settings/SettingsOptionButton";
import storageApi, { StorageKey } from "@api/storageApi";
import { clearLocally, getall } from "@store/jotsSlice";
import firebase from "firebase";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<AppNavigatorParamList, "Settings">,
  StackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: NavigationProp;
};

const SettingsScreen = ({ navigation }: Props): ReactElement => {
  const { signedIn } = useSelector(selectAuth);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <SettingsOptionButton
        title={!signedIn ? "Sign-in" : "Logout"}
        onPressAction={
          !signedIn
            ? () => navigation.navigate("SignInOptions")
            : () => {
                console.log("SETTINGSCREEN::LOGOUT");
                dispatch(logout());
              }
        }
      ></SettingsOptionButton>
      <SettingsOptionButton
        title="Clear Local Data"
        onPressAction={() => dispatch(clearLocally())}
      ></SettingsOptionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "80%",
    alignSelf: "center",
  },
});

export default SettingsScreen;
