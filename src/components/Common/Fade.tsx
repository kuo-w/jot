import React, { ReactElement, useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

type Props = {
    children: ReactElement;
    style: ViewStyle;
    visible: boolean;
};

// Fades inner components in-and-out.
const Fade = (props: Props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        if (props.visible) fadeIn();
        else fadeOut();

        return () => fadeOut();
    }, [props.visible]);

    return (
        <Animated.View
            style={{
                ...props.style,
                opacity: fadeAnim, // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
};

export default Fade;
