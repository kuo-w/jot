import { mocked } from "ts-jest/utils";
import { Jot } from "types";
import dayjs from "dayjs";

import jotApi from "./jotApi";
import firebaseApi from "./firebaseApi";
import storageApi from "./storageApi";

jest.mock("./firebaseApi");
jest.mock("./storageApi");

const mockApiGetReturns = (local: Jot[], remote: Jot[]) => {
  mocked(storageApi.get).mockResolvedValue(local);
  mocked(firebaseApi.getJots).mockResolvedValue(remote);
};

describe("getting all", () => {
  test("with same data for remote and local", () => {
    const returnValues: Jot[] = [
      { guid: "123", text: "test", createdAt: new Date() },
    ];
    mockApiGetReturns(returnValues, returnValues);
    expect(jotApi.getall()).toEqual(returnValues);
  });
});

beforeAll(() => {
  mocked(firebaseApi.getJots).mockClear;
});
