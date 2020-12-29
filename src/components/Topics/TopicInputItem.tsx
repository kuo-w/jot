import { appForegroundColor, textTertiaryColor } from "colors";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
    name: string;
    onPress: (text: string) => void;
};

const TopicInputItem = (props: Props) => {
    return (
        <Pressable onPress={() => props.onPress(props.name)}>
            <View
                style={{
                    borderRadius: 20,
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    backgroundColor: appForegroundColor,
                    marginHorizontal: 10,
                    marginBottom: 20,
                }}
            >
                <Text style={{ color: textTertiaryColor, fontSize: 18 }}>
                    {props.name}
                </Text>
            </View>
        </Pressable>
    );
};

export default TopicInputItem;
