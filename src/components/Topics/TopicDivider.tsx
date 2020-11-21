import { textSecondaryColor } from "colors";
import React from "react";
import { View } from "react-native";

const TopicDivider = () => {
  return (
    <View style={{ paddingHorizontal: 30 }}>
      <View
        style={{
          borderBottomColor: textSecondaryColor,
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
};

export default TopicDivider;
