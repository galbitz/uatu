import { auth, db } from "../lib/firebase";
import { getBrowserId } from "../lib/browser";
import browser from "webextension-polyfill";
import { doc, setDoc } from "firebase/firestore";

export {};

try {
  browser.runtime.onInstalled.addListener((details) => {
    console.log("[background.js] onInstalled", details);
    saveTabs();
  });

  browser.runtime.onStartup.addListener(() => {
    console.log("[background.js] onStartup");
    saveTabs();
  });

  browser.action.onClicked.addListener(async function () {
    console.log("[background.js] onclicked");
    await browser.tabs.create({
      url: browser.runtime.getURL("index.html"),
    });
  });

  browser.tabs.onRemoved.addListener(
    async (tabId: number, removeInfo: object) => {
      console.log("removed", tabId, removeInfo);
      saveTabs();
    }
  );

  browser.tabs.onUpdated.addListener(
    async (
      tabId: number,
      changeInfo: { status?: string },
      tab: browser.Tabs.Tab
    ) => {
      if (changeInfo.status === "complete") {
        console.log("Tab loaded: ", tab.url);
        saveTabs();
      }
    }
  );

  const saveTabs = async () => {
    console.log("[background.js] savetabs");

    const browserInfo = await browser.windows.getAll({ populate: true });

    if (!auth.currentUser || !browserInfo) {
      return;
    }

    await browser.storage.local.set({ browser: browserInfo });

    //TODO: move this to firebase lib
    const userId = auth.currentUser.uid;
    const browserId = await getBrowserId();
    const documentPath = `users/${userId}/browsers/${browserId}`;
    const docRef = doc(db, documentPath);
    try {
      await setDoc(docRef, { windows: browserInfo });
    } catch (exception) {
      console.log("[background.js] savetab ", exception);
    }
  };
} catch (exception) {
  console.log("[background.js] ", exception);
}
