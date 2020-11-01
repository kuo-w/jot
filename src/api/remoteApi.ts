import { RemoteApi } from "types";
import jotApi from "./jotApi";
import remoteApiStub from "./remoteApi.stub";

let _api: RemoteApi = remoteApiStub;

export const setRemoteApi = (api: RemoteApi) => {
  _api = api;
  jotApi.initializeApi(_api);
};

export default _api;
