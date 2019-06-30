import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS
} from "../actions/auth";

export default (
  state = {
    accessToken: null,
    fetching: false,
    payload: null,
    error: false
  },
  action
) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        fetching: true,
        error: state.error,
        payload: null
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        accessToken: action.accessToken,
        fetching: false,
        payload: action.payload,
        error: false
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        payload: action.payload,
        error: true
      });
    case LOGOUT_REQUEST:
      return Object.assign({}, state, {
        fetching: true,
        error: false,
        payload: null
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        payload: null,
        error: false,
        accessToken: null
      });
    default:
      return state;
  }
};
