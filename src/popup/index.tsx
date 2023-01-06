import React from "react";
import ReactDOM from "react-dom";
import Popup from "./Popup";
import "./index.css";
import * as Sentry from "@sentry/react";
import { sentryConfig } from "../lib/sentry";

Sentry.init(sentryConfig);

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
