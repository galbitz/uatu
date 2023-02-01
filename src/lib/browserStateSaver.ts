import { auth, db } from "../lib/firebase";
import type { BrowserState } from "../lib/types";
import { getPassword } from "../lib/passwordStorage";
import { encrypt } from "../lib/crypto";
import BrowserFunctions from "../lib/browser";
import {
  deleteDoc,
  doc,
  PartialWithFieldValue,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { generateName } from "./nameGenerator";
import { FirebaseError } from "firebase/app";

export const saveBrowserState = async () => {
  if (!(auth.currentUser && auth.currentUser.emailVerified)) return;

  const currentBrowser = await BrowserFunctions.getBrowserId();
  const browserWindows = await BrowserFunctions.getWindows();
  const platformInfo = await BrowserFunctions.getPlatformInfo();
  await saveData(auth.currentUser.uid, currentBrowser, {
    windows: browserWindows,
    platformInfo: platformInfo,
  });
};

const encryptWindowData = async (
  browserStateToEncrypt: PartialWithFieldValue<BrowserState>
) => {
  const pass = await getPassword();
  if (pass && browserStateToEncrypt.windows) {
    const windowDataAsString = JSON.stringify(browserStateToEncrypt.windows);
    browserStateToEncrypt["encryptedData"] = await encrypt(
      pass,
      windowDataAsString
    );
    browserStateToEncrypt.windows = [];
  }
};

const saveData = async (
  userId: string,
  browserId: string,
  data: Partial<BrowserState>
) => {
  const documentPath = `users/${userId}/browsers/${browserId}`;
  const docRef = doc(db, documentPath);

  const browserStateToSave: PartialWithFieldValue<BrowserState> = {
    ...data,
    updatedAt: serverTimestamp(), // We always want to update the timestamp
  };

  await encryptWindowData(browserStateToSave);

  //To minimize roundtrips, we try updating first if does not exist we create it
  updateDoc(docRef, browserStateToSave).catch((error) => {
    if (error instanceof FirebaseError && error.code === "not-found") {
      // Initialize some values
      browserStateToSave.name = browserStateToSave.name || generateName();
      browserStateToSave.createdAt = serverTimestamp();
      setDoc(docRef, browserStateToSave, {
        merge: true,
      });
    } else {
      throw error;
    }
  });
};

export const saveOnAuthChange = () => {
  auth.onAuthStateChanged(async () => {
    await saveBrowserState();
  });
};

export const deleteBrowserState = async (browserId: string) => {
  if (!auth.currentUser) return;
  const documentPath = `users/${auth.currentUser.uid}/browsers/${browserId}`;
  const docRef = doc(db, documentPath);
  await deleteDoc(docRef);
};

export const setBrowserName = async (browserId: string, newName: string) => {
  if (!(auth.currentUser && auth.currentUser.emailVerified)) return;
  await saveData(auth.currentUser.uid, browserId, { name: newName });
};
