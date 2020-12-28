import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import {
    appForegroundColor,
    appForegroundSecondColor,
    textSecondaryColor,
    textTertiaryColor,
} from "colors";
import { IconName } from "types";

type FabPositionStyle = {
    primary: ViewStyle;
    secondary: ViewStyle;
};

const styling: FabPositionStyle = {
    primary: {
        width: 60,
        bottom: 20,
        right: 25,
        height: 60,
        backgroundColor: appForegroundColor,
        borderRadius: 100,
    },
    secondary: {
        width: 52,
        bottom: 100,
        right: 29,
        height: 52,
        backgroundColor: appForegroundSecondColor,
        borderRadius: 100,
    },
};

type Props = {
    icon: IconName;
    onPress: () => void;
    position?: keyof FabPositionStyle;
};

const switchIconStyle = (
    position: keyof FabPositionStyle
): [number, string] => {
    switch (position) {
        case "primary":
            return [30, textTertiaryColor];
        case "secondary":
            return [20, textSecondaryColor];
    }
};

const Icon = (name: IconName, position: keyof FabPositionStyle) => {
    const [size, color] = switchIconStyle(position);

    switch (name) {
        case "checkmark":
            return <Ionicons name="md-checkmark" size={size} color={color} />;
        case "hash":
            return <Feather name="hash" size={size} color={color} />;
    }
};

const Fab = ({ onPress, icon, position = "primary" }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                ...styling[position],
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.2)",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                zIndex: 2,
            }}
        >
            {Icon(icon, position)}
        </TouchableOpacity>
    );
};

export default Fab;
