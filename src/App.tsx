import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [tabState, setTabState] = useState("");
  const handleButton = () => {
    //console.log("send to service worker [login] ->", email, pass);
    console.log("send to service worker [login]");
    chrome.runtime.sendMessage(
      { command: "auth-login", e: "galbitz@gmail.com", p: "" },
      (response) => {
        console.log(response);
      }
    );
  };

  const handleDump = async () => {
    const tabResult = (await chrome.storage.local.get("tabs")).tabs;
    console.log(tabResult);
    setTabState(JSON.stringify(tabResult));
  };

  return (
    <div className="App">
      <button onClick={handleButton}>Login</button>
      <div>
        <button onClick={handleDump}>Dump</button>
      </div>
      {tabState}
    </div>
  );
}

export default App;
