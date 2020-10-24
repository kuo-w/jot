import { Ionicons } from "@expo/vector-icons";
import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thirdPartyLogin,
  selectAuth,
  ThirdPartyAuthType,
} from "store/authSlice";

const SignInButton = (): ReactElement => {
  const { fetching } = useSelector(selectAuth);

  const dispatch = useDispatch();

  const signinAsync = async (option: ThirdPartyAuthType) => {
    if (fetching) {
      return;
    }

    dispatch(thirdPartyLogin(option));
  };

  return (
    <Ionicons.Button
      name="logo-google"
      onPress={() => signinAsync("Google")}
      iconStyle={{ margin: 10 }}
      color="#eee"
      backgroundColor="#ba2d65"
    >
      Login with Google
    </Ionicons.Button>
  );
};

export default SignInButton;
