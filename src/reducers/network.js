import { SET_CONNECTED } from "../actions/network";

export default (
  state = {
    isConnected: null
  },
  action
) => {
  switch (action.type) {
    case SET_CONNECTED:
      return Object.assign({}, state, {
        isConnected: action.isConnected
      });
    default:
      return state;
  }
};
