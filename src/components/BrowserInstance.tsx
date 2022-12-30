import { Container, Text } from "@mantine/core";
import browser from "webextension-polyfill";
import { BrowserWindow } from "./BrowserWindow";
export const BrowserInstance = ({ instance }: { instance: any }) => {
  return (
    <Container>
      <Text>Browser id:{instance.id}</Text>
      {instance.windows.map((browserWindow: browser.Windows.Window) => {
        return (
          <BrowserWindow
            browserId={instance.id}
            browserWindow={browserWindow}
          ></BrowserWindow>
        );
      })}
    </Container>
  );
};
