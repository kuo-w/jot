import { Ionicons } from "@expo/vector-icons";
import { relativeTime } from "dayjs/locale/*";
import React, { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ceil } from "react-native-reanimated";

type Props = {
    title: string;
    onPress: () => void;
    iconName: string;
    color: string;
    bgColor: string;
};

const AuthOptionButton = ({
    title,
    onPress,
    iconName,
    color,
    bgColor,
}: Props): ReactElement => {
    return (
        <View style={{ paddingVertical: 10 }}>
            <Ionicons.Button
                name={iconName}
                onPress={onPress}
                iconStyle={styles.icon}
                style={styles.iconButton}
                color={color}
                backgroundColor={bgColor}
            >
                <Text style={[styles.buttonText, { color: color }]}>
                    {title}
                </Text>
            </Ionicons.Button>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 18,
    },
    iconButton: {
        width: 180,
        height: 50,
        justifyContent: "center",
    },
    icon: { position: "absolute", left: 20 },
});

export default AuthOptionButton;
