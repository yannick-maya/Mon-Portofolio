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
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        viewBox="0 0 24 24"
        width="18"
      >
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.5v2M12 19.5v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2.5 12h2m15 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    </button>
  );
}
