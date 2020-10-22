import { Jot } from "types.js";
import * as firebase from "./firebaseApi.js";
import storage, { StorageKey } from "./storageApi.js";

const _getUniqueByGuid = (items: Jot[]): Jot[] => {
  const uniqueGuids = new Set<string>();
  const result = new Set<Jot>();

  items.forEach((item) => {
    if (uniqueGuids.has(item.guid)) {
      console.error(`Found duplicate: ${item.guid}`);
      return;
    }

    result.add(item);
  });

  return [...result];
};

const _findDifference = (subset: Jot[], all: Jot[]): Jot[] => {
  const reducer = (acc: Map<string, Jot>, j: Jot) => {
    acc.set(j.guid, j);
    return acc;
  };
  const complement = new Array<Jot>();
  const subsetmap = subset.reduce(reducer, new Map<string, Jot>());
  all.forEach((j) => {
    if (!subsetmap.has(j.guid)) {
      complement.push(<Jot>subsetmap.get(j.guid));
    }
  });

  return complement;
};

const _syncWithConnected = async (): Promise<Jot[]> => {
  const result = await Promise.all([
    firebase.getJots(),
    storage.get<Jot[]>(StorageKey.JOTS),
  ]);
  const remote = result[0];
  let local = result[1];

  if (local == null) {
    local = new Array<Jot>();
  } else {
    local = _getUniqueByGuid(local);
  }

  if (remote == undefined) {
    return local;
  }

  const combined = _getUniqueByGuid(remote.concat(<Jot[]>local));
  const itemsToUpload = _findDifference(remote, combined);

  for (const j of itemsToUpload) {
    firebase.setJot(j);
  }

  storage.write<Jot[]>(StorageKey.JOTS, combined);

  return combined;
};

const getall = async (): Promise<Jot[]> => {
  return await _syncWithConnected();
};

const save = async (jot: Jot): Promise<Jot[]> => {
  const tasks = new Array<Promise<void | Jot[]>>();
  tasks.push(storage.pushItem<Jot>(StorageKey.JOTS, jot));
  tasks.push(firebase.setJot(jot));

  const result = await Promise.all(tasks);
  return <Jot[]>result[0];
};

export default { save, getall };
