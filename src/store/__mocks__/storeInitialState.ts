import { authInitialState, AuthState } from "@store/authSlice";
import { jotsInitialState, JotsState } from "@store/jotSlice";
import { networkInitialState, NetworkState } from "@store/networkSlice";
import { topicInitialState, TopicState } from "@store/topicSlice";
import { RootState } from "..";

const _appInitialState: RootState = {
  jots: jotsInitialState,
  network: networkInitialState,
  auth: authInitialState,
  topics: topicInitialState,
};

export type PartialRootState = {
  jots?: Partial<JotsState>;
  network?: Partial<NetworkState>;
  auth?: Partial<AuthState>;
  topics?: Partial<TopicState>;
};

export const appInitialState = (state?: PartialRootState): RootState => {
  state = state ?? {};

  return Object.assign({}, _appInitialState, {
    jots: { ..._appInitialState.jots, ...state.jots },
    network: { ..._appInitialState.network, ...state.network },
    auth: { ..._appInitialState.auth, ...state.auth },
    topics: { ..._appInitialState.topics, ...state.topics },
  });
};

export default appInitialState;
