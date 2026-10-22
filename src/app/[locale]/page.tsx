import { Container } from "@/components/ui/container";
import { Tag } from "@/components/ui/tag";
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import { ProjectCard } from "@/components/project-card";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { AnimatedName, HeroContours } from "@/components/hero-contours";
import { MagneticLink } from "@/components/magnetic-link";

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
            <span>
              <AnimatedName name={profile.name[language]} />
            </span>
          </h1>
          <p className="landing__description">
            {profile.heroDescription[language]}
          </p>
          <p className="eyebrow">
            {profile.location[language]} · {profile.origin[language]}
          </p>
          <div className="landing__actions">
            <MagneticLink href="/projets">
              {t("viewProjects")}
            </MagneticLink>
            <MagneticLink href="mailto:yannickmadjiadoum@gmail.com" variant="secondary">
              {t("contact")}
            </MagneticLink>
            <MagneticLink
              href="mailto:yannickmadjiadoum@gmail.com?subject=CV%20de%20Yannick%20Madjiadoum"
              variant="quiet"
            >
              {t("requestCv")}
            </MagneticLink>
            <MagneticLink
              href="https://github.com/yannick-maya"
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              {t("github")}
            </MagneticLink>
          </div>
        </section>
        <HeroContours />
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
