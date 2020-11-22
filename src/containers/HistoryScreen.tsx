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
      <View style={styles.topBar}>
        <View>
          {jots.length > 0 && (
            <Text style={styles.count}>
              {`${filtered.length} / ${jots.length}`}
            </Text>
          )}
        </View>
        {!!route?.params?.topic && !ignoreFilter && (
          <View style={styles.filterContainer}>
            <Text style={styles.topic}>{route.params.topic}</Text>
            <MaterialCommunityIcons.Button
              onPress={() => setIgnoreFilter(true)}
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
          onPress={() => navigation.navigate("Settings")}
        />
      </View>
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

export default HistoryScreen;
