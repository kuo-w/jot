import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { jotGetAll } from "../actions/jots.js";
import { setSignedIn } from "../actions/auth.js";

import firebase from "firebase";

export default function AuthLoadingScreen(props) {
  const isConnected = useSelector(state => state.network.isConnected);
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setSignedIn());
        dispatch(jotGetAll());
      }
    });

    dispatch(jotGetAll());
    props.navigation.navigate("App");
  });

  useEffect(() => {
    if (isConnected === null) {
      return;
    }

    // TODO: handle first time user to show login options or continue offline
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      dispatch(setSignedIn());
    }
  }, [isConnected]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <StatusBar hidden={true} />
      <ActivityIndicator size="large" color="#333" />
    </View>
  );
}
