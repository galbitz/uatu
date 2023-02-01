import { ActionIcon, Divider, Group, Table, Text } from "@mantine/core";
import type browser from "webextension-polyfill";
import BrowserFunctions from "../lib/browser";
import { IconClipboardCopy, IconExternalLink } from "@tabler/icons-react";
import copy from "copy-to-clipboard";

export const BrowserWindow = ({
  browserId,
  browserWindow,
}: {
  browserId: string;
  browserWindow: browser.Windows.Window;
}) => {
  const handleSelectTab = async (
    browserId: string,
    windowId?: number,
    tabId?: number
  ) => {
    if (browserId !== (await BrowserFunctions.getBrowserId())) {
      return;
    }
    BrowserFunctions.focusTab(windowId, tabId);
  };

  return (
    <div>
      <Divider my="sm" variant="dashed" />
      <Group style={{ paddingLeft: 10, paddingBottom: 10 }}>
        <Text fz="lg" fw={500}>
          Window id: {browserWindow.id}
        </Text>
      </Group>
      <Table striped style={{ tableLayout: "fixed" }} withBorder>
        <thead>
          <tr>
            <th>Title</th>
            <th style={{ width: "70px" }}>Link</th>
          </tr>
        </thead>
        <tbody>
          {browserWindow.tabs?.map((tab) => (
            <tr key={tab.id}>
              <td
                onClick={() => handleSelectTab(browserId, tab.windowId, tab.id)}
              >
                <Text
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.title}
                </Text>
              </td>
              <td>
                <div style={{ display: "flex" }}>
                  <ActionIcon component="a" href={tab.url} target="_blank">
                    <IconExternalLink size={18} />
                  </ActionIcon>
                  <ActionIcon
                    component="a"
                    onClick={() => {
                      copy(tab.url || "");
                    }}
                  >
                    <IconClipboardCopy size={18} />
                  </ActionIcon>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
