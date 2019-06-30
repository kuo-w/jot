import React from "react";
import { useDispatch } from "react-redux";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { logout } from "../actions/auth";

export default function SettingsScreen() {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <View style={{ width: "70%", margin: 50 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => dispatch(logout())}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
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
    borderRadius: 4
  },
  buttonText: {
    color: "#bbb"
  }
});
