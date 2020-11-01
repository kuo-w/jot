import { authInitialState, AuthState } from "@store/authSlice";
import { jotsInitialState, JotsState } from "@store/jotsSlice";
import { networkInitialState, NetworkState } from "@store/networkSlice";
import { RootState } from "..";

const _appInitialState: RootState = {
  jots: jotsInitialState,
  network: networkInitialState,
  auth: authInitialState,
};

export type PartialRootState = {
  jots?: Partial<JotsState>;
  network?: Partial<NetworkState>;
  auth?: Partial<AuthState>;
};

export const appInitialState = (state?: PartialRootState): RootState => {
  state = state ?? {};

  return Object.assign({}, _appInitialState, {
    jots: { ..._appInitialState.jots, ...state.jots },
    network: { ..._appInitialState.network, ...state.network },
    auth: { ..._appInitialState.auth, ...state.auth },
  });
};

export default appInitialState;
