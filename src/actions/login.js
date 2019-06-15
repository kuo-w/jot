import { auth, setUser } from "../api/firebase.js";
import { signin } from "../api/google.js";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

const loginRequest = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const loginSuccess = data => {
  return {
    type: LOGIN_SUCCESS,
    payload: data
  };
};

const loginFailure = error => {
  return {
    type: LOGIN_FAILURE,
    payload: error
  };
};

export const login = (idToken, accessToken) => {
  return async dispatch => {
    dispatch(loginRequest());
    try {
      const { idToken, accessToken, user } = await signin();
      await auth(idToken, accessToken);
      await setUser(user);
      dispatch(loginSuccess(result));
    } catch (error) {
      dispatch(loginFailure(error));
    }
  };
};
