import { mocked } from "ts-jest/utils";
import { Jot } from "types";
import dayjs from "dayjs";

import jotApi from "./jotApi";
import storageApi from "./storageApi";

import mockRemoteApi, { mockedSet } from "./__mocks__/remoteApi";

jest.mock("./firebaseApi");
jest.mock("./storageApi");
jest.mock("@react-native-community/async-storage");

const item1 = {
  guid: "123",
  text: "test",
  createdAt: dayjs().add(1, "day").toJSON(),
};

const item2 = {
  guid: "456",
  text: "test",
  createdAt: new Date().toJSON(),
};
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

  test("with same data for remote and local", async () => {
    await _assertGetAll([item1], true, [item1], [item1]);
  });

  test("with local ahead of remote", async () => {
    await _assertGetAll([item1, item2], true, [item1, item2], [item2]);
  });

  test("with remote ahead of local", async () => {
    await _assertGetAll([item1, item2], true, [], [item1, item2]);
  });

  test("with no local data", async () => {
    await _assertGetAll([item1], true, undefined, [item1]);
  });

  test("with no remote data", async () => {
    await _assertGetAll([item1], false, [item1], undefined);
  });

  test("sorts result desc", async () => {
    await _assertGetAll([item1, item2], true, [], [item2, item1]);
  });

  test("removes duplicates", async () => {
    await _assertGetAll([item1, item2], true, [item1, item1], [item2, item2]);
  });
});

describe("set", () => {
  test("saves", async () => {
    jotApi.initializeApi(mockRemoteApi());
    const mockedStorageApi = mocked(storageApi.pushItem).mockResolvedValue([
      item1,
    ]);

    await jotApi.save("sometext");
    expect(mockedStorageApi.mock.calls).toHaveLength(1);
    expect(mockedSet.mock.calls).toHaveLength(1);
  });
});
