import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Unregister stale service workers to fix caching issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
  });
  // Register fresh SW
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// Apply saved theme on load
const savedTheme = localStorage.getItem("bp-theme") || "dark";
document.documentElement.classList.add(savedTheme === "light" ? "light-theme" : "dark-theme");

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
