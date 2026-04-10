"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
type ToggleMode = "floating" | "sidebar";

type ThemeToggleProps = {
  mode?: ToggleMode;
  className?: string;
};

const getSystemTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.setAttribute("data-theme", mode);
};

export default function ThemeToggle({ mode = "floating", className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    const resolvedTheme = savedTheme ?? getSystemTheme();

    applyTheme(resolvedTheme);
    setTheme(resolvedTheme);
    setMounted(true);

    if (!savedTheme) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (event: MediaQueryListEvent) => {
        const nextTheme: ThemeMode = event.matches ? "dark" : "light";
        applyTheme(nextTheme);
        setTheme(nextTheme);
      };

      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  if (mode === "sidebar") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          "flex h-8 w-full items-center justify-between rounded-md border border-slate-200/90 bg-slate-50 px-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
          className,
        )}
      >
        <span>{isDark ? "Dark" : "Light"} mode</span>
        {isDark ? <Sun size={13} /> : <Moon size={13} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "fixed bottom-4 right-4 z-[100] grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white/75 text-slate-700 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white dark:border-white/20 dark:bg-slate-900/75 dark:text-amber-200 dark:hover:bg-slate-900",
        className,
      )}
    >
      <span className="sr-only">Toggle dark mode</span>
      {isDark ? <Sun size={13} /> : <Moon size={13} />}
    </button>
  );
}
