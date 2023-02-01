import {
  Button,
  Card,
  Container,
  List,
  Text,
  Space,
  Stack,
  Group,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import BrowserFunctions from "../lib/browser";
import { getPassword, setPassword } from "../lib/passwordStorage";
import { showNotification } from "@mantine/notifications";
import { saveBrowserState } from "../lib/browserStateSaver";

export const Config = () => {
  const [openShortCutText, setOpenShortCutText] = useState<String>("");
  useEffect(() => {
    const updateShortcut = async () => {
      const openShortCut = await BrowserFunctions.getOpenShortcut();
      setOpenShortCutText(openShortCut ? `[${openShortCut}]` : "");
    };

    updateShortcut();
  }, []);

  const handleOpenManager = async () => {
    BrowserFunctions.openManager();
  };

  const form = useForm({
    initialValues: {
      passkey: "",
    },

    validate: {
      passkey: (val) =>
        val.length < 8 ? "Passkey should include at least 8 characters" : null,
    },
  });

  useEffect(() => {
    const setPassKeyInitialValue = async () => {
      const passkey = await getPassword();
      form.setValues({ passkey: passkey });
    };
    setPassKeyInitialValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    await setPassword(form.values.passkey);
    await saveBrowserState();
    showNotification({
      title: "Set passkey",
      message: "Saving passkey was successful",
      autoClose: 4000,
    });
  };

  return (
    <Container>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Text>
          Welcome to Uatu tab manager. Click [Open Uatu Tab View] to view your
          open windows and tabs across browsers.
        </Text>
        <Button fullWidth mt="md" radius="md" onClick={handleOpenManager}>
          Open Uatu Tab View {openShortCutText}
        </Button>
      </Card>
      <Space h={"lg"}></Space>
      <Title order={5}>Settings</Title>
      <Space h={"md"}></Space>
      <Card>
        <Text>You may set a passkey to encrypt data sent to the server. </Text>
        <List>
          <List.Item>The passkey will be stored in your browser.</List.Item>
          <List.Item>
            Forgotten passkey cannot be recovered. Keep it in a safe place e.g.:
            a password manager.
          </List.Item>
          <List.Item>
            Use the same passkey across your devices to decrypt browsing state
            everywhere.
          </List.Item>
        </List>
        <Space h={"md"}></Space>
        <form
          onSubmit={form.onSubmit(() => {
            handleSubmit();
          })}
        >
          <Stack>
            <TextInput
              required
              label="Passkey"
              placeholder="securepasskey"
              {...form.getInputProps("passkey")}
            />
            <Group position="right" mt="xl">
              <Button type="submit">Set passkey</Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};
