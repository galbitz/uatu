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
