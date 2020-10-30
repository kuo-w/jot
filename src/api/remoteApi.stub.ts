import { Jot, RemoteApi } from "types";
import jotApi from "./jotApi";

let data: Jot[] | null = null;

const getall = async () => {
  console.log("APP::REMOTEGET RETURN RESULT");
  if (data == null) {
    console.log("REMOTE API STUB::GETTING LOCAL DATA");
    const result = await jotApi.getall(false);
    console.log("REMOTE API STUB::STUBBING WITH LOCAL DATA");
    console.log(result.items);
    data = result.items;
  }
  return data;
};

const set = async () => {
  console.log("APP::REMOTESET");
};

const api: RemoteApi = {
  getall,
  set,
};

export default { api };
