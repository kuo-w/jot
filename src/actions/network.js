export const SET_CONNECTED = "SET_CONNECTED";

export const setConnected = isConnected => {
  return {
    type: SET_CONNECTED,
    isConnected
  };
};
