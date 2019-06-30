import firebase from "firebase";
import "@firebase/firestore";

const _uid = () => {
  try {
    return firebase.auth().currentUser.uid;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const _firestore = (() => {
  let instance;
  const getInstance = () => {
    if (!instance) {
      window = undefined; // network error otherwise > https://github.com/firebase/firebase-js-sdk/issues/1824
      instance = firebase.firestore();
    }
    return instance;
  };
  return getInstance;
})();

const _date = date => {
  return firebase.firestore.Timestamp.fromDate(date);
};

const auth = async (idToken, accessToken) => {
  try {
    const credential = firebase.auth.GoogleAuthProvider.credential(
      idToken,
      accessToken
    );
    const result = await firebase.auth().signInWithCredential(credential);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const setUser = async user => {
  try {
    await _firestore()
      .collection("/users")
      .doc(_uid())
      .set(user);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getJots = async () => {
  try {
    const querySnapshot = await _firestore()
      .collection("/jots")
      .where("userid", "==", _uid())
      .get();
    const mappedData = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          createdAt: new Date(data.createdAt.seconds * 1000),
          text: data.text
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    return mappedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const setJot = async newJot => {
  try {
    let jot = Object.assign({}, newJot);
    jot.createdAt = _date(jot.createdAt);
    jot.userid = _uid();
    await _firestore()
      .collection("/jots")
      .add(jot);
    return jot;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const logout = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.warn(error);
    throw error;
  }
};

export { auth, setUser, logout, setJot, getJots };
