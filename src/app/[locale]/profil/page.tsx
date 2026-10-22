import { useLocale, useTranslations } from "next-intl";
import profile from "@/data/profile.json";
import timeline from "@/data/timeline.json";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";

export default function ProfilePage() {
  const locale = useLocale() === "en" ? "en" : "fr";
  const t = useTranslations("profilePage");
  const experience = timeline.filter((entry) => entry.type === "experience");
  const languageText = profile.languages
    .map((language) => `${language.name[locale]} (${language.level[locale]})`)
    .join(", ");
  const facts = [
    { label: t("location"), value: `${profile.location[locale]} · ${profile.origin[locale]}` },
    { label: t("languages"), value: languageText },
    { label: t("availability"), value: t("toConfirm") },
    { label: t("desiredPosition"), value: t("toConfirm") },
    { label: t("mobility"), value: t("toConfirm") },
  ];

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

        <section className="profile-overview" aria-labelledby="profile-summary">
          <ImagePlaceholder
            alt={t("portraitLabel")}
            className="profile-portrait"
            src={null}
          />
          <div className="profile-overview__content">
            <h2 id="profile-summary">{t("summary")}</h2>
            <p className="long-copy">{profile.summary[locale]}</p>
            <h3>{t("quickFacts")}</h3>
            <dl className="facts-list">
              {facts.map((fact) => (
                <div className="facts-list__item" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="content-section">
          <SectionHeading eyebrow={t("eyebrow")} title={t("expertise")} />
          <div className="expertise-grid">
            {profile.expertise.map((item) => (
              <article className="expertise-item" key={item.id}>
                <h3>{item.title[locale]}</h3>
                <p>{item.description[locale]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section">
          <SectionHeading title={t("skills")} />
          <p className="section-note">{t("skillsNote")}</p>
          <div className="skill-levels" aria-label={t("skillLevels")}>
            {[t("mastery"), t("comfortable"), t("learning")].map((level) => (
              <Tag key={level}>{level}</Tag>
            ))}
          </div>
          <div className="skill-groups">
            {profile.skills.map((group) => (
              <section className="skill-group" key={group.category.fr}>
                <h3>{group.category[locale]}</h3>
                <ul className="tag-list">
                  {group.items.map((skill) => (
                    <li key={skill}>
                      <Tag>{skill}</Tag>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className="content-section">
          <SectionHeading title={t("experience")} />
          <div className="experience-list">
            {experience.map((item) => (
              <article className="experience-item" key={item.id}>
                <p className="experience-item__period">{item.period[locale]}</p>
                <div>
                  <h3>{item.title[locale]}</h3>
                  <p className="experience-item__organization">
                    {item.organization[locale]}
                  </p>
                  <p>{item.description[locale]}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section content-section--last">
          <SectionHeading title={t("interests")} />
          <ul className="tag-list">
            {profile.interests.map((interest) => (
              <li key={interest.fr}>
                <Tag>{interest[locale]}</Tag>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  );
}
