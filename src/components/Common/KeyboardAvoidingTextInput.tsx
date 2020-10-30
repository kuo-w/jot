import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { textColor, textSecondaryColor } from "colors";

type Props = {
  onChangeText: (input: string) => void;
  inputText: string;
};

const KeyboardAvoidingTextInput = ({ onChangeText, inputText }: Props) => {
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={{
              flex: 1,
              color: textColor,
              fontSize: 20,
            }}
            placeholderTextColor={textSecondaryColor}
            placeholder={"Start here."}
            onChangeText={(text) => onChangeText(text)}
            textAlignVertical={"top"}
            multiline={true}
            value={inputText}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingTextInput;
