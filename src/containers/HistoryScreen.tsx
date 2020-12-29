import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, Text, View } from "react-native";
import { selectJots } from "@store/jotSlice";
import HistoryEmpty from "@components/History/HistoryEmpty";
import HistoryList from "@components/History/HistoryList";
import { appBgColor, navActiveTintColor } from "colors";
import { AppNavigatorParamList, Jot, RootStackParamList } from "types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import HistoryTopBar from "@components/History/HistoryTopBar";

type NavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<AppNavigatorParamList, "History">,
    StackNavigationProp<RootStackParamList>
>;
type ScreenRouteProp = RouteProp<AppNavigatorParamList, "History">;

type Props = {
    navigation: NavigationProp;
    route: ScreenRouteProp;
};

const HistoryScreen = ({ route, navigation }: Props): ReactElement => {
    const { jots } = useSelector(selectJots);
    const [ignoreFilter, setIgnoreFilter] = useState(false);

    useEffect(() => {
        const blurListener = navigation.addListener("blur", () => {
            setIgnoreFilter(false);
            navigation.setParams({ topic: undefined });
        });

        return blurListener;
    }, [navigation]);

    const _filterTopic = (items: Jot[], topic: string | undefined) => {
        if (!topic) {
            return items;
        }

        return items.filter((i) => i.topics?.includes(topic));
    };

    const _filtered = (items: Jot[]) => {
        if (ignoreFilter) {
            return items;
        }

        const filtered = _filterTopic(items, route?.params?.topic);

        return filtered;
    };

    const filtered = _filtered(jots);

    return (
        <View style={{ backgroundColor: appBgColor, flex: 1 }}>
            <HistoryTopBar
                showCount={jots.length > 0}
                showResetFilter={!!route?.params?.topic && !ignoreFilter}
                filteredItemsCount={filtered.length}
                allItemsCount={jots.length}
                filteredTopic={route?.params?.topic}
                onResetFilter={() => setIgnoreFilter(true)}
                onClickSettings={() => navigation.navigate("Settings")}
            ></HistoryTopBar>
            {jots.length > 0 ? (
                <>
                    <HistoryList items={filtered}></HistoryList>
                </>
            ) : (
                <HistoryEmpty></HistoryEmpty>
            )}
        </View>
    );
};

export default HistoryScreen;
