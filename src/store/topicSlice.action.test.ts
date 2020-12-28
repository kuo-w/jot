import { categorizeTopics } from "@store/topicSlice";
import { Jot } from "types";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { AppDispatch, RootState } from ".";
import appInitialState from "./__mocks__/storeInitialState";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

const j1: Jot = {
    guid: "1",
    createdAt: "",
    text: "",
};

const j2: Jot = {
    guid: "2",
    createdAt: "",
    text: "",
};

const dispatchAndReturnNames = (items: Jot[]) => {
    const store = mockStore(appInitialState());
    const result = store.dispatch(categorizeTopics(items));
    return result.payload.map((t) => t.name);
};

const dispatchAndReturnPayload = (items: Jot[]) => {
    const store = mockStore(appInitialState());
    const result = store.dispatch(categorizeTopics(items));
    return result.payload;
};

test("categorize jots", () => {
    expect(
        dispatchAndReturnNames([{ ...j1, topics: ["test"] }, { ...j2 }])
    ).toEqual(["test"]);

    expect(
        dispatchAndReturnNames([
            { ...j1, topics: ["test"] },
            { ...j2, topics: ["test"] },
        ])
    ).toEqual(["test"]);

    expect(
        dispatchAndReturnNames([
            { ...j1, topics: ["test"] },
            { ...j2, topics: ["test2"] },
        ])
    ).toEqual(["test", "test2"]);

    expect(
        dispatchAndReturnNames([
            { ...j1, topics: ["test"] },
            { ...j2, topics: ["test", "test2"] },
        ])
    ).toEqual(["test", "test2"]);

    expect(
        dispatchAndReturnPayload([
            { ...j1, topics: ["test"] },
            { ...j2, topics: ["test", "test2"] },
        ])
    ).toEqual([
        { name: "test", count: 2 },
        { name: "test2", count: 1 },
    ]);

    expect(dispatchAndReturnNames([{ ...j1 }, { ...j2 }])).toEqual([]);
});
