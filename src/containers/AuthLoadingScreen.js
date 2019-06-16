import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ActivityIndicator, StatusBar, View } from "react-native";
import * as firebase from "firebase";
import { jotGetAll } from "../actions/jots.js";

export default function AuthLoadingScreen(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    props.navigation.navigate(firebase.auth().currentUser ? "App" : "Auth");
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        dispatch(jotGetAll());
      }
      props.navigation.navigate(user ? "App" : "Auth");
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center"
      }}>
      <StatusBar hidden={true} />
      <ActivityIndicator size="large" color="#333" />
    </View>
  );
}
