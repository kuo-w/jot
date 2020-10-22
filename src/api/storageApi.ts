import { AsyncStorage } from "react-native";

export enum StorageKey {
  JOTS = "JOTS",
}

const get = async <T>(key: StorageKey): Promise<T | null> => {
  let json = null;

  try {
    json = await AsyncStorage.getItem(key);
  } catch (error) {
    console.log(`AsyncStorage error:\nKey: ${key}\nError:${error}`);
    throw new Error(error);
  }
  if (json == null) {
    return null;
  }

  const data: T = JSON.parse(json);
  return data;
};

const clear = async (key: StorageKey): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    throw new Error(error);
  }
};

const pushItem = async <T>(key: StorageKey, item: T): Promise<T[]> => {
  let items: T[] | null;
  try {
    items = await get<T[]>(key);
    items?.push(item);
    await write<T[]>(key, <T[]>items);
    return <T[]>items;
  } catch (error) {
    throw new Error(error);
  }
};

const write = async <T>(key: StorageKey, item: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export default { pushItem, get, clear, write };
