import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
//import App from "./popup/Popup";
import * as Sentry from "@sentry/react";
import { sentryConfig } from "./lib/sentry";

Sentry.init(sentryConfig);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
