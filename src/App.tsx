import React, { useEffect, useState } from "react";
import "./App.css";
import browser from "webextension-polyfill";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Table,
  MantineProvider,
  Container,
} from "@mantine/core";
import { auth, db } from "./lib/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  Unsubscribe,
  User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { collection, onSnapshot } from "firebase/firestore";
import { getBrowserId } from "./lib/browser";

function App() {
  const [loggedin, setLoggedin] = useState(false);

  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 2
          ? "Password should include at least 2 characters"
          : null,
    },
  });

  const [browsersState, setBrowsersState] = useState<any[]>([]);

  const [docUpdateUnsubscribe, setDocUpdateUnsubscribe] = useState<Unsubscribe>(
    () => () => {}
  );

  const setDocSubscription = async (user: User | null) => {
    console.log("setdocsub triggered");
    docUpdateUnsubscribe();
    if (user) {
      const userId = user.uid;
      const browserId = await getBrowserId();
      const documentPath = `users/${userId}/browsers`;
      const docRef = collection(db, documentPath);
      const unsub = onSnapshot(docRef, async (result) => {
        console.log("updated snapshot");

        const browsers = result.docs.map((doc) => {
          return { id: doc.id, windows: doc.data().windows };
        });
        setBrowsersState(browsers);
      });
      setDocUpdateUnsubscribe(() => () => {
        unsub();
      });
    } else {
      setDocUpdateUnsubscribe(() => () => {});
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setLoggedin(user ? true : false);
      setDocSubscription(auth.currentUser);
    });

    return unsub;
  }, []);

  const handleSubmit = async () => {
    if (type === "login") {
      signInWithEmailAndPassword(
        auth,
        form.values.email,
        form.values.password
      ).catch((error: FirebaseError) => {
        form.setFieldError("email", error.code);
      });
    }
    if (type === "register") {
      try {
        var newUser = await createUserWithEmailAndPassword(
          auth,
          form.values.email,
          form.values.password
        );

        await sendEmailVerification(newUser.user);
      } catch (error) {
        if (error instanceof FirebaseError) {
          form.setFieldError("email", error.code);
        } else {
          form.setFieldError("email", JSON.stringify(error));
        }
      }
    }
  };

  const handleSendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      await auth.signOut();
    }
  };
  const handleLogout = async () => {
    auth.signOut();
  };

  const handleSelectTab = async (windowId?: number, tabId?: number) => {
    if (!tabId || !windowId) {
      return;
    }

    await browser.windows.update(windowId, {
      focused: true,
    });
    await browser.tabs.update(tabId, { active: true });
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Stack align="center">
        <Container>
          <Paper radius="md" p="xl" withBorder>
            <Text size="lg" weight={500}>
              Welcome to Tab4
            </Text>

            {!loggedin && (
              <form
                onSubmit={form.onSubmit(() => {
                  handleSubmit();
                })}
              >
                <Stack>
                  <TextInput
                    required
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps("email")}
                  />

                  <PasswordInput
                    required
                    label="Password"
                    placeholder="Your password"
                    {...form.getInputProps("password")}
                  />
                </Stack>

                <Group position="apart" mt="xl">
                  <Anchor
                    component="button"
                    type="button"
                    color="dimmed"
                    onClick={() => toggle()}
                    size="xs"
                  >
                    {type === "register"
                      ? "Already have an account? Login"
                      : "Don't have an account? Register"}
                  </Anchor>
                  <Button type="submit">{upperFirst(type)}</Button>
                </Group>
              </form>
            )}
            {loggedin && (
              <>
                {auth.currentUser && !auth.currentUser.emailVerified && (
                  <Button onClick={handleSendVerificationEmail}>
                    Resend verification
                  </Button>
                )}
                <Button onClick={handleLogout}>Logout</Button>
              </>
            )}
          </Paper>
        </Container>
        <Container>
          {browsersState.map((browserInfo) => (
            <>
              <div>Browser id:{browserInfo.id}</div>
              {browserInfo.windows.map((window: browser.Windows.Window) => (
                <>
                  <div>
                    Window id: {window.id}
                    <Table striped withBorder>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Url</th>
                        </tr>
                      </thead>
                      {window.tabs?.map((tab) => (
                        <tr onClick={() => handleSelectTab(window.id, tab.id)}>
                          <td>{tab.id}</td>
                          <td>{tab.title}</td>
                          <td>{tab.url}</td>
                        </tr>
                      ))}
                    </Table>
                  </div>
                </>
              ))}
            </>
          ))}
        </Container>
      </Stack>
    </MantineProvider>
  );
}

export default App;
