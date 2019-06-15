import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StatusBar, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { login } from "../actions/login.js";

export default function SignInScreen(props) {
  const signinError = useSelector(state => state.login.error);
  const dispatch = useDispatch();

  const signinAsync = async () => {
    try {
      await dispatch(login());
      props.navigation.navigate("App");
    } catch (error) {
      console.error(error);
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
      <StatusBar hidden={true} />
      {signinError ? (
        <Text style={{ color: "#eee" }}>Failed to login</Text>
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
