import * as Google from "expo-google-app-auth";
import { LogInResult } from "expo-google-app-auth/src/Google";
import { GOOGLE_CONFIG } from "../../config.js";

export interface LoginResult {
  idToken: string;
  accessToken: string;
  user: Google.GoogleUser;
}

export const signin = async (): Promise<LoginResult | null> => {
  try {
    const loginResult: LogInResult = await Google.logInAsync(GOOGLE_CONFIG);
    if (loginResult.type === "success") {
      if (!(loginResult.idToken && loginResult.accessToken)) {
        return null;
      }

      return {
        idToken: loginResult.idToken,
        accessToken: loginResult.accessToken,
        user: loginResult.user,
      };
    }

    return null;
  } catch (error) {
    console.error(`Google sign-in failed: ${error}`);
    throw new Error(error);
  }
};

export const logout = async (accessToken: string): Promise<void> => {
  try {
    await Google.logOutAsync({ accessToken, ...GOOGLE_CONFIG });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
