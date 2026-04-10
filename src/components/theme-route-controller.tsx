"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/src/components/theme-toggle";

type ThemeMode = "light" | "dark";

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

export default function ThemeRouteController() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      applyTheme("light");
      return;
    }

    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    applyTheme(savedTheme ?? getSystemTheme());
  }, [pathname]);

  if (pathname === "/") {
    return null;
  }

  return <ThemeToggle mode="floating" className="md:hidden" />;
}
