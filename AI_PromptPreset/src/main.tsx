import React from "react";
import ReactDOM from "react-dom/client";
import { UIProvider } from "@yamada-ui/react";
import AIPromptPresetPage from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UIProvider>
      <AIPromptPresetPage />
    </UIProvider>
  </React.StrictMode>
);
