import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  StyleSheet,
  StatusBar,
  TextInput,
  View,
  findNodeHandle,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { jotSubmit } from "../actions/jots";
// import { ToastAndroid } from "react-native";
// import { BlurView } from "expo";

export default function JotScreen() {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const [scrollRef, setScrollRef] = useState(null);
  const [textInputRef, setTextInputRef] = useState(null);

  const _scrollToInput = reactNode => {
    scrollRef.props.scrollToFocusedInput(reactNode);
  };

  const focusTextInput = () => {
    textInputRef.focus();
  };

  const submitJot = () => {
    if (inputText == "") return;
    dispatch(jotSubmit(inputText));
    setInputText("");
  };

  return (
    <TouchableWithoutFeedback onPress={focusTextInput}>
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <TouchableOpacity
          onPress={submitJot}
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            position: "absolute",
            bottom: 20,
            right: 20,
            height: 70,
            backgroundColor: "#333",
            borderRadius: 100,
            zIndex: 1
          }}>
          <Ionicons name="md-checkmark" size={30} color="white" />
        </TouchableOpacity>
        <KeyboardAwareScrollView
          innerRef={ref => {
            setScrollRef(ref);
          }}>
          <View>
            <TextInput
              ref={ref => {
                setTextInputRef(ref);
              }}
              style={styles.textInput}
              placeholderTextColor="#888"
              placeholder={"Start here."}
              onFocus={event => {
                _scrollToInput(findNodeHandle(event.target));
              }}
              onChangeText={text => setInputText(text)}
              textAlignVertical={"top"}
              multiline={true}
              value={inputText}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingTop: 20
  },
  textInput: {
    color: "#bbb",
    fontSize: 20
  }
});
