import { Group, Button, Text, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { formatDate } from "../lib/date";
import { BrowserState } from "../lib/types";
import { IconLock, IconLockOff } from "@tabler/icons";

export const BrowserHeader = (props: {
  currentBrowser: boolean;
  instance: BrowserState;
  setOpenedDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedRenameDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Group position={"apart"} style={{ paddingTop: 10, paddingLeft: 10 }}>
        <Text
          fz="xl"
          fw={700}
          c={props.currentBrowser ? "blue" : undefined}
          onClick={() => props.setOpenedRenameDialog(true)}
        >
          {props.instance.name}
        </Text>
        <Button
          onClick={() => props.setOpenedDeleteDialog(true)}
          variant={"subtle"}
          size="xs"
          styles={{ root: { paddingLeft: 5, paddingRight: 5 } }}
        >
          <IconTrash color={"red"} />
        </Button>
      </Group>
      <Group style={{ paddingLeft: 10 }}>
        <Text size="xs" color="dimmed">
          OS: {props.instance?.platformInfo?.os}
        </Text>
        <Text size="xs" color="dimmed">
          Arch: {props.instance?.platformInfo?.arch}
        </Text>
        <Text size="xs" color="dimmed">
          Last updated: {formatDate(props.instance.updatedAt)}
        </Text>
        {props.instance.encrypted && (
          <ActionIcon title="Encrypted">
            <IconLock color="orange" size={15} />
          </ActionIcon>
        )}
        {!props.instance.encrypted && (
          <ActionIcon title="Not encrypted">
            <IconLockOff color="orange" size={15} />
          </ActionIcon>
        )}
      </Group>
    </>
  );
};
