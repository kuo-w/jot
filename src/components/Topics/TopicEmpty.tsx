import React from "react";
import { Mug } from "react-kawaii/lib/native";
import { Text, View } from "react-native";
import { kawaiiColor, textSecondaryColor } from "colors";

const TopicEmpty = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ right: 25 }}>
        <Mug size={180} mood="sad" color={kawaiiColor} />
      </View>
      <Text style={{ color: textSecondaryColor, marginTop: 20 }}>
        No topics found. Write some more?
      </Text>
    </View>
  );
};

export default TopicEmpty;
