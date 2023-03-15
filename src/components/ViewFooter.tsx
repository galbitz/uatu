import { Container, createStyles, Group, NavLink, Text } from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";
import { saveBrowserState } from "../lib/browserStateSaver";
import BrowserFunctions, { GET_LAST_TRIGGER } from "../lib/browser";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 20,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },
}));

export const ViewFooter = () => {
  const { classes } = useStyles();
  const [lastUpdate, setLastUpdate] = useState("");

  const handleVersionInfoClick = async () => {
    saveBrowserState();
    const response = await BrowserFunctions.sendMessage({
      request: GET_LAST_TRIGGER,
    });
    setLastUpdate(": " + response.response);
  };

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group>
          <NavLink
            component="a"
            href="https://uatu.star4.io"
            target="_blank"
            label="Visit Uatu website"
            icon={<IconHome2 size={16} stroke={1.5} />}
          />
        </Group>
        <Group>
          <Text onClick={handleVersionInfoClick}>
            Build: {process.env.REACT_APP_VERSION}
            {lastUpdate}
          </Text>
        </Group>
      </Container>
    </div>
  );
};
