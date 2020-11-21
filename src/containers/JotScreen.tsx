import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { View, Keyboard } from "react-native";
import { appBgColor } from "colors";

import * as jotActions from "@store/jotSlice";
import Fab from "@components/Common/Fab";
import KeyboardAvoidingTextInput from "@components/Common/KeyboardAvoidingTextInput";
import TopicInput from "@components/Topics/TopicInput";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppNavigatorParamList } from "types";

type NavigationProp = BottomTabNavigationProp<AppNavigatorParamList, "Jot">;

type Props = {
  navigation: NavigationProp;
};

const JotScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState(""); // Body text.
  const [showTopicInput, setShowTopicInput] = useState(false); // Shows topic input overlay when true, hides overlay otherwise.
  const [topics, setTopics] = useState<string[]>([]); // Additional data for jot.
  const [inputTopicText, setInputTopicText] = useState(""); // Text state of topic input component.

  // Clear topic state on blur.
  useEffect(() => {
    const blurListener = navigation.addListener("blur", () => {
      setShowTopicInput(false);
      setTopics([]);
    });

    return blurListener;
  }, [navigation]);

  // Dispatch submit and clear data.
  const submitJot = () => {
    setShowTopicInput(false);

    if (inputText == "") {
      return;
    }

    console.log(`JOT SCREEN::SUBMITTING INPUT TEXT: ${inputText}`);
    console.log(`WITH TOPICS::${topics.join(",")}`);
    dispatch(
      jotActions.save({
        text: inputText,
        topics:
          inputTopicText == ""
            ? topics
            : [...topics, inputTopicText.toLowerCase()],
      })
    );
    setInputText("");
  };

  // Show input overlay if hidden, otherwise hide.
  const toggleTopicInput = () => {
    if (!showTopicInput) {
      // openingTopicInput
      setTopics([]);
    }

    setShowTopicInput(!showTopicInput);
  };

  // Handle callback from topic input component.
  const onTopicSubmit = (topic: string) => {
    if (topic == "") {
      return;
    }

    setTopics([...topics, topic.toLowerCase()]);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: appBgColor,
      }}
    >
      {!showTopicInput && (
        <Fab
          onPress={() => toggleTopicInput()}
          icon="hash"
          position="secondary"
        ></Fab>
      )}
      <Fab
        onPress={() => {
          Keyboard.dismiss();
          submitJot();
        }}
        icon="checkmark"
      ></Fab>
      {showTopicInput && (
        <TopicInput
          multi
          onKeyboardHide={() => setShowTopicInput(false)}
          onSubmit={onTopicSubmit}
          onTextChange={setInputTopicText}
        ></TopicInput>
      )}
      <KeyboardAvoidingTextInput
        inputText={inputText}
        onChangeText={setInputText}
      ></KeyboardAvoidingTextInput>
    </View>
  );
};

export default JotScreen;
