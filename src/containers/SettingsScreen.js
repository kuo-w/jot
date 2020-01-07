import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { logout, login } from "../actions/auth";
import { jotGetAll, jotExport, jotClearLocal } from "../actions/jots";

export default function SettingsScreen() {
  const signedIn = useSelector(state => state.auth.signedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (signedIn) {
      dispatch(jotGetAll());
    }
  }, [signedIn]);

  const LogOut = () => {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => dispatch(logout())}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    );
  };

  const LogIn = () => {
    return (
      <TouchableOpacity
        style={{ ...styles.button, backgroundColor: "#ba2d65" }}
        onPress={() => dispatch(login())}
      >
        <Text style={styles.buttonText}>Google Signin</Text>
      </TouchableOpacity>
    );
  };

  const AuthOptions = () => {
    if (signedIn) {
      return <LogOut />;
    } else {
      return <LogIn />;
    }
  };

  const ClearLocal = () => {
    return (
      <TouchableOpacity
        style={{ ...styles.button, backgroundColor: "#444" }}
        onPress={() => dispatch(jotClearLocal())}
      >
        <Text style={styles.buttonText}>Clear Local</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "70%", margin: 50 }}>
        <AuthOptions />
        <ClearLocal />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 15
  },
  button: {
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 4,
    marginBottom: 4
  },
  buttonText: {
    color: "#bbb"
  }
});
