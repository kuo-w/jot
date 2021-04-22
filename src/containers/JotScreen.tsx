import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { View, Button } from "react-native";
import { appBgColor } from "colors";

import * as jotActions from "@store/jotSlice";
import KeyboardAvoidingTextInput from "@components/Common/KeyboardAvoidingTextInput";
import TopicInput from "@components/Topics/TopicInput";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppNavigatorParamList } from "types";
import { RouteProp } from "@react-navigation/native";

type NavigationProp = BottomTabNavigationProp<AppNavigatorParamList, "Jot">;
type ScreenRouteProp = RouteProp<AppNavigatorParamList, "Jot">;

type Props = {
    navigation: NavigationProp;
    route: ScreenRouteProp;
};

type EntryMode = "entry" | "topic";

const JotScreen = ({ route, navigation }: Props) => {
    const dispatch = useDispatch();
    const [inputText, setInputText] = useState(""); // Body text.
    const [topics, setTopics] = useState<string[]>([]); // Additional data for jot.
    const [entryMode, setEntryMode] = useState<EntryMode>("entry"); // Shows topic input overlay when true, hides overlay otherwise.
    const [topicInputText, setTopicInputText] = useState(""); // Text state of topic input component.

    useEffect(() => {
        if (route?.params?.edit == undefined) return;

        setInputText(route?.params?.edit?.text);
        setTopics(route?.params?.edit?.topics ?? []);
    }, [route]);

    const _resetState = () => {
        navigation.setParams({ edit: undefined });
        setInputText("");
        setEntryMode("entry");
        setTopics([]);
    };

    // Clear topic state on blur.
    useEffect(() => {
        const blurListener = navigation.addListener("blur", () => {
            _resetState();
        });

        return blurListener;
    }, [navigation]);

    // Dispatch submit and clear data.
    const submitJot = () => {
        setEntryMode("entry");
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
        _resetState();
    };

    // Handle callback from topic input component.
    const onTopicSubmit = () => {
        if (topicInputText == "") return;

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
            {entryMode == "entry" && (
                <>
                    <KeyboardAvoidingTextInput
                        inputText={inputText}
                        onChangeText={setInputText}
                    ></KeyboardAvoidingTextInput>
                    <View>
                        <Button title="Save" onPress={() => submitJot()} />
                        <Button
                            title="Tags"
                            onPress={() => setEntryMode("topic")}
                        />
                    </View>
                </>
            )}
            {entryMode == "topic" && (
                <>
                    <TopicInput
                        multi
                        value={topicInputText}
                        onSubmit={onTopicSubmit}
                        onTextChange={setTopicInputText}
                        onItemPress={removeTopic}
                        topics={topics}
                    ></TopicInput>
                    <View>
                        <Button title="Save" onPress={() => submitJot()} />
                        <Button
                            title="Back"
                            onPress={() => setEntryMode("entry")}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

export default JotScreen;
