import { v4 as uuidv4 } from "uuid";
import type Browser from "webextension-polyfill";

//TODO: find better pattern
const lazyInit = (fn: any) => {
  let prom: any = undefined;
  return () => (prom = prom || fn());
};

const getBrowser = lazyInit(async () => {
  return await import("webextension-polyfill");
});

export const getBrowserId = lazyInit(async () => {
  const browser: Browser.Browser = await getBrowser();

  const storedbrowserId = (await browser.storage.local.get("browserId"))
    .browserId;
  if (storedbrowserId) {
    return storedbrowserId;
  }

  const newBrowserId = uuidv4();
  await browser.storage.local.set({ browserId: newBrowserId });

  return newBrowserId;
});

export const focusTab = async (windowId?: number, tabId?: number) => {
  if (!tabId || !windowId) {
    return;
  }
  const browser: Browser.Browser = await getBrowser();

  await browser.windows.update(windowId, {
    focused: true,
  });
  await browser.tabs.update(tabId, { active: true });
};

export const TAB_MANAGER_COMMAND: string = "open-manager";

export const getOpenShortcut = async () => {
  const browser: Browser.Browser = await getBrowser();
  const commands = await browser.commands.getAll();
  const openCommand = commands.find(
    (command) => command.name === TAB_MANAGER_COMMAND
  );
  if (openCommand) {
    return openCommand.shortcut;
  }

  return;
};

export const openManager = async () => {
  const browser: Browser.Browser = await getBrowser();
  const tab = (
    await browser.tabs.query({
      url: browser.runtime.getURL("index.html"),
    })
  )[0];
  if (tab && tab.windowId && tab.id) {
    focusTab(tab.windowId, tab.id);
  } else {
    await browser.tabs.create({
      url: browser.runtime.getURL("index.html"),
    });
  }
};
