import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Jot } from "types";
import HistoryItem from "./HistoryItem";

type Props = {
    items: Jot[];
};

const HistoryList = ({ items }: Props) => {
    return (
        <FlatList
            data={[...items].sort((a, b) =>
                dayjs(b.createdAt).diff(dayjs(a.createdAt))
            )}
            keyExtractor={(item: Jot, _index: number) => item.guid}
            renderItem={({ item }: { item: Jot }) => (
                <HistoryItem item={item}></HistoryItem>
            )}
        />
    );
};

export default HistoryList;
