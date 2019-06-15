import { Google } from "expo";
import { GOOGLE_CONFIG } from "../../config.js";

export const signin = async () => {
  try {
    const { type, accessToken, idToken, user } = await Google.logInAsync(
      GOOGLE_CONFIG
    );
    if (type === "success") {
      return { accessToken, idToken, user };
    }
    throw `Google sign in failed with type ${type}`;
  } catch (error) {
    console.error(error);
  }
};
