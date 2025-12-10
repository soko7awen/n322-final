import React, { createContext, useContext, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

const palettes = {
  dark: {
    background: "#0f172a",
    card: "#1f2937",
    accent: "#22d3ee",
    text: "#e2e8f0",
    muted: "#94a3b8",
    danger: "#f87171",
    surface: "#0b1221",
    border: "#23314d",
  },
  light: {
    background: "#f8fafc",
    card: "#ffffff",
    accent: "#0ea5e9",
    text: "#0f172a",
    muted: "#475569",
    danger: "#dc2626",
    surface: "#eef2f7",
    border: "#e2e8f0",
  },
};

const ThemeContext = createContext({
  palette: palettes.dark,
  mode: "dark",
  toggleTheme: () => {},
  styles: {},
});

const buildStyles = (palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: palette.background,
      padding: 20,
      gap: 16,
    },
    card: {
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: palette.border,
    },
    heading: {
      color: palette.text,
      fontSize: 26,
      fontWeight: "700",
    },
    subheading: {
      color: palette.muted,
      fontSize: 16,
    },
    input: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: palette.text,
      fontSize: 16,
    },
    button: {
      backgroundColor: palette.accent,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: palette.background,
      fontWeight: "700",
      fontSize: 16,
    },
    link: {
      color: palette.accent,
      fontWeight: "700",
    },
    muted: {
      color: palette.muted,
    },
  });

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");
  const palette = mode === "dark" ? palettes.dark : palettes.light;
  const styles = useMemo(() => buildStyles(palette), [palette]);
  const toggleTheme = () =>
    setMode((prev) => (prev === "dark" ? "light" : "dark"));

  const value = useMemo(
    () => ({ palette, mode, toggleTheme, styles }),
    [palette, mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function usePalette() {
  return useContext(ThemeContext).palette;
}

export function useTheme() {
  return useContext(ThemeContext).styles;
}

export function useThemeToggle() {
  return useContext(ThemeContext).toggleTheme;
}

// Default export for compatibility (uses dark palette).
export const palette = palettes.dark;
