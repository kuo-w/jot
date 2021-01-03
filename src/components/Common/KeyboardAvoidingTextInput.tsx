import React from "react";
import {
    KeyboardAvoidingView,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { textColor, textSecondaryColor } from "colors";

type Props = {
    onChangeText: (input: string) => void;
    inputText: string;
    onFocus?: () => void;
};

const KeyboardAvoidingTextInput = ({
    onChangeText,
    inputText,
    onFocus,
}: Props) => {
    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                paddingHorizontal: 20,
                paddingTop: 20,
            }}
        >
            <TouchableWithoutFeedback>
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={{
                            flex: 1,
                            color: textColor,
                            fontSize: 20,
                        }}
                        onFocus={() => onFocus && onFocus()}
                        autoCapitalize="none"
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
