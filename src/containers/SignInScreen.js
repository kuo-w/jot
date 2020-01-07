import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { login } from "../actions/auth.js";

export default function SignInScreen(props) {
  const signinError = useSelector(state => state.auth.error);
  const signinFetching = useSelector(state => state.auth.fetching);
  const signinSuccess = useSelector(state => state.auth.signedIn);

  const dispatch = useDispatch();

  const signinAsync = async () => {
    if (signinFetching) return;
    dispatch(login());
  };

  const switchToApp = () => {
    props.navigation.navigate("App");
  };

  useEffect(() => {
    if (signinSuccess) {
      switchToApp();
    }
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black"
      }}
    >
      {signinError ? (
        <>
          <Text style={{ color: "#eee", marginBottom: 20 }}>
            Failed to login
          </Text>
          <Ionicons.Button
            name="md-refresh"
            onPress={signinAsync}
            iconStyle={{ margin: 10 }}
            color="#eee"
            backgroundColor="#ba2d65"
          >
            Retry
          </Ionicons.Button>
        </>
      ) : (
        <Ionicons.Button
          name="logo-google"
          onPress={signinAsync}
          iconStyle={{ margin: 10 }}
          color="#eee"
          backgroundColor="#ba2d65"
        >
          Login with Google
        </Ionicons.Button>
      )}
    </View>
  );
}
