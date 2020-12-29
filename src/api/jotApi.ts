import {
    Jot,
    RemoteApi,
    JotGetAll,
    ShouldFetchRemote,
    JotUpdateFields,
} from "types";
import storage, { StorageKey } from "./storageApi";
import { v4 as uuidv4 } from "uuid";

let _remoteApi: RemoteApi | null = null;

const initializeApi = (remoteApi: RemoteApi) => {
    _remoteApi = remoteApi;
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

const _getItemsOnlyLocal = (local: Jot[], remote: Jot[]): Jot[] => {
    const remote_ = new Set(remote.map((i) => i.guid));
    const local_ = new Set(local.map((i) => i.guid));
    const localOnly = new Set([...local_].filter((i) => !remote_.has(i)));

    return [...local].filter((i) => localOnly.has(i.guid));
};

const _syncWithConnected = async (
    shouldFetchRemote: boolean
): Promise<JotGetAll> => {
    console.log(`JOT API::REMOTE API EXISTS? ${_remoteApi != null}`);

    if (!shouldFetchRemote || !_remoteApi) {
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
        _remoteApi.getAll(),
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

    const itemsToUpload = _getItemsOnlyLocal(local, remote);

    for (const j of itemsToUpload) {
        _remoteApi.set(j);
    }
    console.log("JOT API::UPLOAD ITEMS");
    console.log(itemsToUpload);

    await storage.write<Jot[]>(StorageKey.JOTS, combined);

    return { items: combined, remoteFetch: true };
};

const _sort = (items: Jot[]) => {
    return items.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

const getall = async (
    shouldFetchRemote: ShouldFetchRemote
): Promise<JotGetAll> => {
    const result = await _syncWithConnected(shouldFetchRemote);
    result.items = _sort(result.items);
    return result;
};

const edit = async (item: Jot, edits: JotUpdateFields) => {
    const items = await storage.get<Jot[]>(StorageKey.JOTS);
    if (items == undefined) return [];

    const deleteIndex = items.findIndex((i) => i.guid == item.guid);
    const modified = { ...item, ...edits };
    items.splice(deleteIndex, 1, modified);

    await storage.write<Jot[]>(StorageKey.JOTS, items);
    if (_remoteApi) await _remoteApi.set(modified);

    return items;
};

const renameTopic = async (
    items: Jot[],
    oldTopic: string,
    newTopic: string
): Promise<Jot[]> => {
    oldTopic = oldTopic.toLowerCase();
    newTopic = newTopic.toLowerCase();

    const copies = [...items];

    let updated: Jot[] = [];
    let result = copies.map((item) => {
        if (item.topics == undefined) return item;

        const idxTopic = item.topics.indexOf(oldTopic);
        if (idxTopic == -1) return item;

        let topicsCopy = [...item.topics];
        topicsCopy.splice(idxTopic, 1, newTopic);

        let temp: Jot = {
            ...item,
            topics: [...new Set(topicsCopy)],
        };
        updated.push(temp);
        return temp;
    });

    console.log("UPDATED JOT API");
    console.log(result);

    const tasks = [storage.write<Jot[]>(StorageKey.JOTS, result)];

    if (_remoteApi) {
        tasks.push(_remoteApi.update(updated));
    }

    await Promise.all(tasks);

    return result;
};

const save = async (
    text: string,
    topics: string[] = [],
    guid?: string
): Promise<Jot[]> => {
    const item: Jot = {
        text,
        topics: topics.map((t) => t.toLowerCase()),
        createdAt: new Date().toJSON(),
        guid: guid ?? uuidv4(),
    };

    const tasks: (Promise<any> | Promise<void>)[] = [
        storage.pushItem<Jot>(StorageKey.JOTS, item),
    ];

    if (_remoteApi) {
        tasks.push(_remoteApi.set(item));
    }

    const result = await Promise.all(tasks);

    return _sort(result[0]);
};

const itemsAreEqual = (a: Jot[], b: Jot[]) => {
    return (
        a
            .map((j) => j.guid)
            .sort()
            .join(",") ===
        b
            .map((j) => j.guid)
            .sort()
            .join(",")
    );
};

export default {
    save,
    edit,
    getall,
    initializeApi,
    itemsAreEqual,
    renameTopic,
};
