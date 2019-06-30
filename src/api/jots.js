import * as firebase from "./firebase.js";
import * as storage from "./storage.js";
import store from "../store";

const _isConnected = () => store.getState().network.isConnected;

const saveJot = async jot => {
  await storage.setJot(jot);
  if (_isConnected()) {
    try {
      firebase.setJot(jot);
    } catch (error) {
      // TODO show error msg
    }
  }
};

const getJots = async () => {
  const jots = await storage.getJots();
  return jots;
};

const syncJots = async () => {
  if (_isConnected()) {
    await _syncWithConnected();
  }
};

const _syncWithConnected = async () => {
  try {
    await storage.removeJots();
    const [dbjots, localjots] = await Promise.all([
      firebase.getJots(),
      storage.getJots()
    ]);
    const saveDatabaseToLocal = dbjots.length > localjots.length;
    const saveLocalToDatabase = localjots.length > dbjots.length;
    if (saveDatabaseToLocal) {
      const oldjots = dbjots.slice(localjots.length, dbjots.length);
      // not parallel due to race condition
      for (const jot of oldjots) {
        await storage.setJot(jot);
      }
    } else if (saveLocalToDatabase) {
      const newjots = localjots.slice(dbjots.length, localjots.length);
      await Promise.all(newjots.map(jot => firebase.setJot(jot)));
    }
  } catch (error) {
    // TODO show error msg
  }
};

export { saveJot, getJots, syncJots };
