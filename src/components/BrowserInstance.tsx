import { Container, Paper, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import type browser from "webextension-polyfill";
import BrowserFunctions from "../lib/browser";
import { BrowserWindow } from "./BrowserWindow";
import { BrowserState } from "../lib/types";
import { RenameDialog } from "./RenameDialog";
import { DeleteDialog } from "./DeleteDialog";
import { BrowserHeader } from "./BrowserHeader";

export const BrowserInstance = ({ instance }: { instance: BrowserState }) => {
  const [currentBrowserId, setCurretBrowserId] = useState("");
  useEffect(() => {
    BrowserFunctions.getBrowserId().then((bId: string) => {
      setCurretBrowserId(bId);
    });
  }, []);

  const [openedDeleteDialog, setOpenedDeleteDialog] = useState(false);
  const [openedRenameDialog, setOpenedRenameDialog] = useState(false);

  const showEncryptionError = (state: BrowserState): boolean => {
    return instance.encrypted && !instance.decryptionSuccessful;
  };

  return (
    <Container style={{ width: "100%" }}>
      <Paper shadow="sm" withBorder>
        <BrowserHeader
          currentBrowser={currentBrowserId === instance.id}
          instance={instance}
          setOpenedDeleteDialog={setOpenedDeleteDialog}
          setOpenedRenameDialog={setOpenedRenameDialog}
        />
        {showEncryptionError(instance) && (
          <Text style={{ paddingLeft: 10 }} color={"red"}>
            Decryption was unsuccessfull. Please make sure you use the same
            passkey across devices.
          </Text>
        )}
        {!showEncryptionError(instance) && (
          <>
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
          </>
        )}
      </Paper>
      <DeleteDialog
        instance={instance}
        openedDeleteDialog={openedDeleteDialog}
        setOpenedDeleteDialog={setOpenedDeleteDialog}
      />
      <RenameDialog
        instance={instance}
        openedRenameDialog={openedRenameDialog}
        setOpenedRenameDialog={setOpenedRenameDialog}
      ></RenameDialog>
    </Container>
  );
};
