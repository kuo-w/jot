import * as firebase from "./firebase.js";
import * as storage from "./storage.js";

const saveJot = async (jot, connected) => {
  storage.setJot(jot);
  if (connected) {
    firebase.setJot(jot);
  }
};

const getLocalJots = async () => {
  return _filterByTime(await storage.getJots());
};

const syncJots = async () => {
  return await _syncWithConnected();
};

const clearLocalJots = async () => {
  await storage.removeJots();
};

const _filterByTime = items => {
  let joined = items.filter(function(o) {
    return this.has(o.createdAt.getTime())
      ? false
      : this.add(o.createdAt.getTime());
  }, new Set());
  joined.sort((a, b) => b.createdAt - a.createdAt);
  return joined;
};

const _syncWithConnected = async () => {
  let [dbjots, localjots] = await Promise.all([
    firebase.getJots(),
    storage.getJots()
  ]);

  dbjots = _filterByTime(dbjots);

  const joined = _filterByTime(dbjots.concat(localjots));

  // Determine which items are not in database
  let saveToDb = [];
  let dbIndex = 0;
  for (const j of joined) {
    if (dbIndex < dbjots.length && dbjots[dbIndex]) {
      if (dbjots[dbIndex].createdAt.getTime() !== j.createdAt.getTime()) {
        saveToDb.push(j);
      } else {
        dbIndex += 1;
      }
    } else {
      saveToDb.push(j);
    }
  }

  for (const j of saveToDb) {
    firebase.setJot(j);
  }

  storage.rewriteJots(joined);

  return joined;
};

export { saveJot, syncJots, getLocalJots, clearLocalJots };
