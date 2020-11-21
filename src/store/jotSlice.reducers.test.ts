import reducer, { getall } from "./jotSlice";
import { jot1, jot2 } from "@api/__mocks__/mockData";
import appInitialState from "./__mocks__/storeInitialState";
import { Jot } from "types";

const fulfilled = (items: Jot[] | undefined, fetch = false) => {
  if (!items) {
    return getall.fulfilled(undefined, "", undefined);
  }

  return getall.fulfilled(
    {
      items: items,
      remoteFetch: fetch,
    },
    "",
    undefined
  );
};

describe("fulfilled", () => {
  test("skips state assignment", async () => {
    const items = [jot1, jot2];
    const expectedState = appInitialState({ jots: { jots: items } }).jots;
    const payloadItemsInOrder = reducer(expectedState, fulfilled([jot1, jot2]));
    const payloadItemsNotInOrder = reducer(
      expectedState,
      fulfilled([jot2, jot1])
    );
    const payloadUndefined = reducer(expectedState, fulfilled(undefined));

    expect(payloadItemsInOrder === expectedState).toBeTruthy();
    expect(payloadItemsNotInOrder === expectedState).toBeTruthy();
    expect(payloadUndefined === expectedState).toBeTruthy();
  });

  test("updates state jots", () => {
    const state = appInitialState({ jots: { jots: [jot1] } }).jots;
    const resultState = reducer(state, fulfilled([jot1, jot2]));

    expect(resultState.jots).toEqual([jot1, jot2]);
  });

  test("updates remoteFetchTime", () => {
    const date = new Date().toJSON();
    const resultStateDidFetch = reducer(
      appInitialState().jots,
      fulfilled([jot1, jot2], true)
    );

    const resultStateDidNotFetch = reducer(
      appInitialState().jots,
      fulfilled([jot1, jot2])
    );

    expect(resultStateDidFetch.remoteFetchTime).toEqual(date);
    expect(resultStateDidNotFetch.remoteFetchTime).toEqual(undefined);
  });
});
