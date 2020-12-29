import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { Topic } from "types";
import TopicListItem from "./Topic";
import TopicDivider from "./TopicDivider";

type Props = {
    data: Topic[];
    onPress: (topic: string) => void;
    onLongPress: (topic: string) => void;
};

// https://stackoverflow.com/questions/45868284/how-to-get-currently-visible-index-in-rn-flat-list

const TopicList = ({ data, onPress, onLongPress }: Props) => {
    return (
        <FlatList
            data={[...data].sort((d) => d.count)}
            renderItem={({ item, index }: { item: Topic; index: number }) => (
                <>
                    <TopicListItem
                        data={item}
                        onPress={onPress}
                        onLongPress={onLongPress}
                    ></TopicListItem>
                    {index != data.length - 1 && <TopicDivider></TopicDivider>}
                </>
            )}
            keyExtractor={(item) => item.name}
        ></FlatList>
    );
};

export default TopicList;
