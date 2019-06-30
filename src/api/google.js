import { Google } from "expo";
import { GOOGLE_CONFIG } from "../../config.js";

export const signin = async () => {
  try {
    const { type, accessToken, idToken, user } = await Google.logInAsync(
      GOOGLE_CONFIG
    );
    if (type === "success") {
      return { idToken, accessToken, user };
    }
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async accessToken => {
  try {
    await Google.logOutAsync({ accessToken, ...GOOGLE_CONFIG });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
