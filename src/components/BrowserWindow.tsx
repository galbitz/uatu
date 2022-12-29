import { Table, Text } from "@mantine/core";
import browser from "webextension-polyfill";
import { focusTab, getBrowserId } from "../lib/browser";
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

  console.log("broserId:", browserId);

  return (
    <div>
      <Text>Window id: {browserWindow.id}</Text>
      <Table striped withBorder>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Url</th>
          </tr>
        </thead>
        {browserWindow.tabs?.map((tab) => (
          <tr
            onClick={() => handleSelectTab(browserId, browserWindow.id, tab.id)}
          >
            <td>{tab.id}</td>
            <td>{tab.title}</td>
            <td>{tab.url}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
