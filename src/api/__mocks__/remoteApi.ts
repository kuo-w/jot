import { Jot, RemoteApi } from "types";

export const mockedGetall = jest.fn();
export const mockedSet = jest.fn();

const mockRemoteApi = (mockGetall?: Jot[] | undefined): RemoteApi => {
  return {
    getall: mockedGetall.mockResolvedValue(mockGetall),
    set: mockedSet.mockResolvedValue({}),
  };
};

export default mockRemoteApi;
