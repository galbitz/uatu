import type browser from "webextension-polyfill";

export interface BrowserState {
  id: string;
  windows: browser.Windows.Window[] | undefined;
  platformInfo: browser.Runtime.PlatformInfo;
  updatedAt: Date;
}
