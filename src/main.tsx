import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";

// Initialize all services BEFORE importing App
import { initializeApp } from "./config/initialize";
initializeApp();

// Initialize i18n
import "./i18n";

// Import App AFTER initialization
import App from "./App";

// Render React app
const root = document.getElementById("root")!;
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
