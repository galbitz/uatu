import { Button, Card, Container, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { getOpenShortcut, openManager } from "../lib/browser";

export const Config = () => {
  const [openShortCutText, setOpenShortCutText] = useState<String>("");
  useEffect(() => {
    const updateShortcut = async () => {
      const openShortCut = await getOpenShortcut();
      setOpenShortCutText(openShortCut ? `[${openShortCut}]` : "");
    };

    updateShortcut();
  }, []);

  const handleOpenManager = async () => {
    openManager();
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
    </Container>
  );
};
