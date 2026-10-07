import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThunderIDProvider } from "@thunderid/react";
import App from "./App";
import config from "./config";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThunderIDProvider
      baseUrl={config.baseUrl}
      clientId={config.clientId}
      scopes={config.scopes}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThunderIDProvider>
  </StrictMode>,
);
