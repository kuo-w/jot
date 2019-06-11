import React, { useState, useEffect } from "react";
import { View, StatusBar, Text } from "react-native";
import { Google } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { GOOGLE_CONFIG } from "../constants.js";

import firebase from "firebase";
import "@firebase/firestore";

export default function SignInScreen(props) {
  const [signinError, setSigninError] = useState(false);
  const [firestore, setFireStore] = useState(null);

  useEffect(() => {
    setFireStore(firebase.firestore());
  }, []);

  const signinAsync = async () => {
    try {
      const data = await signInWithGoogleAsync();
      const user = data.user;
      authFirebase(data.idToken, data.accessToken, () => {
        setUserDoc(user);
      });
    } catch (error) {
      setSigninError(true);
      return;
    }

    props.navigation.navigate("App");
  };

  async function signInWithGoogleAsync() {
    const { type, accessToken, idToken, user } = await Google.logInAsync(
      GOOGLE_CONFIG
    );
    if (type === "success") {
      return { accessToken, idToken, user };
    }
    return;
  }

  function authFirebase(idToken, accessToken, callback) {
    const credential = firebase.auth.GoogleAuthProvider.credential(
      idToken,
      accessToken
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(callback)
      .catch(error => {
        throw error;
      });
  }

  const setUserDoc = user => {
    firestore
      .collection("/users")
      .doc(firebase.auth().currentUser.uid)
      .set(user)
      .then(() => {
        console.info("success");
      })
      .catch(error => {
        console.warn(error);
      });
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
