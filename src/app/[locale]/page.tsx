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
import { ImagePlaceholder } from "@/components/image-placeholder";

export default async function Home() {
  const locale = await getLocale();
  const language = locale === "en" ? "en" : "fr";
  const t = await getTranslations("home");
  const [firstName, ...surname] = profile.name[language].split(" ");
  const cvFile = cv[language];
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <main className="home-page">
      <section className="landing" aria-labelledby="home-title">
        <div className="landing__edition" aria-hidden="true">
          <span>PORTFOLIO / 2026</span>
          <span>DATA · SYSTEMS · TERRITORIES</span>
          <span>01—04</span>
        </div>
        <Container className="landing__layout">
          <HeroContours />
          <div className="landing__copy">
            <p className="landing__eyebrow">
              <span aria-hidden="true" />
              {t("status")}
            </p>
            <h1 className="landing__title" id="home-title">
              <span className="landing__firstname">{firstName}</span>
              <span className="landing__surname">
                {surname.join(" ")}<i aria-hidden="true">.</i>
              </span>
            </h1>
            <p className="landing__role">{profile.title[language]}</p>
            <p className="landing__description">
              {profile.heroDescription[language]}
            </p>
            <p className="landing__location">
              <span aria-hidden="true">⌖</span>
              {profile.location[language]} <i /> {profile.origin[language]}
            </p>
            <div className="landing__actions">
              <Link className="button button--primary button--lg" href="/projets">
                {t("viewProjects")} <span aria-hidden="true">↗</span>
              </Link>
              {cvFile ? (
                <a className="button button--secondary button--lg" download href={cvFile}>
                  {t("downloadCv")} <span aria-hidden="true">↓</span>
                </a>
              ) : (
                <Link className="button button--secondary button--lg" href="/cv">
                  {t("downloadCv")} <span aria-hidden="true">↓</span>
                </Link>
              )}
            </div>
            <div className="landing__socials">
              <a href={profile.links.linkedin} rel="noreferrer" target="_blank">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href={profile.links.github} rel="noreferrer" target="_blank">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <figure className="landing__portrait">
            <span className="landing__portrait-index" aria-hidden="true">YM / 01</span>
            <Image
              alt={t("portraitAlt")}
              className="landing__portrait-image"
              height={600}
              priority
              sizes="(max-width: 48rem) 88vw, 35rem"
              src="/images/profile.jpg"
              width={600}
            />
            <figcaption className="landing__portrait-caption">
              <span>{profile.location[language]}</span>
              <span>{t("portraitCaption")}</span>
            </figcaption>
          </figure>
        </Container>
        <div className="landing__index-rail" role="list" aria-label={t("technologies")}>
          <span className="landing__index-label">FOCUS /</span>
          {profile.expertise.map((item, index) => (
            <span className="landing__index-item" key={item.id} role="listitem">
              <b>0{index + 1}</b>{item.title[language]}
            </span>
          ))}
        </div>
      </section>

      <section className="home-projects" aria-labelledby="featured-title">
        <Container>
          <div className="home-projects__masthead">
            <span>02 / SELECTED WORK</span>
            <span>{String(featuredProjects.length).padStart(2, "0")} PROJECTS</span>
          </div>
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
            {featuredProjects.map((project, index) => {
              const title = project.title[language];

              return (
                <article className="project-card" key={project.id}>
                  <span className="project-card__index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <ImagePlaceholder
                    alt={title}
                    className="project-card__image"
                    src={project.image}
                  />
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
                    <ul aria-label={t("technologies")} className="project-card__technologies">
                      {project.stack.slice(0, 4).map((technology) => (
                        <li key={technology}><Tag>{technology}</Tag></li>
                      ))}
                    </ul>
                    <Link className="project-card__action" href={`/projets/${project.slug}`}>
                      {t("viewProject")} <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                  <span className="project-card__corner" aria-hidden="true">↗</span>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
