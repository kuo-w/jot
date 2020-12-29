import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { navActiveTintColor, appBgColor } from "colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    showCount: boolean;
    filteredItemsCount: number;
    allItemsCount: number;
    showResetFilter: boolean;
    onResetFilter: () => void;
    filteredTopic: string | undefined;
    onClickSettings: () => void;
};

const HistoryTopBar = ({
    showCount,
    filteredItemsCount,
    allItemsCount,
    showResetFilter,
    onResetFilter,
    filteredTopic,
    onClickSettings,
}: Props) => {
    return (
        <View style={styles.topBar}>
            <View>
                {showCount && (
                    <Text style={styles.count}>
                        {`${filteredItemsCount} / ${allItemsCount}`}
                    </Text>
                )}
            </View>
            {showResetFilter && (
                <View style={styles.filterContainer}>
                    <Text style={styles.topic}>{filteredTopic}</Text>
                    <MaterialCommunityIcons.Button
                        onPress={() => onResetFilter()}
                        name="filter-remove"
                        size={22}
                        color={navActiveTintColor}
                        style={styles.filterButton}
                    ></MaterialCommunityIcons.Button>
                </View>
            )}
            <Ionicons.Button
                style={{ backgroundColor: appBgColor }}
                name="md-cog"
                size={22}
                color={navActiveTintColor}
                onPress={() => onClickSettings()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 10,
        alignItems: "center",
    },
    filterButton: {
        backgroundColor: appBgColor,
    },
    topic: {
        color: navActiveTintColor,
        fontSize: 18,
    },
    count: {
        color: navActiveTintColor,
        fontSize: 16,
        paddingLeft: 36,
    },
});

export default HistoryTopBar;
