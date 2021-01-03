import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { navActiveTintColor, textColor, textSecondaryColor, textTertiaryColor } from "colors";
import { AppNavigatorParamList, Jot } from "types";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import Dot from "@components/Common/Dot";

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
        <Pressable onPress={() => edit(item)} style={styles.pressable}>
            <View style={styles.detail}>
                <Text style={styles.date}>
                    {dayjs(item.createdAt).fromNow()}
                </Text>
                {item.topics?.length == 0 && (
                    <Dot size={6} color={textSecondaryColor} />
                )}
            </View>
            <Text style={{ color: textColor }}>{item.text}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressable: {
        borderRadius: 6,
        marginHorizontal: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 10,
    },
    detail: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    date: {
        color: textSecondaryColor,
    },
});

export default HistoryItem;
