import NetInfo from "@react-native-community/netinfo";
import store from "../store.js";
import { setConnected } from "../actions/network.js";
import { jotGetAll } from "../actions/jots.js";

export default () => {
  // TODO handle network change to try reconnect previous existing auth

  const setConnectivity = connectionInfo => {
    switch (connectionInfo.type) {
      case "none":
        store.dispatch(setConnected(false));
        break;
      case "wifi":
        // TODO prompt use data on wifi
        store.dispatch(setConnected(true));
        break;
      case "cellular":
        store.dispatch(setConnected(true));
        break;
    }
  };

  NetInfo.getConnectionInfo().then(connectionInfo => {
    setConnectivity(connectionInfo);
  });

  function handleConnectivityChange(connectionInfo) {
    setConnectivity(connectionInfo);
  }
  NetInfo.addEventListener("connectionChange", handleConnectivityChange);
};
