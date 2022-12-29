import {
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useUserState } from "../lib/useUserState";
import browser from "webextension-polyfill";

export const Login = () => {
  const { userLoading, loggedIn } = useUserState();
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

  const handleOpenManager = async () => {
    await browser.tabs.create({
      url: browser.runtime.getURL("index.html"),
    });
  };

  if (userLoading) return <></>;

  return (
    <Paper radius="md" p="xl" withBorder>
      <Text size="lg" weight={500}>
        Welcome to Tab4
      </Text>

      {!loggedIn && (
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
      {loggedIn && (
        <>
          {auth.currentUser && !auth.currentUser.emailVerified ? (
            <>
              <Text>
                Verification e-mail has been sent. Please log out and log back
                in after verification.
              </Text>
              <Button onClick={handleSendVerificationEmail}>
                Resend verification
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleOpenManager}>Open Tab Manager</Button>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          )}
        </>
      )}
    </Paper>
  );
};
