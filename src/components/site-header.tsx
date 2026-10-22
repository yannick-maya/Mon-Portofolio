import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function SiteHeader({ name }: { name: string }) {
  const t = useTranslations("navigation");

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/" aria-label={name}>
          YM
        </Link>
        <nav aria-label={t("mainLabel")} className="main-navigation">
          <Link href="/">{t("home")}</Link>
          <Link href="/profil">{t("profile")}</Link>
          <Link href="/parcours">{t("timeline")}</Link>
          <Link href="/projets">{t("projects")}</Link>
          <Link href="/cv">{t("cv")}</Link>
          <Link href="/contact">{t("contact")}</Link>
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
