import { Alert } from "react-native";
import * as firebase from "../api/firebase.js";
import * as google from "../api/google.js";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const logout = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: LOGOUT_REQUEST
    });
    await firebase.logout();
    const { accessToken } = getState().auth;
    await google.logout(accessToken);
    dispatch({
      type: LOGOUT_SUCCESS
    });
  };
};

const loginRequest = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const loginSuccess = data => {
  return {
    type: LOGIN_SUCCESS,
    payload: data,
    accessToken: data.accessToken
  };
};

const loginFailure = error => {
  return {
    type: LOGIN_FAILURE,
    payload: error
  };
};

export const login = () => {
  return async dispatch => {
    dispatch(loginRequest());
    try {
      const oauthResult = await google.signin();
      if (oauthResult == null) {
        dispatch(loginFailure(error));
        return false;
      }
      const { idToken, accessToken, user } = oauthResult;
      await firebase.auth(idToken, accessToken);
      await firebase.setUser(user);
      dispatch(loginSuccess({ accessToken }));
      return true;
    } catch (error) {
      dispatch(loginFailure(error));
      return false;
    }
  };
};
