import firebase from "firebase";
import "@firebase/firestore";

const _uid = () => {
  try {
    return firebase.auth().currentUser.uid;
  } catch (error) {
    console.error(error);
  }
};

const _firestore = (() => {
  let instance;
  const getInstance = () => {
    if (!instance) {
      // TODO: follow up on network error caused by https://github.com/firebase/firebase-js-sdk/issues/1824
      window = undefined;
      instance = firebase.firestore();
    }
    return instance;
  };
  return getInstance;
})();

const _timestamp = date => {
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
          createdAt: new Date(
            new Date(data.createdAt.seconds * 1000).setSeconds(0, 0)
          ),
          text: data.text
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    return mappedData;
  } catch (error) {
    console.error(error);
  }
};

const setJot = async newJot => {
  try {
    let jot = Object.assign({}, newJot);
    jot.createdAt = _timestamp(jot.createdAt);
    jot.userid = _uid();
    await _firestore()
      .collection("/jots")
      .add(jot);
    return jot;
  } catch (error) {
    console.error(error);
    // TODO: handle error
    // Add queue to retry at a later time
    // Or rethrow error to show message to user
  }
};

const addManyJots = async newItems => {
  try {
    let items = [...newItems];
    items.forEach(i => {
      i.createdAt = _timestamp(i.createdAt);
      i.userid = _uid();
    });
  } catch (error) {
    console.error(error);
  }
};

const logout = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error(error);
  }
};

export { auth, setUser, logout, setJot, getJots };
