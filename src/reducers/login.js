import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from "../actions/login.js";

const login = (
  state = {
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
        error: false
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        payload: action.payload
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        payload: action.payload,
        error: true
      });
    default:
      return state;
  }
};

export default login;
