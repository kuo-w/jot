import NetInfo, {
  NetInfoChangeHandler,
  NetInfoState,
} from "@react-native-community/netinfo";

const _listeners = new Array<(netinfostate: NetInfoState) => void>();

export const addListener = (callback: (nstate: NetInfoState) => void): void => {
  _listeners.push(callback);
};

export const getNetState = async (): Promise<NetInfoState> => {
  return await NetInfo.fetch();
};

const _executeCallbacks: NetInfoChangeHandler = (state: NetInfoState): void => {
  Promise.all(_listeners.map((callback) => callback(state)));
};

export const unsubscribe = NetInfo.addEventListener(_executeCallbacks);
