import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Animated, ViewStyle } from "react-native";

type Props = {
    children: ReactElement;
    style: ViewStyle;
    visible: boolean;
};

// Fades inner components in-and-out.
const Fade = (props: Props) => {
    const [fading, setFading] = useState(false);
    const [_visible, _SetVisible] = useState(props.visible);
    const fadeValue = new Animated.Value(props.visible ? 1 : 0);
    const fadeAnim = useRef(fadeValue).current;

    const fadeIn = () => {
        setFading(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setFading(false);
            _SetVisible(true);
        });
    };

    const fadeOut = () => {
        setFading(true);
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setFading(false);
            _SetVisible(false);
        });
    };

    useEffect(() => {
        if (_visible == props.visible) return;

        if (props.visible) fadeIn();
        else fadeOut();
    }, [props.visible]);

    return (
        <Animated.View
            style={{
                ...props.style,
                opacity: fadeAnim, // Bind opacity to animated value
            }}
        >
            {(fading || _visible) && props.children}
        </Animated.View>
    );
};

export default Fade;
