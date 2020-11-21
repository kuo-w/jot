import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { appBgColor, navActiveTintColor } from "colors";
import React, { forwardRef, RefObject, useEffect, useState } from "react";
import { TextInput, View } from "react-native";

type Props = {
  textChangeHandler: (text: string) => void;
};

const SearchBar = forwardRef<TextInput, Props>(({ textChangeHandler }, ref) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 10,
        alignItems: "center",
      }}
    >
      <AntDesign
        name="search1"
        size={20}
        style={{ backgroundColor: "black" }}
        color={navActiveTintColor}
      />
      <TextInput
        ref={ref}
        placeholder="Search"
        caretHidden={true}
        placeholderTextColor={navActiveTintColor}
        onChangeText={textChangeHandler}
        style={{
          backgroundColor: appBgColor,
          color: navActiveTintColor,
          flexGrow: 1,
          fontSize: 18,
          paddingLeft: 6,
        }}
      ></TextInput>
    </View>
  );
});

export default SearchBar;
