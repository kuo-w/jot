import React from "react";
import { FlatList, View, Text } from "react-native";

class JotData {
  constructor(text, createdAt = new Date()) {
    this.text = text;
    this.createdAt = createdAt;
  }
}

export default function HistoryScreen() {
  return (
    <FlatList
      data={[new JotData("hello"), new JotData("goodbye")]}
      keyExtractor={(_, index) => index + ""}
      renderItem={({ item: jotData }) => {
        return (
          <View style={{ flexDirection: "row" }}>
            <Text>{jotData.text}</Text>
            <Text>{jotData.createdAt.toString()}</Text>
          </View>
        );
      }}
    />
  );
}
