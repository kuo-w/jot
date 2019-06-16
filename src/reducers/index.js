import { combineReducers } from "redux";

import login from "./login.js";
import jots from "./jots.js";

export default combineReducers({ login, jots });
