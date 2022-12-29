import { v4 as uuidv4 } from "uuid";
import browser from "webextension-polyfill";
//TODO: find better pattern
const lazyInit = (fn: any) => {
  let prom: any = undefined;
  return () => (prom = prom || fn());
};

export const getBrowserId = lazyInit(async () => {
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

  await browser.windows.update(windowId, {
    focused: true,
  });
  await browser.tabs.update(tabId, { active: true });
};

export const TAB_MANAGER_COMMAND: string = "open-manager";

export const getOpenShortcut = async () => {
  const commands = await browser.commands.getAll();
  const openCommand = commands.find(
    (command) => command.name === TAB_MANAGER_COMMAND
  );
  if (openCommand) {
    return openCommand.shortcut;
  }

  return;
};
