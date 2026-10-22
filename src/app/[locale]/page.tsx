import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Tag } from "@/components/ui/tag";
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import { ProjectCard } from "@/components/project-card";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function Home() {
  const locale = await getLocale();
  const language = locale === "en" ? "en" : "fr";
  const t = await getTranslations("home");

  return (
    <main className="landing">
      <Container className="landing__layout">
        <section className="landing__copy" aria-labelledby="home-title">
          <Tag>{t("status")}</Tag>
          <h1 className="landing__title" id="home-title">
            <span>{profile.name[language]}</span>
          </h1>
          <p className="landing__description">
            {profile.heroDescription[language]}
          </p>
          <p className="eyebrow">
            {profile.location[language]} · {profile.origin[language]}
          </p>
          <div className="landing__actions">
            <Link className="button button--primary" href="/projets">
              {t("viewProjects")}
            </Link>
            <ButtonLink href="mailto:yannickmadjiadoum@gmail.com">
              {t("contact")}
            </ButtonLink>
            <ButtonLink
              href="mailto:yannickmadjiadoum@gmail.com?subject=CV%20de%20Yannick%20Madjiadoum"
              variant="quiet"
            >
              {t("requestCv")}
            </ButtonLink>
            <ButtonLink
              href="https://github.com/yannick-maya"
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              {t("github")}
            </ButtonLink>
          </div>
        </section>
        <svg
          aria-hidden="true"
          className="landing__art"
          fill="none"
          viewBox="0 0 480 480"
        >
          <path
            d="M239 25c118 0 214 96 214 215S357 455 239 455 25 359 25 240 121 25 239 25Z"
            opacity=".18"
            stroke="currentColor"
          />
          <path
            d="M239 57c101 0 183 82 183 183s-82 183-183 183S56 341 56 240 138 57 239 57Z"
            opacity=".28"
            stroke="currentColor"
          />
          <path
            d="M240 91c82 0 149 67 149 149s-67 149-149 149-149-67-149-149S158 91 240 91Z"
            opacity=".38"
            stroke="currentColor"
          />
          <path
            d="M240 126c63 0 114 51 114 114s-51 114-114 114-114-51-114-114 51-114 114-114Z"
            opacity=".52"
            stroke="currentColor"
          />
          <path
            d="M240 162c43 0 78 35 78 78s-35 78-78 78-78-35-78-78 35-78 78-78Z"
            opacity=".72"
            stroke="currentColor"
          />
          <path
            d="M240 240h174"
            opacity=".55"
            stroke="currentColor"
            strokeDasharray="4 8"
          />
          <circle cx="240" cy="240" r="8" fill="var(--accent)" />
          <circle cx="414" cy="240" r="5" fill="var(--signal)" />
        </svg>
      </Container>
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
          <div className="project-grid">
            {projects
              .filter((project) => project.featured)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
