import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const locale = useLocale();
  const t = useTranslations("navigation");

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>Yannick Madjiadoum</p>
        <nav aria-label={locale === "fr" ? "Liens de pied de page" : "Footer links"}>
          <Link href="/projets">{t("projects")}</Link>
          <Link href="/contact">{t("contact")}</Link>
        </nav>
      </div>
    </footer>
  );
}
