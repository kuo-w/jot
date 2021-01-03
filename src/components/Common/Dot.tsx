import React from "react";
import { View } from "react-native";

type Props = {
    size: number;
    color: string;
};

const Dot = (props: Props) => {
    return (
        <View
            style={{
                width: props.size,
                height: props.size,
                borderRadius: props.size / 2,
                backgroundColor: props.color,
            }}
        />
    );
};

export default Dot;
