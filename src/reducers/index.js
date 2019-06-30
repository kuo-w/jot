import { combineReducers } from "redux";

import auth from "./auth.js";
import jots from "./jots.js";
import network from "./network.js";

export default combineReducers({ auth, jots, network });
