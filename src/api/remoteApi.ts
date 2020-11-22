import { RemoteApi } from "types";
import jotApi from "./jotApi";
import authApi from "./authApi";
import remoteApiStub from "./remoteApi.stub";

let _api: RemoteApi = remoteApiStub;

export const setRemoteApi = (api: RemoteApi) => {
  _api = api;
  jotApi.initializeApi(_api);
  authApi.initializeAuthApi(_api);
};

export default _api;
