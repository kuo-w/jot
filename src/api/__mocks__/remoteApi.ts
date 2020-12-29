import { Jot, RemoteApi } from "types";

export const mockedGetIds = jest.fn();
export const mockedSetIds = jest.fn();
export const mockedGetAll = jest.fn();
export const mockedSet = jest.fn();
export const mockedSetUser = jest.fn();
export const mockedUpdate = jest.fn();

const mockRemoteApi = (
    mockGetAll?: Jot[] | undefined,
    mockIds?: string[]
): RemoteApi => {
    const ids = mockIds ? mockIds : mockGetAll?.map((m) => m.guid);
    return {
        getIds: mockedGetIds.mockResolvedValue({
            ids: ids ? [...new Set(ids)] : [],
        }),
        setIds: mockedSetIds.mockResolvedValue({}),
        getAll: mockedGetAll.mockResolvedValue(mockGetAll),
        set: mockedSet.mockResolvedValue({}),
        setUser: mockedSetUser.mockResolvedValue({}),
        update: mockedUpdate.mockResolvedValue({}),
    };
};

export default mockRemoteApi;
