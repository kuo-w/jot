import TopSearchBar from "@components/Common/TopSearchBar";
import TopicEmpty from "@components/Topics/TopicEmpty";
import TopicInput from "@components/Topics/TopicInput";
import TopicList from "@components/Topics/TopicList";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { renameTopic } from "@store/jotSlice";
import { selectTopics } from "@store/topicSlice";
import useFuzzySearch from "hooks/useFuzzySearch";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppNavigatorParamList, Topic } from "types";

type NavigationProp = BottomTabNavigationProp<AppNavigatorParamList, "Topics">;

type Props = {
    navigation: NavigationProp;
};

const TopicsScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch();
    const { topics } = useSelector(selectTopics);
    const [showInput, setShowInput] = useState(false);
    const [topicEdit, setTopicEdit] = useState("");
    const [includeTopics, setIncludeTopics] = useState<string[] | null>(null);
    const [topicInputText, setTopicInputText] = useState("");
    const fuzzySearch = useFuzzySearch(topics, "name", "name");
    const searchBarTextInput = useRef<TextInput>(null);

    useEffect(() => {
        const blurListener = navigation.addListener("blur", () => {
            setShowInput(false);
            setIncludeTopics(null);
            searchBarTextInput.current?.clear();
        });

        return blurListener;
    }, [navigation]);

    const goHistory = (topic: string) => {
        navigation.navigate("History", { topic });
    };

    const editTopic = (topic: string) => {
        setTopicInputText(topic);
        setTopicEdit(topic);
        setShowInput(true);
    };

    const topicInputSubmit = () => {
        dispatch(
            renameTopic({
                oldTopic: topicEdit,
                newTopic: topicInputText,
            })
        );
        setShowInput(false);
    };

    const handleSearchText = (text: string) => {
        if (text == "") {
            setIncludeTopics(null);
            return;
        }

        const includeIds = fuzzySearch(text);
        setIncludeTopics(includeIds);
    };

    const _filtered = (topics: Topic[]): Topic[] => {
        if (includeTopics == null) {
            return topics;
        }

        return topics.filter((t) => includeTopics?.includes(t.name));
    };

    if (topics.length == 0) return <TopicEmpty></TopicEmpty>;

    return (
        <>
            {showInput ? (
                <TopicInput
                    value={topicInputText}
                    onTextChange={setTopicInputText}
                    onKeyboardHide={() => setShowInput(false)}
                    onSubmit={topicInputSubmit}
                ></TopicInput>
            ) : (
                <>
                    <View style={{ paddingHorizontal: 10 }}>
                        <TopSearchBar
                            ref={searchBarTextInput}
                            textChangeHandler={handleSearchText}
                        ></TopSearchBar>
                    </View>
                    <TopicList
                        data={_filtered(topics)}
                        onPress={goHistory}
                        onLongPress={editTopic}
                    ></TopicList>
                </>
            )}
        </>
    );
};

export default TopicsScreen;
