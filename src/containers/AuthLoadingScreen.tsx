import React, { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { getall } from "store/jotsSlice";
import { setSignedIn } from "store/authSlice";
import { selectNetwork } from "store/networkSlice";
import { StackNavigationProp } from "@react-navigation/stack";
import firebase from "firebase";
import { RootStackParamList } from "types";

type AuthLoadingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AuthLoading"
>;

type Props = {
  navigation: AuthLoadingScreenNavigationProp;
};

const AuthLoadingScreen = ({ navigation }: Props): ReactElement => {
  const dispatch = useDispatch();
  const { isInternetReachable } = useSelector(selectNetwork);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setSignedIn());
        dispatch(getall());
      }
    });

    dispatch(getall());
    navigation.navigate("App");
  });

  useEffect(() => {
    if (!isInternetReachable) {
      return;
    }

    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      dispatch(setSignedIn());
    }
  }, [isInternetReachable, dispatch]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar hidden={true} />
      <ActivityIndicator size="large" color="#333" />
    </View>
  );
};

export default AuthLoadingScreen;
