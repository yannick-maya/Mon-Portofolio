"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function SiteHeader({ name }: { name: string }) {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const items = [
    { href: "/" as const, label: t("home") },
    { href: "/profil" as const, label: t("profile") },
    { href: "/parcours" as const, label: t("timeline") },
    { href: "/projets" as const, label: t("projects") },
    { href: "/diplomes" as const, label: t("credentials") },
    { href: "/cv" as const, label: t("cv") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/" aria-label={name}>
          <span aria-hidden="true" className="site-brand__mark">
            YM
          </span>
          <span className="site-brand__name">{name}</span>
        </Link>
        <button
          aria-controls="main-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
          className="site-menu-toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          <span
            aria-hidden="true"
            className={isMenuOpen ? "site-menu-toggle__icon is-open" : "site-menu-toggle__icon"}
          >
            <span />
            <span />
          </span>
        </button>
        <nav
          aria-label={t("mainLabel")}
          className={
            isMenuOpen
              ? "main-navigation main-navigation--open"
              : "main-navigation"
          }
          id="main-navigation"
        >
          {items.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                href={href}
                key={href}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
