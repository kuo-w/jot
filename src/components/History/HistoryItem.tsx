import React from "react";
import { Pressable, Text, View } from "react-native";
import { textColor, textSecondaryColor } from "colors";
import { AppNavigatorParamList, Jot } from "types";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type Props = {
    item: Jot;
};

const HistoryItem = ({ item }: Props) => {
    const navigation = useNavigation<
        BottomTabNavigationProp<AppNavigatorParamList, "History">
    >();

    const edit = (item: Jot) => {
        navigation.navigate("Jot", { edit: item });
    };

    return (
        <Pressable
            onPress={() => edit(item)}
            style={{
                borderRadius: 6,
                marginHorizontal: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginVertical: 10,
            }}
        >
            <Text
                style={{
                    paddingBottom: 8,
                    color: textSecondaryColor,
                }}
            >
                {dayjs(item.createdAt).fromNow()}
            </Text>
            <View
                style={{
                    paddingTop: 0,
                    flexDirection: "column",
                    alignSelf: "stretch",
                }}
            >
                <Text style={{ color: textColor }}>{item.text}</Text>
            </View>
        </Pressable>
    );
};

export default HistoryItem;
