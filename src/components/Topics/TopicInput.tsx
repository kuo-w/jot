import { appBgColor, textTertiaryColor } from "colors";
import React, { useEffect, useState } from "react";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
    onSubmit: (text: string) => void;
    initialValue?: string;
    onTextChange?: (text: string) => void;
    multi?: boolean;
    onKeyboardHide?: () => void;
};

const TopicInput = ({
    onSubmit,
    initialValue = "",
    multi = false,
    onTextChange = () => {},
    onKeyboardHide = () => {},
}: Props) => {
    const [_inputText, _setInputText] = useState(initialValue);
    const [_topics, _setTopics] = useState<string[]>([]);

    // Hide topic input on keyboard hide.
    useEffect(() => {
        Keyboard.addListener("keyboardDidHide", () => {
            onKeyboardHide();
        });
    }, []);

    const submit = () => {
        onSubmit(_inputText);
        onTextChange("");
        _setTopics([..._topics, _inputText.toLowerCase()]);
        _setInputText("");
    };

    return (
        <View style={styles.container}>
            {multi && (
                <Text style={styles.joined}>[ {`${_topics.join(", ")}`} ]</Text>
            )}
            <View style={{ flexDirection: "row" }}>
                <Text style={{ color: textTertiaryColor, fontSize: 40 }}>
                    #
                </Text>
                <TextInput
                    style={{
                        color: textTertiaryColor,
                        fontSize: 40,
                    }}
                    onChangeText={(text) => {
                        _setInputText(text);
                        onTextChange(text);
                    }}
                    onSubmitEditing={() => submit()}
                    value={_inputText}
                    autoFocus={true}
                    blurOnSubmit={false}
                    onBlur={() => submit()}
                ></TextInput>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: appBgColor,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    joined: {
        position: "absolute",
        top: 20,
        left: 20,
        color: textTertiaryColor,
        fontSize: 30,
        marginBottom: 10,
    },
});

export default TopicInput;
