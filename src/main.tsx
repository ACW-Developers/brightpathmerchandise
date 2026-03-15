import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Fully unregister all service workers and clear caches to prevent stale data
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
  });
}
// Clear all browser caches on startup
if ('caches' in window) {
  caches.keys().then(names => names.forEach(name => caches.delete(name)));
}

// Apply saved theme on load
const savedTheme = localStorage.getItem("bp-theme") || "dark";
document.documentElement.classList.add(savedTheme === "light" ? "light-theme" : "dark-theme");

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
