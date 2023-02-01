import { Modal, Stack, TextInput, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { setBrowserName } from "../lib/browserStateSaver";
import { BrowserState } from "../lib/types";

export const RenameDialog = (props: {
  instance: BrowserState;
  openedRenameDialog: boolean;
  setOpenedRenameDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleCloseButtonClick = () => {
    props.setOpenedRenameDialog(false);
  };

  const form = useForm({
    initialValues: {
      name: props.instance.name,
    },

    validate: {
      name: (val) =>
        val.length < 8
          ? "Browser name should include at least 8 characters"
          : null,
    },
  });

  const handleRename = async () => {
    await setBrowserName(props.instance.id, form.values.name);
    props.setOpenedRenameDialog(false);
  };

  return (
    <Modal
      opened={props.openedRenameDialog}
      onClose={() => props.setOpenedRenameDialog(false)}
      title="Rename browser"
    >
      <form
        onSubmit={form.onSubmit(() => {
          handleRename();
        })}
      >
        <Stack>
          <TextInput
            data-autofocus
            required
            label="Browser name"
            placeholder=""
            {...form.getInputProps("name")}
          />
          <Group position="right" spacing="xl">
            <Button color="red" type="submit">
              Rename
            </Button>
            <Button onClick={handleCloseButtonClick}>Close</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
