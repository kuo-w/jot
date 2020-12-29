import React, { ReactElement } from "react";
import { useDispatch } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import { Login } from "store/authSlice";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppNavigatorParamList } from "types";
import AuthOptionButton from "@components/Auth/AuthOptionButton";
import { appBgColor, textSecondaryColor } from "colors";

type NavigationProp = BottomTabNavigationProp<AppNavigatorParamList, "SignIn">;

type Props = {
    navigation: NavigationProp;
};

const SignInScreen = ({ navigation }: Props): ReactElement => {
    const dispatch = useDispatch();

    const navigateHome = () => {
        console.log("SIGNIN SCREEN::CALLBACK ON LOGIN SUCCESS");
        navigation.navigate("Jot");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <AuthOptionButton
                title="Google"
                onPress={() =>
                    dispatch(
                        Login({ method: "Google", onSuccess: navigateHome })
                    )
                }
                iconName="logo-google"
                color="#eee"
                bgColor="#ba2d65"
            ></AuthOptionButton>
            <AuthOptionButton
                title="Guest"
                onPress={() =>
                    dispatch(
                        Login({ method: "Anonymous", onSuccess: navigateHome })
                    )
                }
                iconName="md-person"
                color="#3B3B3B"
                bgColor="#eee"
            ></AuthOptionButton>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        color: textSecondaryColor,
        fontSize: 40,
        marginBottom: 20,
        fontWeight: "bold",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appBgColor,
    },
});
export default SignInScreen;
