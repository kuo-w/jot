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

const _setDifference = (a: string[], b: string[]) => {
    const A = new Set(a);
    const B = new Set(b);
    return [...new Set([...A].filter((i) => !B.has(i)))];
};

const _getItemsOnlyLocal = (local: Jot[], remote: Jot[]): Jot[] => {
    const remote_ = remote.map((i) => i.guid);
    const local_ = local.map((i) => i.guid);
    const localOnly = _setDifference(local_, remote_);

    return [...local].filter((i) => localOnly.includes(i.guid));
};

const _syncWithConnected = async (
    shouldFetchRemote: boolean
): Promise<JotGetAll> => {
    if (!shouldFetchRemote || !_remoteApi) {
        const items = (await storage.get<Jot[]>(StorageKey.JOTS)) ?? [];
        return {
            items: items,
            remoteFetch: false,
        };
    }

    const tracker = await _remoteApi.getIds();
    const remoteIds = tracker.ids;

    let local = await storage.get<Jot[]>(StorageKey.JOTS);
    if (local == undefined) {
        local = [];
    }

    const totalLength = [
        ...new Set([...local.map((l) => l.guid), ...remoteIds]),
    ].length;
    if (totalLength === local.length && totalLength == remoteIds.length) {
        return { items: local, remoteFetch: false };
    }

    const remote = await _remoteApi.getAll();
    if (remote == undefined) {
        return { items: local, remoteFetch: false };
    }

    const combined = _getUniqueByGuid(remote.concat(local));

    const itemsToUpload = _getItemsOnlyLocal(local, remote);

    for (const j of itemsToUpload) {
        _remoteApi.set(j);
    }

    _remoteApi.setIds(combined);
    await storage.write<Jot[]>(StorageKey.JOTS, combined);

    return { items: combined, remoteFetch: true };
};

const _sort = (items: Jot[]) => {
    return items.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

const getAll = async (
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

    const updated = _sort(result[0]);

    _remoteApi?.setIds(updated);

    return updated;
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
    getAll,
    initializeApi,
    itemsAreEqual,
    renameTopic,
};
