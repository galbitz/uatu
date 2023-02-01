import { Container, createStyles, Group, NavLink, Text } from "@mantine/core";
import { IconHome2 } from "@tabler/icons";
import { saveBrowserState } from "../lib/browserStateSaver";

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

  const handleVersionInfoClick = () => {
    saveBrowserState();
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
          </Text>
        </Group>
      </Container>
    </div>
  );
};
