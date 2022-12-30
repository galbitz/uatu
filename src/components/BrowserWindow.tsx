import { ActionIcon } from "@mantine/core";
import browser from "webextension-polyfill";
import { focusTab, getBrowserId } from "../lib/browser";
import { IconExternalLink } from "@tabler/icons";
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
    <div style={{ maxWidth: "960px" }}>
      <div style={{ display: "flex" }} className="header">
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          Window id: {browserWindow.id}
        </span>
      </div>
      <div
        style={{ display: "block", padding: "0", maxWidth: "100%" }}
        className="tabs"
      >
        {browserWindow.tabs?.map((tab) => (
          <div
            style={{ display: "flex", maxWidth: "100%" }}
            className="tab"
            data-id={tab.id}
          >
            <div
              style={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              onClick={() => handleSelectTab(browserId, tab.windowId, tab.id)}
            >
              <span>{tab.title}</span>
            </div>
            <div
              style={{
                width: "25px",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <ActionIcon component="a" href={tab.url} target="_blank">
                <IconExternalLink size={18} />
              </ActionIcon>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
