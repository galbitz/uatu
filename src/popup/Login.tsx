import {
  Anchor,
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Card,
  Text,
  Space,
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

export const Login = () => {
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

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Text>
        Login or create an account to synchronize the state of open windows and
        tabs to the cloud so it can be viewed on other browsers and platforms.
      </Text>
      <Space h={"md"}></Space>
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
    </Card>
  );
};
