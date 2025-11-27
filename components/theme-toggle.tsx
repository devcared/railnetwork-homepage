"use client";

import { useTheme } from "@/contexts/theme-context";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Verhindere Hydration-Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Fallback während SSR
    return (
      <button
        className="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
        aria-label="Theme wechseln"
        disabled
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
      aria-label={theme === "light" ? "Zu Dark Mode wechseln" : "Zu Light Mode wechseln"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "light" ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </motion.div>
    </button>
  );
}

