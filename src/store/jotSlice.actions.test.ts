import { mocked } from "ts-jest/utils";
import jotApi from "../api/jotApi";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { AppDispatch, RootState } from ".";
import appInitialState, {
    PartialRootState,
} from "./__mocks__/storeInitialState";
import { getall, renameTopic } from "./jotSlice";
import { njot } from "@api/__mocks__/mockData";
import { Jot } from "types";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

jest.mock("../api/jotApi");
jest.mock("../api/storageApi");

const mockedJotApi = mocked(jotApi, true);

afterEach(() => {
    jest.clearAllMocks();
});

describe("getall", () => {
    const assertDidRemoteFetch = async (
        expectedDidRemoteFetch: boolean,
        state: PartialRootState
    ) => {
        const store = mockStore(appInitialState(state));
        mocked(mockedJotApi.getall).mockResolvedValue({
            items: [],
            remoteFetch: false,
        });

        await store.dispatch(getall());
        expect(jotApi.getall).lastCalledWith(expectedDidRemoteFetch);
    };

    test("do remote fetch", async () => {
        await assertDidRemoteFetch(true, {
            network: { isInternetReachable: true },
            auth: { signedIn: true },
        });

        await assertDidRemoteFetch(true, {
            network: { isInternetReachable: true },
            auth: { signedIn: true },
        });
    });

    test("won't remote fetch", async () => {
        await assertDidRemoteFetch(false, {
            network: { isInternetReachable: false },
            auth: { signedIn: true },
        });

        await assertDidRemoteFetch(false, {
            network: { isInternetReachable: true },
            auth: { signedIn: false },
        });
    });
});

describe("renametopic", () => {
    const initTestState = (items: Jot[]) => {
        const store = mockStore(
            appInitialState({
                jots: {
                    jots: items,
                },
            })
        );
        return store;
    };

    const initItems = (...topicsItems: [string[]]) =>
        topicsItems.map((ti) => njot({ topics: ti }));

    test("does rename", async () => {
        const items = initItems(["1"]);
        const expected = [{ ...items[0], topics: ["2"] }];

        const store = initTestState(items);
        mocked(mockedJotApi.renameTopic).mockResolvedValue(expected);
        const result = await store.dispatch(
            renameTopic({ oldTopic: "1", newTopic: "2" })
        );

        expect(result.payload).toEqual(expected);
    });
});
