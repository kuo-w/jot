import NetInfo, {
    NetInfoChangeHandler,
    NetInfoState,
    NetInfoStateType,
} from "@react-native-community/netinfo";

const _listeners = new Array<(netinfostate: NetInfoState) => void>();
let _currentState: NetInfoState = {
    type: NetInfoStateType.unknown,
    isConnected: false,
    isInternetReachable: false,
    details: null,
};

export const addListener = (callback: (nstate: NetInfoState) => void): void => {
    _listeners.push(callback);
    callback(_currentState);
};

export const getNetState = (): NetInfoState => {
    return _currentState;
};

const _executeCallbacks: NetInfoChangeHandler = async (
    state: NetInfoState
): Promise<void> => {
    _currentState = state;

    await Promise.all(_listeners.map((callback) => callback(state)));
};

export const unsubscribe = NetInfo.addEventListener(_executeCallbacks);

const networkApi = {
    addListener,
};
export default networkApi;
