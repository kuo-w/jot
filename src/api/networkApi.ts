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
    console.log("NETWORK API::ADDING LISTENER");
    _listeners.push(callback);

    console.log("NETWORK API::CURRENT STATE ON ADD");
    console.log(_currentState);

    callback(_currentState);
};

export const getNetState = (): NetInfoState => {
    return _currentState;
};

const _executeCallbacks: NetInfoChangeHandler = async (
    state: NetInfoState
): Promise<void> => {
    console.log(
        `NETWORK API::STATE CHANGE > INTERNET REACHABLE? ${state.isInternetReachable}`
    );
    console.log(`NETWORK API::LISTENERS# > ${_listeners.length}`);

    _currentState = state;

    await Promise.all(_listeners.map((callback) => callback(state)));
};

export const unsubscribe = NetInfo.addEventListener(_executeCallbacks);

const networkApi = {
    addListener,
};
export default networkApi;
