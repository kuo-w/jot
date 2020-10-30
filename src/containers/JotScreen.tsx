import React, { ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { View, Keyboard } from "react-native";
import { appBgColor } from "colors";

import * as jotActions from "@store/jotsSlice";
import Fab from "@components/Common/Fab";
import KeyboardAvoidingTextInput from "@components/Common/KeyboardAvoidingTextInput";

const JotScreen = (): ReactElement => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");

  const submitJot = () => {
    if (inputText == "") {
      return;
    }

    console.log(`JOT SCREEN::SUBMITTING INPUT TEXT: ${inputText}`);
    dispatch(jotActions.save(inputText));
    setInputText("");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: appBgColor,
      }}
    >
      <Fab
        onPress={() => {
          Keyboard.dismiss();
          submitJot();
        }}
      ></Fab>
      <KeyboardAvoidingTextInput
        inputText={inputText}
        onChangeText={setInputText}
      ></KeyboardAvoidingTextInput>
    </View>
  );
};

export default JotScreen;
