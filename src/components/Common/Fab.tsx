import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { appForegroundColor, textTertiaryColor } from "colors";

type Props = {
  onPress: () => void;
};

const Fab = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        position: "absolute",
        bottom: 20,
        right: 20,
        height: 70,
        backgroundColor: appForegroundColor,
        borderRadius: 100,
        zIndex: 1,
      }}
    >
      <Ionicons name="md-checkmark" size={30} color={textTertiaryColor} />
    </TouchableOpacity>
  );
};

export default Fab;
