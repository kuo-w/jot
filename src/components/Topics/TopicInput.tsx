import { appBgColor, textTertiaryColor } from "colors";
import React, { useEffect } from "react";
import { Keyboard, View, Text, TextInput, StyleSheet } from "react-native";
import TopicInputItem from "./TopicInputItem";

type Props = {
    onSubmit: () => void;
    value: string;
    onTextChange: (text: string) => void;
    onKeyboardHide?: () => void;

    // To show multiple topic names.
    multi?: boolean;
    onItemPress?: (text: string) => void;
    topics?: string[];
};

const TopicInput = ({
    onSubmit,
    value = "",
    multi = false,
    onTextChange = () => {},
    onKeyboardHide = () => {},
    onItemPress = () => {},
    topics = [],
}: Props) => {
    // Hide topic input on keyboard hide.
    useEffect(() => {
        Keyboard.addListener("keyboardDidHide", onKeyboardHide);

        return () => Keyboard.removeListener("keyboardDidHide", onKeyboardHide);
    }, []);

    const submit = () => {
        onSubmit();
        onTextChange("");
    };

    return (
        <View style={styles.container}>
            {multi && (
                <View style={styles.items}>
                    {topics.map((t) => (
                        <TopicInputItem
                            key={t}
                            name={t}
                            onPress={onItemPress}
                        ></TopicInputItem>
                    ))}
                </View>
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
                        onTextChange(text);
                    }}
                    onSubmitEditing={() => submit()}
                    value={value}
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
    items: {
        flexWrap: "wrap",
        position: "absolute",
        flexDirection: "row",
        top: 20,
        left: 20,
        fontSize: 30,
        marginBottom: 10,
    },
});

export default TopicInput;
