import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import * as firebase from "firebase";

export default function AuthLoadingScreen(props) {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        console.info("Firebase user did auth");
      }
      props.navigation.navigate(user ? "App" : "Auth");
    });
  }, []);

  return (
    <View
      style={{
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center"
      }}>
      <StatusBar hidden={true} />
      <ActivityIndicator size="large" color="#333" />
    </View>
  );
}
