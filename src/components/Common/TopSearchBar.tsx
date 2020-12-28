import SearchBar from "@components/Common/SearchBar";
import { appBgColor } from "colors";
import React, { forwardRef } from "react";
import { View, TextInput } from "react-native";

type Props = {
    textChangeHandler: (text: string) => void;
};

const TopSearchBar = forwardRef<TextInput, Props>(
    ({ textChangeHandler }, ref) => {
        return (
            <View
                style={{
                    backgroundColor: appBgColor,
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    zIndex: 1,
                }}
            >
                <SearchBar
                    ref={ref}
                    textChangeHandler={textChangeHandler}
                ></SearchBar>
            </View>
        );
    }
);

export default TopSearchBar;
