import { Jot, RemoteApi, JotGetAll, ShouldFetchRemote } from "types";
import storage, { StorageKey } from "./storageApi";
import { v4 as uuidv4 } from "uuid";

let remoteApi: RemoteApi | null = null;

const initializeApi = (remoteApi_: RemoteApi) => {
  remoteApi = remoteApi_;
};

const _getUniqueByGuid = (items: Jot[]): Jot[] => {
  const uniqueGuids = new Set<string>();
  const result = new Set<Jot>();

  items.forEach((item) => {
    if (uniqueGuids.has(item.guid)) {
      return;
    }

    uniqueGuids.add(item.guid);
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

const _syncWithConnected = async (
  shouldFetchRemote: boolean
): Promise<JotGetAll> => {
  console.log(`JOT API::REMOTE API EXISTS? ${remoteApi != null}`);

  if (!shouldFetchRemote || !remoteApi) {
    const items = (await storage.get<Jot[]>(StorageKey.JOTS)) ?? [];
    console.log("JOT API::LOCAL FETCH");
    console.log(items);
    return {
      items: items,
      remoteFetch: false,
    };
  }

  console.log("JOT API::SYNCING");
  const result = await Promise.all([
    remoteApi.getall(),
    storage.get<Jot[]>(StorageKey.JOTS),
  ]);
  const remote = result[0];
  let local = result[1];

  console.log("JOT API::REMOTE RESULT");
  console.log(remote);
  console.log("JOT API::LOCAL RESULT");
  console.log(local);

  if (local == undefined) {
    local = [];
  }

  if (remote == undefined) {
    return { items: local, remoteFetch: false };
  }

  const combined = _getUniqueByGuid(remote.concat(local));

  console.log("JOT API::COMBINED");
  console.log(combined);

  const itemsToUpload = _findDifference(remote, combined);

  for (const j of itemsToUpload) {
    remoteApi.set(j);
  }
  console.log("JOT API::UPLOAD ITEMS");
  console.log(itemsToUpload);

  await storage.write<Jot[]>(StorageKey.JOTS, combined);

  return { items: combined, remoteFetch: true };
};

const _sort = (items: Jot[]) => {
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

const getall = async (
  shouldFetchRemote: ShouldFetchRemote
): Promise<JotGetAll> => {
  const result = await _syncWithConnected(shouldFetchRemote);
  result.items = _sort(result.items);
  return result;
};

const save = async (text: string): Promise<Jot[]> => {
  const item: Jot = {
    text,
    createdAt: new Date().toJSON(),
    guid: uuidv4(),
  };

  const tasks: (Promise<any> | Promise<void>)[] = [
    storage.pushItem<Jot>(StorageKey.JOTS, item),
  ];

  if (remoteApi) {
    tasks.push(remoteApi.set(item));
  }

  const result = await Promise.all(tasks);

  return _sort(result[0]);
};

export default { save, getall, initializeApi };
