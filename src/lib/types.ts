import type browser from "webextension-polyfill";

export interface EncryptedData {
  iv_base64: string;
  salt_base64: string;
  ciphertext_base64: string;
}

export interface BrowserState {
  id: string;
  windows: browser.Windows.Window[] | undefined;
  platformInfo: browser.Runtime.PlatformInfo;
  updatedAt: Date;
  createdAt: Date;
  encrypted: boolean;
  decryptionSuccessful: boolean;
  encryptedData: EncryptedData | undefined;
  name: string;
}
