import React, { ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { View, Text } from "react-native";
import { selectAuth } from "store/authSlice";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppNavigatorParamList } from "types";
import SignInButton from "components/Auth/SignInButton";

type NavigationProp = BottomTabNavigationProp<AppNavigatorParamList, "SignIn">;

type Props = {
  navigation: NavigationProp;
};

const SignInScreen = ({ navigation }: Props): ReactElement => {
  const { error, signedIn } = useSelector(selectAuth);

  useEffect(() => {
    if (signedIn && !error) {
      navigation.navigate("Jot");
    }
  }, [signedIn, error]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
      }}
    >
      <>
        <SignInButton></SignInButton>
      </>
      <>
        {error && (
          <Text style={{ color: "#eee", marginBottom: 20 }}>
            Failed to login
          </Text>
        )}
      </>
    </View>
  );
};

export default SignInScreen;
