import { v4 as uuidv4 } from "uuid";
import type Browser from "webextension-polyfill";

interface IBrowserFunctions {
  getBrowserId(): Promise<string>;
  focusTab(windowId?: number, tabId?: number): Promise<void>;
  getOpenShortcut(): Promise<string>;
  openManager(): Promise<void>;
  saveToStorage(key: string, value: string): Promise<void>;
  getFromStorage(key: string): Promise<string>;
  getWindows(): Promise<Browser.Windows.Window[]>;
  getPlatformInfo(): Promise<Browser.Runtime.PlatformInfo>;
}

const evaulateOnce = <T>(fn: () => T) => {
  let promise: T | undefined = undefined;
  return () => (promise = promise || fn());
};

const getBrowser = evaulateOnce(async () => {
  return await import("webextension-polyfill");
});

class DevBrowser implements IBrowserFunctions {
  async getPlatformInfo(): Promise<Browser.Runtime.PlatformInfo> {
    return Promise.resolve({
      os: "cros",
      arch: "noarch",
    });
  }
  async getBrowserId(): Promise<string> {
    return Promise.resolve("0327379b-92f5-4846-95ed-e8978b991e2a");
  }
  async focusTab(
    windowId?: number | undefined,
    tabId?: number | undefined
  ): Promise<void> {
    console.log("Focus called");
  }
  async getOpenShortcut(): Promise<string> {
    return Promise.resolve("");
  }
  async openManager(): Promise<void> {
    console.log("Open Manager called");
  }
  async saveToStorage(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }
  async getFromStorage(key: string): Promise<string> {
    return Promise.resolve(localStorage.getItem(key) || "");
  }
  async getWindows(): Promise<Browser.Windows.Window[]> {
    return Promise.resolve([]);
  }
}

class ProdBrowser implements IBrowserFunctions {
  async getPlatformInfo(): Promise<Browser.Runtime.PlatformInfo> {
    return (await getBrowser()).runtime.getPlatformInfo();
  }
  async getBrowserId(): Promise<string> {
    const browser: Browser.Browser = await getBrowser();
    const storedbrowserId = (await browser.storage.local.get("browserId"))
      .browserId;
    if (storedbrowserId) {
      return storedbrowserId;
    }

    const newBrowserId = uuidv4();
    await browser.storage.local.set({ browserId: newBrowserId });

    return newBrowserId;
  }
  async focusTab(
    windowId?: number | undefined,
    tabId?: number | undefined
  ): Promise<void> {
    if (!tabId || !windowId) {
      return;
    }
    const browser: Browser.Browser = await getBrowser();

    await browser.windows.update(windowId, {
      focused: true,
    });
    await browser.tabs.update(tabId, { active: true });
  }
  async getOpenShortcut(): Promise<string> {
    const browser: Browser.Browser = await getBrowser();
    const commands = await browser.commands.getAll();
    const openCommand = commands.find(
      (command) => command.name === TAB_MANAGER_COMMAND
    );
    if (openCommand) {
      return openCommand.shortcut || "";
    }

    return "";
  }
  async openManager(): Promise<void> {
    const browser: Browser.Browser = await getBrowser();
    const tab = (
      await browser.tabs.query({
        url: browser.runtime.getURL("index.html"),
      })
    )[0];

    //TODO: fix weird bug where Safary tab query returns item even if it's not the extension index.html
    if (tab && tab.windowId && tab.id && tab.url !== "") {
      this.focusTab(tab.windowId, tab.id);
    } else {
      await browser.tabs.create({
        url: browser.runtime.getURL("index.html"),
      });
    }
  }
  async saveToStorage(key: string, value: string): Promise<void> {
    const browser: Browser.Browser = await getBrowser();
    let dataToSave: any = {};
    dataToSave[key] = value;
    await browser.storage.local.set(dataToSave);
  }
  async getFromStorage(key: string): Promise<string> {
    const browser: Browser.Browser = await getBrowser();
    return (await browser.storage.local.get(key))[key];
  }
  async getWindows(): Promise<Browser.Windows.Window[]> {
    return await (await getBrowser()).windows.getAll({ populate: true });
  }
}

export const TAB_MANAGER_COMMAND: string = "open-manager";

const BrowserFunctions: IBrowserFunctions =
  process.env.NODE_ENV === "development" ? new DevBrowser() : new ProdBrowser();
export default BrowserFunctions;
