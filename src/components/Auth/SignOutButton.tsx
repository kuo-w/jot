import React, { ReactElement } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { logout } from "store/authSlice";

const SignOutButton = (): ReactElement => {
  const dispatch = useDispatch();

  const signoutAsync = () => {
    dispatch(logout());
  };

  return (
    <>
      <Ionicons.Button
        name="md-refresh"
        onPress={signoutAsync}
        iconStyle={{ margin: 10 }}
        color="#eee"
        backgroundColor="#ba2d65"
      >
        Retry
      </Ionicons.Button>
    </>
  );
};

export default SignOutButton;
