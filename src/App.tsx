import { BrowserInstance } from "./components/BrowserInstance";
import "./App.css";
import {
  Stack,
  MantineProvider,
  Text,
  Space,
  AppShell,
  Card,
  Container,
  List,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { useUserState } from "./lib/useUserState";
import { ViewFooter } from "./components/ViewFooter";
import { ViewHeader } from "./components/ViewHeader";
import { useLocalStorage } from "@mantine/hooks";
import { useBrowserStateCollection } from "./lib/useBrowserStateCollection";

function App() {
  const { userLoading, loggedIn } = useUserState();

  const { browserSnapshots, loading, error } = useBrowserStateCollection();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  if (userLoading) return <Text>Authenticating...</Text>;
  if (!loggedIn) return <Text>Please log in first.</Text>;
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{error.message}</Text>;

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShell header={<ViewHeader />} footer={<ViewFooter />}>
          <Container>
            <Card withBorder>
              <List>
                <List.Item>View all open browser windows and tabs</List.Item>
                <List.Item>Open url in new tab</List.Item>
                <List.Item>Copy url to clipboard</List.Item>
              </List>
            </Card>
          </Container>
          <Space h={"md"} />
          <Stack>
            {browserSnapshots &&
              browserSnapshots.map((state) => (
                <BrowserInstance
                  key={state.id}
                  instance={state}
                ></BrowserInstance>
              ))}
          </Stack>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
