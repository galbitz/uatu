import React, { useEffect, useState } from "react";
import "./App.css";
import browser from "webextension-polyfill";

function App() {
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

  return (
    <div className="App">
      <button onClick={handleButton}>Login</button>
      <div>Dump</div>
      <pre>{tabState}</pre>
    </div>
  );
}

export default App;
