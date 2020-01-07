import { AsyncStorage } from "react-native";

const JOTS = "JOTS";

const setJot = async jot => {
  try {
    let jots = await getJots();
    jots.push(jot);
    await AsyncStorage.setItem(JOTS, JSON.stringify(jots));
  } catch (error) {
    console.error(error);
  }
};

const getJots = async () => {
  try {
    let jots = await AsyncStorage.getItem(JOTS);
    if (jots !== null) {
      jots = JSON.parse(jots);
      jots.forEach(jot => {
        jot.createdAt = new Date(new Date(jot.createdAt).setSeconds(0, 0));
      });
      jots.sort((a, b) => b.createdAt - a.createdAt);
      return jots;
    }
    return [];
  } catch (error) {
    console.error(error);
  }
};

const removeJots = async () => {
  await AsyncStorage.removeItem(JOTS);
};

const rewriteJots = async items => {
  try {
    await AsyncStorage.setItem(JOTS, JSON.stringify(items));
  } catch (error) {
    console.error(error);
  }
};

export { setJot, getJots, removeJots, rewriteJots };
