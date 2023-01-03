import { Container, Text } from "@mantine/core";
import type browser from "webextension-polyfill";
import { BrowserWindow } from "./BrowserWindow";
export const BrowserInstance = ({ instance }: { instance: any }) => {
  return (
    <Container>
      <Text>Browser id:{instance.id}</Text>
      {instance.windows.map((browserWindow: browser.Windows.Window) => {
        return (
          <BrowserWindow
            key={browserWindow.id}
            browserId={instance.id}
            browserWindow={browserWindow}
          ></BrowserWindow>
        );
      })}
    </Container>
  );
};
