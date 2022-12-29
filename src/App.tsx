import { useEffect, useMemo, useState } from "react";
import "./App.css";
import browser from "webextension-polyfill";
import { Stack, Table, MantineProvider, Container, Text } from "@mantine/core";
import { db } from "./lib/firebase";
import { collection } from "firebase/firestore";
import { getBrowserId } from "./lib/browser";
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

  const handleSelectTab = async (
    browserId: string,
    windowId?: number,
    tabId?: number
  ) => {
    if (browserId !== (await getBrowserId())) {
      return;
    }
    if (!tabId || !windowId) {
      return;
    }

    await browser.windows.update(windowId, {
      focused: true,
    });
    await browser.tabs.update(tabId, { active: true });
  };

  if (userLoading) return <Text>Authenticating...</Text>;
  if (!loggedIn) return <Text>Please log in first.</Text>;
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{error.message}</Text>;

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Stack align="center">
        <Container></Container>
        <Container>
          {browsersState.map((browserInfo) => (
            <>
              <div>Browser id:{browserInfo.id}</div>
              {browserInfo.windows.map((window: browser.Windows.Window) => (
                <>
                  <div>
                    Window id: {window.id}
                    <Table striped withBorder>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Url</th>
                        </tr>
                      </thead>
                      {window.tabs?.map((tab) => (
                        <tr
                          onClick={() =>
                            handleSelectTab(browserInfo.id, window.id, tab.id)
                          }
                        >
                          <td>{tab.id}</td>
                          <td>{tab.title}</td>
                          <td>{tab.url}</td>
                        </tr>
                      ))}
                    </Table>
                  </div>
                </>
              ))}
            </>
          ))}
        </Container>
      </Stack>
    </MantineProvider>
  );
}

export default App;
