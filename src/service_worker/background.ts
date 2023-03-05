import * as Sentry from "@sentry/browser";
import BrowserFunctions, { TAB_MANAGER_COMMAND } from "../lib/browser";
import browser from "webextension-polyfill";
import { sentryConfig } from "../lib/sentry";
import { saveBrowserState, saveOnAuthChange } from "../lib/browserStateSaver";

export {};

try {
  Sentry.init(sentryConfig);

  // browser.runtime.onInstalled.addListener((details) => {
  //   saveState()
  // });

  browser.runtime.onStartup.addListener(async () => {
    await saveState();
  });

  browser.tabs.onRemoved.addListener(
    async (tabId: number, removeInfo: object) => {
      saveState();
    }
  );

  browser.tabs.onUpdated.addListener(
    async (tabId: number, changeInfo, tab: browser.Tabs.Tab) => {
      if (
        changeInfo.status === "complete" ||
        (!changeInfo.status && (!changeInfo.title || !changeInfo.url))
      ) {
        saveState();
      }
    }
  );

  // Command is also needed as an external entry point for the shortcut
  browser.commands.onCommand.addListener(async (command) => {
    if (command !== TAB_MANAGER_COMMAND) {
      return;
    }

    BrowserFunctions.openManager();
  });

  saveOnAuthChange();
} catch (e) {
  console.log("Startup error", e);
}

async function saveState() {
  try {
    await saveBrowserState();
  } catch (e) {
    Sentry.captureException(e);
  }
}
