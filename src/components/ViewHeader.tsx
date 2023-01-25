import { Container, Group, Header, Title, createStyles } from "@mantine/core";
import { ColorSchemeControl } from "./ColorSchemeControl";

export const ViewHeader = () => {
  const useStyles = createStyles((theme) => ({
    inner: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: 56,

      [theme.fn.smallerThan("sm")]: {
        justifyContent: "flex-start",
      },
    },
  }));

  const { classes } = useStyles();
  return (
    <Header height={56} mb={120}>
      <Container className={classes.inner}>
        <Group position="left" spacing={5}>
          <Title>Uatu Tab Manager</Title>
        </Group>
        <Group position="right" noWrap>
          <ColorSchemeControl />
        </Group>
      </Container>
    </Header>
  );
};
