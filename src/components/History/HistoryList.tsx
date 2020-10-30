import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Jot } from "types";
import HistoryItem from "./HistoryItem";

type Props = {
  items: Jot[];
};

const HistoryList = ({ items }: Props) => {
  const [histItems, setHistItems] = useState(items);

  useEffect(() => {
    setHistItems(items);
  }, [items]);

  return (
    <FlatList
      data={histItems}
      keyExtractor={(item: Jot, _index: number) => item.guid}
      renderItem={({ item }: { item: Jot }) => (
        <HistoryItem item={item}></HistoryItem>
      )}
    />
  );
};

export default HistoryList;
