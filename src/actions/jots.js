import {
  saveJot,
  syncJots,
  getLocalJots,
  clearLocalJots
} from "../api/jots.js";

export const JOT_NEW = "JOT_NEW";
export const JOT_SET_ITEMS = "JOT_SET_ITEMS";
export const JOT_CLEAR_LOCAL = "JOT_CLEAR_LOCAL";

// Action on entry submit to push new jot to top of history
const _pushToHistory = jot => {
  return {
    type: JOT_NEW,
    jot
  };
};

// Action to reset history to passed in jots
const _resetHistory = jots => {
  return {
    type: JOT_SET_ITEMS,
    jots
  };
};

// Action on application load to load jots
export const jotGetAll = () => {
  // TODO: add loading action
  return async (dispatch, getState) => {
    const state = getState();
    let jots;
    if (state.auth.signedIn && state.network.isConnected) {
      jots = await syncJots();
    } else {
      jots = await getLocalJots();
    }
    dispatch(_resetHistory(jots));
  };
};

export const jotClearLocal = () => {
  clearLocalJots();
  return {
    type: JOT_CLEAR_LOCAL
  };
};

// Action on entry submit
export const jotSubmit = text => {
  return async (dispatch, getState) => {
    let date = new Date();
    date.setSeconds(0, 0);
    const newJot = {
      text: text,
      createdAt: date
    };
    dispatch(_pushToHistory(newJot));
    try {
      await saveJot(newJot, getState().network.isConnected);
    } catch (error) {
      console.error(error);
      // TODO: add another action to handle failure
      // something like
      // > store failed text
      // > retry later
    }
  };
};
