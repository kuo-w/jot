import { navActiveTintColor, navBgColor, textColor } from "colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Topic } from "types";

type Props = {
    data: Topic;
    onPress: (topic: string) => void;
    onLongPress: (topic: string) => void;
};

const TopicItem = ({ data, onPress, onLongPress }: Props) => {
    return (
        <View style={{ margin: 10 }}>
            <Pressable
                style={{ flex: 1, borderRadius: 4 }}
                onPress={() => onPress(data.name)}
                onLongPress={() => onLongPress(data.name)}
                delayLongPress={1000}
                android_ripple={{
                    color: navActiveTintColor,
                }}
            >
                <View style={styles.rowView}>
                    <Text style={styles.nameText}>{data.name}</Text>
                    <Text style={styles.countText}>{data.count}</Text>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    nameText: {
        color: textColor,
        fontSize: 24,
    },
    countText: {
        color: navActiveTintColor,
        fontSize: 20,
    },
    rowView: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
});

export default TopicItem;
