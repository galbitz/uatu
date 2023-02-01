//export const pass: string = "password";

import BrowserFunctions from "./browser";

export const getPassword = async (): Promise<string> => {
  return await BrowserFunctions.getFromStorage("passkey");
};

export const setPassword = async (password: string) => {
  await BrowserFunctions.saveToStorage("passkey", password);
};
