"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("languageSwitcher");
  const pathname = usePathname();
  const router = useRouter();

  function changeLocale(nextLocale: (typeof routing.locales)[number]) {
    if (nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale });
    }
  }

  return (
    <nav aria-label={t("label")} className="locale-switcher">
      <button
        aria-current={locale === "fr" ? "true" : undefined}
        aria-label={t("french")}
        className="locale-switcher__option"
        onClick={() => changeLocale("fr")}
        type="button"
      >
        FR
      </button>
      <span aria-hidden="true" className="locale-switcher__divider">
        /
      </span>
      <button
        aria-current={locale === "en" ? "true" : undefined}
        aria-label={t("english")}
        className="locale-switcher__option"
        onClick={() => changeLocale("en")}
        type="button"
      >
        EN
      </button>
    </nav>
  );
}
