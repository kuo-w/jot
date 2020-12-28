import React from "react";
import { Ghost } from "react-kawaii/lib/native";
import { Text, View } from "react-native";
import { kawaiiColor, textSecondaryColor } from "colors";

const HistoryEmpty = () => {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Ghost size={250} mood="sad" color={kawaiiColor} />
            <Text style={{ color: textSecondaryColor, marginTop: 20 }}>
                Nothing to see here.
            </Text>
        </View>
    );
};

export default HistoryEmpty;
