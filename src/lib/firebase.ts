import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  DocumentData,
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
} from "firebase/firestore";
import type { BrowserState } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyBkvSpDQ7oLbjTQXRDmngzk8KJN_2wHkZM",
  authDomain: "tab4-5a611.firebaseapp.com",
  projectId: "tab4-5a611",
  storageBucket: "tab4-5a611.appspot.com",
  messagingSenderId: "750779374697",
  appId: "1:750779374697:web:651a17f1620c98cabad6f8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const browserStateConverter = {
  toFirestore(browserState: WithFieldValue<BrowserState>): DocumentData {
    return {
      windows: browserState.windows,
      platformInfo: browserState.platformInfo,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): BrowserState {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      windows: data.windows,
      platformInfo: data.platformInfo,
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? (data.updatedAt as Timestamp).toDate()
          : new Date(),
    };
  },
};
