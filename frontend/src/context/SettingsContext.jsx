import { createContext, useContext, useEffect, useState } from "react";
import { getSettings } from "../firebase/firestoreService";
import { getCurrentUser } from "../firebase/authService";

const SettingsContext = createContext(null);

// Map the stored font-size token to an actual root font size.
const FONT_SIZE_MAP = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

// Resolve the effective theme (handles "system").
function resolveTheme(theme) {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme === "dark" ? "dark" : "light";
}

// Apply the appearance settings to the document root so they affect the whole app.
export function applyAppearance(appearance) {
  if (!appearance || typeof document === "undefined") return;
  const root = document.documentElement;

  root.setAttribute("data-theme", resolveTheme(appearance.theme));
  root.style.setProperty("--accent", appearance.accentColor || "#8b5cf6");
  root.style.setProperty(
    "--base-font-size",
    FONT_SIZE_MAP[appearance.fontSize] || "16px"
  );
  root.classList.toggle("compact", !!appearance.compactMode);
}

export function SettingsProvider({ children }) {
  const [appearance, setAppearance] = useState({
    theme: "light",
    accentColor: "#8b5cf6",
    fontSize: "medium",
    compactMode: false,
  });

  // Load saved appearance from Firestore and apply it.
  useEffect(() => {
    let active = true;
    const uid = getCurrentUser()?.uid;
    if (!uid) return;
    getSettings(uid)
      .then((d) => {
        if (!d) return;
        const next = {
          theme: d.theme || "light",
          accentColor: d.accent_color || "#8b5cf6",
          fontSize: d.font_size || "medium",
          compactMode: d.compact_mode ?? false,
        };
        if (active) setAppearance(next);
        applyAppearance(next);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Re-apply whenever the appearance state changes.
  useEffect(() => {
    applyAppearance(appearance);
  }, [appearance]);

  // React to OS theme changes when "system" is selected.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (appearance.theme === "system") applyAppearance(appearance);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [appearance]);

  return (
    <SettingsContext.Provider
      value={{ appearance, setAppearance, applyAppearance }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
