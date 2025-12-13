/**
 * Application Entry Point
 * =======================
 * This file bootstraps the React application by mounting the root
 * component to the DOM. Uses React 18's createRoot API for concurrent
 * rendering features.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
