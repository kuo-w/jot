import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { login } from "../actions/auth.js";

export default function SignInScreen(props) {
  const signinError = useSelector(state => state.auth.error);
  const signinFetching = useSelector(state => state.auth.fetching);
  const dispatch = useDispatch();

  const signinAsync = async () => {
    if (signinFetching) return;
    const success = await dispatch(login());
    if (success) {
      props.navigation.navigate("App");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black"
      }}>
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
            backgroundColor="#ba2d65">
            Retry
          </Ionicons.Button>
        </>
      ) : (
        <Ionicons.Button
          name="logo-google"
          onPress={signinAsync}
          iconStyle={{ margin: 10 }}
          color="#eee"
          backgroundColor="#ba2d65">
          Login with Google
        </Ionicons.Button>
      )}
    </View>
  );
}
