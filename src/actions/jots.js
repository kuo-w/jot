import { saveJot, getJots, syncJots } from "../api/jots.js";

export const JOT_SUBMIT = "JOT_SUBMIT";
export const JOT_NEW = "JOT_NEW";
export const JOT_ADD_ITEMS = "JOT_ADD_ITEMS";

const jotNew = jot => {
  return {
    type: JOT_NEW,
    jot
  };
};

const jotAddItems = jots => {
  return {
    type: JOT_ADD_ITEMS,
    jots
  };
};

export const jotGetAll = () => {
  // add loading action
  return async dispatch => {
    try {
      await syncJots();
      const jots = await getJots();
      dispatch(jotAddItems(jots));
    } catch (error) {
      // dispatch error
    }
  };
};

export const jotSubmit = text => {
  return async dispatch => {
    const newJot = {
      text: text,
      createdAt: new Date()
    };
    dispatch(jotNew(newJot));
    try {
      await saveJot(newJot);
      return;
    } catch (error) {
      console.error(error);

      // TODO: add another action to handle failure
      // something like
      // > store failed text
      // > retry later
    }
  };
};
