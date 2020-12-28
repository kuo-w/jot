import { mocked } from "ts-jest/utils";
import { Jot } from "types";

import jotApi from "./jotApi";
import storageApi from "./storageApi";
import { jot1, jot2, jot3 } from "./__mocks__/mockData";

import mockRemoteApi, { mockedSet } from "./__mocks__/remoteApi";

jest.mock("./firebaseApi");
jest.mock("./storageApi");
jest.mock("@react-native-community/async-storage");

afterEach(() => {
    jest.clearAllMocks();
});

describe("getting all", () => {
    const mockApiGetReturns = (
        local: Jot[] | undefined,
        remote: Jot[] | undefined
    ) => {
        mocked(storageApi.get).mockResolvedValue(local);
        jotApi.initializeApi(mockRemoteApi(remote));
    };

    const _assertGetAll = async (
        expected: Jot[],
        expectedRemoteSuccess: boolean,
        local: Jot[] | undefined,
        remote: Jot[] | undefined
    ) => {
        mockApiGetReturns(local, remote);
        const result = await jotApi.getall(true);
        expect(result).toEqual({
            items: expected,
            remoteFetch: expectedRemoteSuccess,
        });
    };

    const _assertSets = (items: Jot[]) => {
        items.forEach((i) => {
            expect(mockedSet).toBeCalledWith(i);
        });
    };

    const _assertNotSets = (items: Jot[]) => {
        items.forEach((i) => {
            expect(mockedSet).not.toBeCalledWith(i);
        });
    };

    test("with same data for remote and local", async () => {
        await _assertGetAll([jot1], true, [jot1], [jot1]);
        _assertNotSets([jot1]);
    });

    test("with local ahead of remote", async () => {
        await _assertGetAll([jot1, jot2], true, [jot1, jot2], [jot2]);
        _assertSets([jot1]);
        _assertNotSets([jot2]);
    });

    test("with remote ahead of local", async () => {
        await _assertGetAll([jot1, jot2], true, [], [jot1, jot2]);
        _assertNotSets([jot1, jot2]);
    });

    test("with no local data", async () => {
        await _assertGetAll([jot1], true, undefined, [jot1]);
        _assertNotSets([jot1]);
    });

    test("with no remote data", async () => {
        await _assertGetAll([jot1], false, [jot1], undefined);
        _assertNotSets([jot1]);
    });

    test("sorts result desc", async () => {
        await _assertGetAll([jot1, jot2], true, [], [jot2, jot1]);
        _assertNotSets([jot1, jot2]);
    });

    test("removes duplicates", async () => {
        await _assertGetAll([jot1, jot2], true, [jot1, jot1], [jot2, jot2]);
        _assertSets([jot1]);
        _assertNotSets([jot2]);
    });

    test("additional upload conditions", async () => {
        await _assertGetAll([jot1, jot2, jot3], true, [jot1], [jot3, jot2]);
        _assertSets([jot1]);
        _assertNotSets([jot3, jot2]);

        await _assertGetAll([jot1, jot2, jot3], true, [jot1, jot3, jot2], []);
        _assertSets([jot1, jot3, jot2]);
        _assertNotSets([]);
    });
});

describe("set", () => {
    test("saves", async () => {
        jotApi.initializeApi(mockRemoteApi());
        const mockedStorageApi = mocked(storageApi.pushItem).mockResolvedValue([
            jot1,
        ]);

        await jotApi.save("sometext");
        expect(mockedStorageApi.mock.calls).toHaveLength(1);
        expect(mockedSet.mock.calls).toHaveLength(1);
    });
});
