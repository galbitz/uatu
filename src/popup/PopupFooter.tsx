import { Box, Button, Container, Group, NavLink, Space } from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";
import { auth } from "../lib/firebase";
import { useUserState } from "../lib/useUserState";

export const PopupFooter = () => {
  const handleLogout = async () => {
    auth.signOut();
  };

  const { loggedIn } = useUserState();

  return (
    <>
      <Space h={"lg"}></Space>
      <Container>
        <Group position="apart">
          <Box sx={{ width: 240 }}>
            <NavLink
              component="a"
              href="https://uatu.star4.io"
              target="_blank"
              label="Visit Uatu website"
              icon={<IconHome2 size={16} stroke={1.5} />}
            />
          </Box>
          {loggedIn && (
            <Button onClick={handleLogout} color="pink" variant="light">
              Logout
            </Button>
          )}
        </Group>
      </Container>
    </>
  );
};
