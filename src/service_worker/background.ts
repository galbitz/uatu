import * as Sentry from "@sentry/browser";
import BrowserFunctions, {
  TAB_MANAGER_COMMAND,
  GET_LAST_TRIGGER,
} from "../lib/browser";
import browser from "webextension-polyfill";
import { sentryConfig } from "../lib/sentry";
import { saveBrowserState, saveOnAuthChange } from "../lib/browserStateSaver";

export {};

let lastTriggered: Date = new Date();

try {
  console.log("Uatu: initializing...");

  Sentry.init(sentryConfig);

  browser.runtime.onStartup.addListener(async () => {
    await saveState();
  });

  browser.tabs.onRemoved.addListener(
    async (tabId: number, removeInfo: object) => {
      console.log("Uatu: onRemoved triggered");
      saveState();
      return true;
    }
  );

  browser.tabs.onUpdated.addListener(
    async (tabId: number, changeInfo, tab: browser.Tabs.Tab) => {
      if (
        changeInfo.status === "complete" ||
        (!changeInfo.status && (!changeInfo.title || !changeInfo.url))
      ) {
        console.log("Uatu: onUpdated triggered - complete");
        saveState();
      }
      return true;
    }
  );

  // Command is also needed as an external entry point for the shortcut
  browser.commands.onCommand.addListener(async (command) => {
    if (command !== TAB_MANAGER_COMMAND) {
      return;
    }
    BrowserFunctions.openManager();
    return true;
  });

  browser.runtime.onMessage.addListener(
    async (message, sender, sendResponse: any) => {
      if (message.request === GET_LAST_TRIGGER) {
        sendResponse({ response: lastTriggered.toLocaleString() });
      }
      return { response: lastTriggered.toLocaleString() };
    }
  );

  saveOnAuthChange();
  console.log("Uatu: initialization complete.");
} catch (e) {
  console.log("Startup error", e);
}

async function saveState() {
  try {
    lastTriggered = new Date();
    await saveBrowserState();
  } catch (e) {
    console.log(e);
    Sentry.captureException(e);
  }
}
