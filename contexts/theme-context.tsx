"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Nur im Client ausführen
    if (typeof window === "undefined") return;
    
    setMounted(true);
    // Lade gespeichertes Theme aus localStorage
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        setTheme(savedTheme);
      } else {
        // Prüfe System-Präferenz
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    // Nur im Client ausführen
    if (typeof window === "undefined" || !mounted) return;
    
    try {
      // Speichere Theme im localStorage
      localStorage.setItem("theme", theme);
      
      // Setze dark class auf html element
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Immer den Context bereitstellen, auch wenn noch nicht gemountet
  // Dies verhindert "useTheme must be used within a ThemeProvider" Fehler
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Fallback für SSR oder wenn Provider nicht verfügbar ist
    return {
      theme: "light" as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}

