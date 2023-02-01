import {
  ColorScheme,
  ColorSchemeProvider,
  Container,
  MantineProvider,
  Space,
  Text,
} from "@mantine/core";
import { Config } from "./Config";
import { Login } from "./Login";
import { useUserState } from "../lib/useUserState";
import { VerifyEmail } from "./VerifyEmail";
import { PopupFooter } from "./PopupFooter";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";

function Popup() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const { userLoading, loggedIn, userVerified } = useUserState();

  if (userLoading) return <Text>Loading</Text>;

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
        <NotificationsProvider>
          <Space h={"md"}></Space>
          <Container>
            <Text align="center" weight={"500"} size={"xl"}>
              Uatu tab manager
            </Text>
          </Container>
          <Space h={"md"}></Space>
          {!loggedIn && <Login></Login>}
          {loggedIn && !userVerified && <VerifyEmail></VerifyEmail>}
          {userVerified && <Config></Config>}
          <PopupFooter />
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default Popup;
