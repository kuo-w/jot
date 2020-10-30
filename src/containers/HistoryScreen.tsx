import React, {
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { TextInput, View } from "react-native";
import { selectJots } from "store/jotsSlice";
import HistoryEmpty from "@components/History/HistoryEmpty";
import HistoryList from "@components/History/HistoryList";
import { appBgColor } from "colors";
import HistoryTopBar from "@components/History/HistoryTopBar";
import useFuzzySearch from "hooks/useFuzzySearch";
import { AppNavigatorParamList } from "types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type NavigationProp = BottomTabNavigationProp<AppNavigatorParamList, "History">;

type Props = {
  navigation: NavigationProp;
};

const HistoryScreen = ({ navigation }: Props): ReactElement => {
  const searchBarTextInput: React.RefObject<TextInput> = useRef(null);
  const { jots } = useSelector(selectJots);
  const fuzzySearch = useFuzzySearch(jots, "text", "guid");
  const [includeItemIds, setIncludeItemIds] = useState<string[] | null>(null);

  useEffect(() => {
    const blurListener = navigation.addListener("blur", () => {
      searchBarTextInput.current?.clear();
      setIncludeItemIds(null);
    });

    return blurListener;
  }, [navigation]);

  const handleSearchText = (text: string) => {
    const includeIds = fuzzySearch(text);
    setIncludeItemIds(includeIds);
  };

  const _filterItems = (itemsToInclude: string[] | null) => {
    if (!itemsToInclude) {
      return jots;
    }

    return jots.filter((j) => itemsToInclude.includes(j.guid));
  };

  return (
    <View style={{ backgroundColor: appBgColor, flex: 1 }}>
      {jots.length > 0 ? (
        <>
          <HistoryTopBar
            ref={searchBarTextInput}
            textChangeHandler={handleSearchText}
          ></HistoryTopBar>
          <HistoryList items={_filterItems(includeItemIds)}></HistoryList>
        </>
      ) : (
        <HistoryEmpty></HistoryEmpty>
      )}
    </View>
  );
};

export default HistoryScreen;
