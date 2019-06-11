import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import * as firebase from "firebase";

export default function AuthLoadingScreen(props) {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        console.log("Firebase user did auth");
      }
      props.navigation.navigate(user ? "App" : "Auth");
    });
  }, []);

  return (
    <View>
      <StatusBar hidden={true} />
      <ActivityIndicator />
    </View>
  );
}
