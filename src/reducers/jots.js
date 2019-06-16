import { JOT_NEW, JOT_ADD_ITEMS } from "../actions/jots";

const jots = (
  state = {
    items: []
  },
  action
) => {
  switch (action.type) {
    case JOT_NEW:
      return Object.assign({}, state, {
        items: [...state.items, action.jot]
      });
    case JOT_ADD_ITEMS:
      return Object.assign({}, state, {
        items: [...state.items, ...action.jots]
      });
    default:
      return state;
  }
};

export default jots;
