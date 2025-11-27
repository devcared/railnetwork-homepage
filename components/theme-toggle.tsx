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
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 bg-white/80 text-slate-600 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300"
        aria-label="Theme wechseln"
        disabled
      >
        <Moon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 bg-white/80 text-slate-600 shadow-sm transition hover:border-[#e2001a]/40 hover:bg-[#e2001a]/5 hover:text-[#e2001a] dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-[#e2001a]/40 dark:hover:bg-[#e2001a]/10"
      aria-label={theme === "light" ? "Zu Dark Mode wechseln" : "Zu Light Mode wechseln"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </motion.div>
    </button>
  );
}

