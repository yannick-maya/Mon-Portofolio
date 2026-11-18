import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import profile from "@/data/profile.json";

export function SiteFooter() {
  const locale = useLocale();
  const t = useTranslations("navigation");
  const footer = useTranslations("footer");
  const language = locale === "en" ? "en" : "fr";

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Link className="site-footer__name" href="/">
              {profile.name[language]}
            </Link>
            <p>{footer("tagline")}</p>
          </div>
          <nav aria-label={footer("navigationLabel")}>
            <Link href="/projets">{t("projects")}</Link>
            <Link href="/cv">{t("cv")}</Link>
            <Link href="/contact">{t("contact")}</Link>
          </nav>
          <div className="site-footer__socials">
            <a href={profile.links.linkedin} rel="noreferrer" target="_blank">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <a href={profile.links.github} rel="noreferrer" target="_blank">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="site-footer__bottom">
          <p>
            © {new Date().getFullYear()} {profile.name[language]}.{" "}
            {footer("rights")}
          </p>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </div>
    </footer>
  );
}
