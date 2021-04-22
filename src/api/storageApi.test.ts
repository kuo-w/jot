import storageApi, { StorageKey } from "./storageApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = StorageKey.TEST;

type TestData = {
    text: string;
    num: number;
    date: string;
};

type WithExtra = TestData & {
    num: number;
    bool: boolean;
    items: TestData[];
};

const testData = { text: "t", num: 456, date: new Date().toJSON() };

const testDataWithExtra: WithExtra[] = [
    {
        text: "t",
        date: new Date().toJSON(),
        num: 123,
        bool: true,
        items: [testData],
    },
];

beforeEach(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
});

afterAll(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("get", () => {
    test("data exists", async () => {
        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(testDataWithExtra)
        );

        const actual = await storageApi.get<WithExtra[]>(STORAGE_KEY);

        expect(actual).toEqual(testDataWithExtra);
    });

    test("data is undefined on no value set", async () => {
        const actual = await storageApi.get<WithExtra[]>(STORAGE_KEY);

        expect(actual == undefined);
    });
});

describe("push item", () => {
    const item = {
        text: "t",
        num: 123,
        date: new Date().toJSON(),
    };

    test("key has data", async () => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));

        await storageApi.pushItem<TestData>(STORAGE_KEY, item);

        const actual = await storageApi.get<TestData[]>(STORAGE_KEY);
        expect(actual).toEqual([item]);
    });

    test("key has no data", async () => {
        await storageApi.pushItem<TestData>(STORAGE_KEY, item);

        const actual = await storageApi.get<TestData[]>(STORAGE_KEY);
        expect(actual).toEqual([item]);
    });
});

test("write", async () => {
    await storageApi.write<TestData>(STORAGE_KEY, testData);

    const actual = await storageApi.get<TestData>(STORAGE_KEY);
    expect(actual).toEqual(testData);
});

test("clear", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(testData));

    await storageApi.clear(STORAGE_KEY);

    expect(await AsyncStorage.getItem(STORAGE_KEY)).toBeNull();
});
