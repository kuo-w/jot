import React from "react";
import { Text, View } from "react-native";
import { appForegroundColor, textColor, textSecondaryColor } from "colors";
import { Jot } from "types";
import dayjs from "dayjs";

type Props = {
    item: Jot;
};

const HistoryItem = ({ item }: Props) => {
    return (
        <View
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
        </View>
    );
};

export default HistoryItem;
