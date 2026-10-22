import { useTranslations } from "next-intl";
import profile from "@/data/profile.json";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ContactPage() {
  const t = useTranslations("contactPage");

  return (
    <main className="site-page">
      <Container>
        <div className="page-intro">
          <SectionHeading
            as="h1"
            description={t("intro")}
            eyebrow={t("eyebrow")}
            title={t("title")}
          />
        </div>
        <div className="contact-layout">
          <section className="contact-details" aria-label={t("email")}>
            <a className="contact-method" href={`mailto:${profile.email}`}>
              <span>{t("email")}</span>
              <strong>{profile.email}</strong>
            </a>
            <a
              className="contact-method"
              href={profile.links.linkedin}
              rel="noreferrer"
              target="_blank"
            >
              <span>{t("linkedin")}</span>
              <strong>linkedin.com/in/madjiadoumyannick</strong>
            </a>
            <a
              className="contact-method"
              href={profile.links.github}
              rel="noreferrer"
              target="_blank"
            >
              <span>{t("github")}</span>
              <strong>github.com/yannick-maya</strong>
            </a>
          </section>
          <section className="contact-form-panel">
            <h2>{t("formTitle")}</h2>
            <ContactForm />
          </section>
        </div>
      </Container>
    </main>
  );
}
