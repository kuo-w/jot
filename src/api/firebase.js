import firebase from "firebase";
import "@firebase/firestore";

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
    window = undefined; // network error otherwise > https://github.com/firebase/firebase-js-sdk/issues/1824
    await firebase
      .firestore()
      .collection("/users")
      .doc(firebase.auth().currentUser.uid)
      .set(user);
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.warn(error);
  }
};

export { auth, setUser, logout };
