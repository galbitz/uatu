import * as Sentry from "@sentry/browser";
import { auth, db } from "../lib/firebase";
import { getBrowserId, openManager, TAB_MANAGER_COMMAND } from "../lib/browser";
import browser from "webextension-polyfill";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { sentryConfig } from "../lib/sentry";
import type { BrowserState } from "../lib/types";

export {};

Sentry.init(sentryConfig);

browser.runtime.onInstalled.addListener((details) => {
  console.log("[background.js] onInstalled", details);
  saveTabs();
  saveBrowserInfo();
});

browser.runtime.onStartup.addListener(() => {
  console.log("[background.js] onStartup");
  saveTabs();
  saveBrowserInfo();
});

browser.tabs.onRemoved.addListener(
  async (tabId: number, removeInfo: object) => {
    console.log("removed", tabId, removeInfo);
    saveTabs();
  }
);

browser.tabs.onUpdated.addListener(
  async (tabId: number, changeInfo, tab: browser.Tabs.Tab) => {
    if (
      changeInfo.status === "complete" ||
      (!changeInfo.status && (!changeInfo.title || !changeInfo.url))
    ) {
      console.log("Tab loaded: ", tab.url);
      saveTabs();
    }
  }
);

const saveData = async (
  userId: string,
  browserId: string,
  data: Partial<BrowserState>
) => {
  //TODO: move this to firebase lib
  const documentPath = `users/${userId}/browsers/${browserId}`;
  const docRef = doc(db, documentPath);
  try {
    await setDoc(
      docRef,
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (exception) {
    console.log("[background.js] saveData ", exception);
  }
};

const saveTabs = async () => {
  console.log("[background.js] savetabs");

  const browserInfo = await browser.windows.getAll({ populate: true });

  if (!auth.currentUser || !auth.currentUser.emailVerified || !browserInfo)
    return;

  //await browser.storage.local.set({ browser: browserInfo });
  const currentBrowser = await getBrowserId();

  await saveData(auth.currentUser.uid, currentBrowser, {
    windows: browserInfo,
  });
};

const saveBrowserInfo = async () => {
  if (!auth.currentUser || !auth.currentUser.emailVerified) return;

  const currentBrowser = await getBrowserId();
  const platformInfo = await browser.runtime.getPlatformInfo();

  saveData(auth.currentUser.uid, currentBrowser, {
    platformInfo: platformInfo,
  });
};

auth.onAuthStateChanged(async (user) => {
  if (user) {
    await saveTabs();
    await saveBrowserInfo();
  }
});

browser.commands.onCommand.addListener(async (command) => {
  console.log(`Command: ${command}`);
  if (command !== TAB_MANAGER_COMMAND) {
    return;
  }

  openManager();
});
