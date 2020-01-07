import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  USER_IS_SIGNED_IN
} from "../actions/auth";

export default (
  state = {
    accessToken: null,
    fetching: false,
    payload: null,
    error: false,
    signedIn: false
  },
  action
) => {
  switch (action.type) {
    case USER_IS_SIGNED_IN:
      return { ...state, signedIn: true };
    case LOGIN_REQUEST:
      return { ...state, fetching: true, error: state.error, payload: null };
    case LOGIN_SUCCESS:
      return {
        ...state,
        accessToken: action.accessToken,
        fetching: false,
        payload: action.payload,
        error: false,
        signedIn: true
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        fetching: false,
        payload: action.payload,
        error: true,
        signedIn: false
      };
    case LOGOUT_REQUEST:
      return { ...state, fetching: true, error: false, payload: null };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        fetching: false,
        payload: null,
        error: false,
        accessToken: null,
        signedIn: false
      };
    default:
      return state;
  }
};
