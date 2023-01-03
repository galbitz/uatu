import { ActionIcon, Table, Text } from "@mantine/core";
import type browser from "webextension-polyfill";
import { focusTab, getBrowserId } from "../lib/browser";
import { IconClipboardCopy, IconExternalLink } from "@tabler/icons";
import copy from "copy-to-clipboard";

export const BrowserWindow = ({
  browserId,
  browserWindow,
}: {
  browserId: any;
  browserWindow: browser.Windows.Window;
}) => {
  const handleSelectTab = async (
    browserId: string,
    windowId?: number,
    tabId?: number
  ) => {
    if (browserId !== (await getBrowserId())) {
      return;
    }
    focusTab(windowId, tabId);
  };

  return (
    <div>
      <div>Window id: {browserWindow.id}</div>
      <Table striped style={{ width: "960px", tableLayout: "fixed" }}>
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
