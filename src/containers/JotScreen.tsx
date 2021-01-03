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
import useKeyboard from "hooks/useKeyboard";
import { RouteProp } from "@react-navigation/native";

type NavigationProp = BottomTabNavigationProp<AppNavigatorParamList, "Jot">;
type ScreenRouteProp = RouteProp<AppNavigatorParamList, "Jot">;

type Props = {
    navigation: NavigationProp;
    route: ScreenRouteProp;
};

const JotScreen = ({ route, navigation }: Props) => {
    const dispatch = useDispatch();
    const [inputText, setInputText] = useState(""); // Body text.
    const [topics, setTopics] = useState<string[]>([]); // Additional data for jot.
    const [showTopicInput, setShowTopicInput] = useState(false); // Shows topic input overlay when true, hides overlay otherwise.
    const [topicInputText, setTopicInputText] = useState(""); // Text state of topic input component.
    const keyboardVisible = useKeyboard();

    useEffect(() => {
        if (route?.params?.edit == undefined) return;

        setInputText(route?.params?.edit?.text);
        setTopics(route?.params?.edit?.topics ?? []);
    }, [route]);

    // Clear topic state on blur.
    useEffect(() => {
        const blurListener = navigation.addListener("blur", () => {
            navigation.setParams({ edit: undefined });
            setInputText("");
            setTopicInputText("");
            setShowTopicInput(false);
            setTopics([]);
        });

        return blurListener;
    }, [navigation]);

    // Dispatch submit and clear data.
    const submitJot = () => {
        setShowTopicInput(false);
        if (inputText == "") return;

        const action = {
            guid: route?.params?.edit?.guid,
            text: inputText,
            topics:
                topicInputText == ""
                    ? topics
                    : [...topics, topicInputText.toLowerCase()],
        };
        console.log(`JOT SCREEN::SUBMITTING`);
        console.log(`INPUT TEXT: ${action.text}`);
        console.log(`WITH TOPICS::${action.topics}`);
        console.log(action);

        dispatch(jotActions.save(action));
        setInputText("");
    };

    // Handle callback from topic input component.
    const onTopicSubmit = () => {
        if (topicInputText == "") {
            return;
        }

        setTopics([...topics, topicInputText.toLowerCase()]);
        setTopicInputText("");
    };

    // Remove topic from component state
    const removeTopic = (topic: string) => {
        setTopics(topics.filter((t) => t != topic));
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: appBgColor,
            }}
        >
            <Fab
                visible={
                    showTopicInput || (!showTopicInput && !keyboardVisible)
                }
                onPress={() => setShowTopicInput(!showTopicInput)}
                icon="hash"
                position="secondary"
            ></Fab>
            <Fab
                visible={
                    showTopicInput || (!showTopicInput && !keyboardVisible)
                }
                onPress={() => {
                    Keyboard.dismiss();
                    submitJot();
                }}
                icon="checkmark"
            ></Fab>
            {showTopicInput && (
                <TopicInput
                    multi
                    value={topicInputText}
                    onKeyboardHide={() => setShowTopicInput(false)}
                    onSubmit={onTopicSubmit}
                    onTextChange={setTopicInputText}
                    onItemPress={removeTopic}
                    topics={topics}
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
