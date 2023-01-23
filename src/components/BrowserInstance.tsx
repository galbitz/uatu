import { Container, Paper, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import type browser from "webextension-polyfill";
import { getBrowserId } from "../lib/browser";
import { BrowserWindow } from "./BrowserWindow";
import { BrowserState } from "../lib/types";
import { formatDate } from "../lib/date";

export const BrowserInstance = ({ instance }: { instance: BrowserState }) => {
  const [currentBrowserId, setCurretBrowserId] = useState("");

  useEffect(() => {
    getBrowserId().then((bId: string) => {
      setCurretBrowserId(bId);
    });
  }, []);

  return (
    <Container>
      <Paper shadow="sm" withBorder>
        <Text
          fz="xl"
          fw={700}
          c={currentBrowserId === instance.id ? "blue" : undefined}
        >
          Browser id: {instance.id}{" "}
          {instance?.platformInfo?.os ? `[${instance.platformInfo.os}]` : ""}
          {instance?.updatedAt
            ? `[Last updated: ${formatDate(instance.updatedAt)}]`
            : ""}
        </Text>
        {instance.windows &&
          instance.windows.map((browserWindow: browser.Windows.Window) => {
            return (
              <BrowserWindow
                key={browserWindow.id}
                browserId={instance.id}
                browserWindow={browserWindow}
              ></BrowserWindow>
            );
          })}
      </Paper>
    </Container>
  );
};
