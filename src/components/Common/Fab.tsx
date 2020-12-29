import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, TouchableOpacity, ViewStyle } from "react-native";
import {
    appForegroundColor,
    appForegroundSecondColor,
    textSecondaryColor,
    textTertiaryColor,
} from "colors";
import { IconName } from "types";
import Fade from "./Fade";
import useKeyboard from "hooks/useKeyboard";

type FabPositionStyle = {
    primary: ViewStyle;
    secondary: ViewStyle;
};

const styling: FabPositionStyle = {
    primary: {
        width: 60,
        bottom: 20,
        top: Dimensions.get("window").height * 0.8,
        right: 25,
        height: 60,
        backgroundColor: appForegroundColor,
        borderRadius: 100,
    },
    secondary: {
        width: 52,
        bottom: 100,
        top: Dimensions.get("window").height * 0.7,
        right: 29,
        height: 52,
        backgroundColor: appForegroundSecondColor,
        borderRadius: 100,
    },
};

type Props = {
    icon: IconName;
    onPress: () => void;
    visible: boolean;
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

const Fab = ({ onPress, icon, position = "primary", visible }: Props) => {
    const kbVisible = useKeyboard();

    return (
        <Fade
            style={{
                ...styling[position],
                bottom: kbVisible ? styling[position]["bottom"] : undefined,
                top: kbVisible ? undefined : styling[position]["top"],
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                zIndex: 2,
            }}
            visible={visible}
        >
            <TouchableOpacity onPress={onPress}>
                {Icon(icon, position)}
            </TouchableOpacity>
        </Fade>
    );
};

export default Fab;
