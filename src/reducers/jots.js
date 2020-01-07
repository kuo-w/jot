import { JOT_NEW, JOT_SET_ITEMS, JOT_CLEAR_LOCAL } from "../actions/jots";

export default (
  state = {
    items: []
  },
  action
) => {
  switch (action.type) {
    case JOT_NEW:
      return { ...state, items: [action.jot, ...state.items] };
    case JOT_SET_ITEMS:
      return { ...state, items: action.jots };
    case JOT_CLEAR_LOCAL:
      return { ...state, items: [] };
    default:
      return state;
  }
};
