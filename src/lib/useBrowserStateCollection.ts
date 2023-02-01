import { collection } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { getPassword } from "./passwordStorage";
import { decrypt } from "./crypto";
import { browserStateConverter, db } from "./firebase";
import { BrowserState } from "./types";
import { useUserState } from "./useUserState";
import BrowserFunctions from "./browser";

export const useBrowserStateCollection = () => {
  const { authUser } = useUserState();
  const browserQuery = useMemo(
    () =>
      authUser
        ? collection(db, `users/${authUser.uid}/browsers`).withConverter(
            browserStateConverter
          )
        : null,
    [authUser]
  );

  const [browserSnapshots, loading, error] = useCollection<BrowserState>(
    browserQuery,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const compareBrowserStates = (
    state1: BrowserState,
    state2: BrowserState,
    currentBrowserId: string
  ) => {
    if (state1.id === currentBrowserId) {
      return -1;
    }
    if (state2.id === currentBrowserId) {
      return 1;
    }
    if (state1.name > state2.name) {
      return 1;
    }
    if (state1.name < state2.name) {
      return -1;
    }
    return 0;
  };

  const [dercyptedBrowserState, setDecryptedBrowserState] =
    useState<Array<BrowserState>>();

  useEffect(() => {
    const decryptBrowserState = async (
      browserState: BrowserState
    ): Promise<BrowserState> => {
      const pass = await getPassword();
      const returnBrowserState = JSON.parse(JSON.stringify(browserState));
      if (returnBrowserState.encrypted && returnBrowserState.encryptedData) {
        try {
          const decryptedData = await decrypt(
            pass,
            returnBrowserState.encryptedData
          );
          returnBrowserState.windows = JSON.parse(decryptedData);
          returnBrowserState.decryptionSuccessful = true;
        } catch (error) {
          console.log("Encryption error", returnBrowserState);
        }
      }
      return returnBrowserState;
    };

    const decryptSnapshots = async () => {
      if (!browserSnapshots) {
        return;
      }
      const currentBrowserId = await BrowserFunctions.getBrowserId();
      setDecryptedBrowserState(
        (
          await Promise.all(
            browserSnapshots?.docs.map(
              async (_) => await decryptBrowserState(_.data())
            )
          )
        ).sort((state1, state2) =>
          compareBrowserStates(state1, state2, currentBrowserId)
        )
      );
    };

    decryptSnapshots();
  }, [browserSnapshots, authUser]);

  return { browserSnapshots: dercyptedBrowserState, loading, error };
};
