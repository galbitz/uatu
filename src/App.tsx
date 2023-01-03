import { BrowserInstance } from "./components/BrowserInstance";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Stack, MantineProvider, Text } from "@mantine/core";
import { db } from "./lib/firebase";
import { collection } from "firebase/firestore";
import { useUserState } from "./lib/useUserState";
import { useCollection } from "react-firebase-hooks/firestore";

function App() {
  const { userLoading, loggedIn, authUser } = useUserState();

  const browserQuery = useMemo(
    () => (authUser ? collection(db, `users/${authUser.uid}/browsers`) : null),
    [authUser]
  );

  const [browsersState, setBrowsersState] = useState<any[]>([]);
  const [browserSnapshots, loading, error] = useCollection(browserQuery, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  //TODO: FirestoreDataConverter
  useEffect(() => {
    if (browserSnapshots) {
      setBrowsersState(
        browserSnapshots.docs.map((doc) => {
          return { id: doc.id, windows: doc.data().windows };
        })
      );
    }
  }, [browserSnapshots]);

  if (userLoading) return <Text>Authenticating...</Text>;
  if (!loggedIn) return <Text>Please log in first.</Text>;
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{error.message}</Text>;

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Stack style={{ width: "960px" }}>
        {browsersState.map((browserInstance) => (
          <BrowserInstance
            key={browserInstance.id}
            instance={browserInstance}
          ></BrowserInstance>
        ))}
      </Stack>
    </MantineProvider>
  );
}

export default App;
