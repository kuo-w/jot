import { Jot, RemoteApi } from "types";

export const mockedGetAll = jest.fn();
export const mockedSet = jest.fn();
export const mockedSetUser = jest.fn();
export const mockedUpdate = jest.fn();

const mockRemoteApi = (mockGetall?: Jot[] | undefined): RemoteApi => {
    return {
        getAll: mockedGetAll.mockResolvedValue(mockGetall),
        set: mockedSet.mockResolvedValue({}),
        setUser: mockedSetUser.mockResolvedValue({}),
        update: mockedUpdate.mockResolvedValue({}),
    };
};

export default mockRemoteApi;
