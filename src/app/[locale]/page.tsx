import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Tag } from "@/components/ui/tag";
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import cv from "@/data/cv.json";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { HeroContours } from "@/components/hero-contours";

export default async function Home() {
  const locale = await getLocale();
  const language = locale === "en" ? "en" : "fr";
  const t = await getTranslations("home");
  const [firstName, ...surname] = profile.name[language].split(" ");
  const cvFile = cv[language];

  return (
    <main className="home-page">
      <section className="landing">
        <Container className="landing__layout">
          <HeroContours />
          <section className="landing__copy" aria-labelledby="home-title">
            <p className="landing__eyebrow">
              <span aria-hidden="true" />
              {t("status")}
            </p>
            <h1 className="landing__title" id="home-title">
              {firstName}
              <span className="landing__surname">{surname.join(" ")}</span>
            </h1>
            <p className="landing__role">{profile.title[language]}</p>
            <p className="landing__description">
              {profile.heroDescription[language]}
            </p>
            <p className="landing__location">
              {profile.location[language]} · {profile.origin[language]}
            </p>
            <div className="landing__actions">
              <Link
                className="button button--primary button--lg"
                href="/projets"
              >
                {t("viewProjects")}
              </Link>
              {cvFile ? (
                <a
                  className="button button--secondary button--lg"
                  download
                  href={cvFile}
                >
                  {t("downloadCv")}
                </a>
              ) : (
                <Link
                  className="button button--secondary button--lg"
                  href="/cv"
                >
                  {t("downloadCv")}
                </Link>
              )}
              <Link className="button button--quiet" href="/contact">
                {t("contact")}
              </Link>
            </div>
            <div className="landing__socials">
              <a href={profile.links.linkedin} rel="noreferrer" target="_blank">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href={profile.links.github} rel="noreferrer" target="_blank">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
          <div className="landing__portrait">
            <Image
              alt={t("portraitAlt")}
              className="landing__portrait-image"
              height={600}
              priority
              sizes="(max-width: 48rem) 80vw, 36rem"
              src="/images/profile.jpg"
              width={600}
            />
            <div className="landing__portrait-caption">
              <span>{profile.location[language]}</span>
              <span>{t("portraitCaption")}</span>
            </div>
          </div>
        </Container>
      </section>
      <section className="home-projects">
        <Container>
          <div className="home-projects__heading">
            <SectionHeading
              description={t("projectsDescription")}
              eyebrow={t("projectsEyebrow")}
              title={t("projectsTitle")}
            />
            <Link className="text-link" href="/projets">
              {t("viewProjects")} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="project-grid home-projects__grid">
            {projects
              .filter((project) => project.featured)
              .map((project) => {
                const title = project.title[language];

                return (
                  <article className="project-card" key={project.id}>
                    <div className="project-card__body">
                      <p className="project-card__category">
                        {project.category[language]}
                      </p>
                      <h3 className="project-card__title">
                        <Link href={`/projets/${project.slug}`}>{title}</Link>
                      </h3>
                      <p className="project-card__description">
                        {project.summary[language]}
                      </p>
                      <ul
                        aria-label={t("technologies")}
                        className="project-card__technologies"
                      >
                        {project.stack.slice(0, 4).map((technology) => (
                          <li key={technology}>
                            <Tag>{technology}</Tag>
                          </li>
                        ))}
                      </ul>
                      <Link
                        className="project-card__action"
                        href={`/projets/${project.slug}`}
                      >
                        {t("viewProject")} <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
          </div>
        </Container>
      </section>
    </main>
  );
}
