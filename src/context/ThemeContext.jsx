import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "../lib/storage.js";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

const systemTheme = () => {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch (error) {
    return "light";
  }
};

const initialTheme = () => {
  const stored = readJSON(STORAGE_KEYS.theme);
  return stored === "dark" || stored === "light" ? stored : systemTheme();
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  // El atributo en <html> activa las variables de tokens.css.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeJSON(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
