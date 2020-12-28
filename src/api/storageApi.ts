import AsyncStorage from "@react-native-community/async-storage";

export enum StorageKey {
    JOTS = "JOTS",
    TEST = "TEST",
    REMOTEFETCHTIME = "REMOTEFETCHTIME",
}

const _deserialize = (jsonStr: string) => JSON.parse(jsonStr);

const get = async <T>(key: StorageKey): Promise<T | undefined> => {
    let json = null;

    try {
        json = await AsyncStorage.getItem(key);
    } catch (error) {
        console.log(`AsyncStorage error:\nKey: ${key}\nError:${error}`);
        throw new Error(error);
    }
    if (json == null) {
        // No data found.
        return undefined;
    }

    const data: T = _deserialize(json);
    return data;
};

const clear = async (key: StorageKey): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

const pushItem = async <T>(key: StorageKey, item: T): Promise<T[]> => {
    let items: T[] | undefined;
    try {
        items = await get<T[]>(key);
        if (items == undefined) {
            items = [];
        }
        console.log("STORAGE API::PUSH ITEM");
        console.log(item);

        console.log("STORAGE API::ORIGINAL LIST");
        console.log(items);

        items.push(item);

        console.log("STORAGE API::UPDATED LIST");
        console.log(items);

        await write<T[]>(key, <T[]>items);

        return <T[]>items;
    } catch (error) {
        throw new Error(error);
    }
};

const write = async <T>(key: StorageKey, item: T): Promise<void> => {
    try {
        console.log(`STORAGE API::WRITE ITEM ON KEY ${key}`);
        console.log(item);

        await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.error(`Failed to write: \nError: ${error}\nItem:${item}`);
        throw new Error(error);
    }
};

export default { pushItem, get, clear, write };
