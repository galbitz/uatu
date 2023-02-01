import { Modal, Space, Group, Button, Text } from "@mantine/core";
import { deleteBrowserState } from "../lib/browserStateSaver";
import { BrowserState } from "../lib/types";

export const DeleteDialog = (props: {
  instance: BrowserState;
  openedDeleteDialog: boolean;
  setOpenedDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleDeleteConfirmedButtonClick = async (browserId: string) => {
    await deleteBrowserState(browserId);
  };

  const handleCloseDialog = async () => {
    props.setOpenedDeleteDialog(false);
  };

  return (
    <Modal
      opened={props.openedDeleteDialog}
      onClose={() => props.setOpenedDeleteDialog(false)}
      title="Confirm deletion"
    >
      <Text>
        Are you sure you want to delete browser state: {props.instance.name}
      </Text>
      <Space h="md" />
      <Group position="right" spacing="xl">
        <Button
          color="red"
          onClick={() => handleDeleteConfirmedButtonClick(props.instance.id)}
        >
          Yes
        </Button>
        <Button onClick={handleCloseDialog}>No</Button>
      </Group>
    </Modal>
  );
};
