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
} from "@mantine/core";

function App() {
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

  const [tabState, setTabState] = useState("");
  const handleButton = async () => {
    console.log("send to service worker [login]");

    var response = await browser.runtime.sendMessage({
      command: "auth-login",
      e: "galbitz@gmail.com",
      p: "",
    });
    console.log("response from background", response);
  };

  useEffect(() => {
    browser.runtime.onMessage.addListener((msg) => {
      if (msg.command == "doc-update") {
        setTabState(JSON.stringify(msg.data));
      }
    });
  }, []);

  const handleSubmit = async () => {
    if (type === "login") {
      await browser.runtime.sendMessage({
        command: "auth-login",
        e: form.values.email,
        p: form.values.password,
      });
    }
  };

  return (
    <div className="App">
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" weight={500}>
          Welcome to Tab4
        </Text>

        <form
          onSubmit={form.onSubmit(() => {
            handleSubmit();
          })}
        >
          <Stack>
            {/* {type === "register" && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
              />
            )} */}

            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
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
      </Paper>

      <button onClick={handleButton}>Login</button>
      <div>Dump1</div>
      <pre>{tabState}</pre>
    </div>
  );
}

export default App;
