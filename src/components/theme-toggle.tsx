"use client";

import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const t = useTranslations("navigation");

  function toggleTheme() {
    const root = document.documentElement;
    const isDark =
      root.dataset.theme === "dark" ||
      (!root.dataset.theme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.dataset.theme = isDark ? "light" : "dark";
  }

  return (
    <button
      aria-label={t("toggleTheme")}
      className="site-theme-toggle"
      onClick={toggleTheme}
      title={t("toggleTheme")}
      type="button"
    >
      <span aria-hidden="true">◐</span>
    </button>
  );
}
