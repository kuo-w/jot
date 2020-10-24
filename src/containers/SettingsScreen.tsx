import React, { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "store/authSlice";
import * as jotActions from "store/jotsSlice";
import { View, StyleSheet } from "react-native";
import SettingsOptionButton from "components/Settings/SettingsOptionButton";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppNavigatorParamList, RootStackParamList } from "types";
import { StackNavigationProp } from "@react-navigation/stack";
import { CompositeNavigationProp } from "@react-navigation/native";

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

  const navigateToSignInOptionsScreen = () => {
    navigation.navigate("SignInOptions");
  };

  useEffect(() => {
    if (signedIn) {
      dispatch(jotActions.getall());
    }
  }, [signedIn, dispatch]);

  return (
    <View style={styles.container}>
      <View style={{ width: "70%", margin: 50 }}>
        {signedIn && (
          <SettingsOptionButton
            title="See Sign-in Options"
            onPressAction={navigateToSignInOptionsScreen}
          ></SettingsOptionButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 15,
  },
});

export default SettingsScreen;
