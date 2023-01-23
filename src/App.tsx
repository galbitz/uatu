import { BrowserInstance } from "./components/BrowserInstance";
import { useMemo } from "react";
import "./App.css";
import { Stack, MantineProvider, Text } from "@mantine/core";
import { db, browserStateConverter } from "./lib/firebase";
import { collection } from "firebase/firestore";
import { useUserState } from "./lib/useUserState";
import { useCollection } from "react-firebase-hooks/firestore";
import type { BrowserState } from "./lib/types";

function App() {
  const { userLoading, loggedIn, authUser } = useUserState();

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

  if (userLoading) return <Text>Authenticating...</Text>;
  if (!loggedIn) return <Text>Please log in first.</Text>;
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{error.message}</Text>;

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Stack>
        {browserSnapshots &&
          browserSnapshots.docs.map((state) => (
            <BrowserInstance
              key={state.id}
              instance={state.data()}
            ></BrowserInstance>
          ))}
      </Stack>
    </MantineProvider>
  );
}

export default App;
