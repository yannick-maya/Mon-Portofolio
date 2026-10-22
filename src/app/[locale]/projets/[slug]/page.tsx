import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import projects from "@/data/projects.json";
import { Link } from "@/i18n/navigation";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";

const detailSections = [
  ["context", "context"],
  ["problem", "problem"],
  ["solution", "solution"],
  ["technicalChoices", "technicalChoices"],
  ["challenges", "challenges"],
  ["results", "results"],
  ["learnings", "learnings"],
] as const;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return <ProjectDetails project={project} />;
}

function ProjectDetails({
  project,
}: {
  project: (typeof projects)[number];
}) {
  const locale = useLocale() === "en" ? "en" : "fr";
  const t = useTranslations("projectsPage");
  const common = useTranslations("common");
  const copy = useTranslations("projectDetail");
  const notSpecified = "[À COMPLÉTER PAR YANNICK]";

  return (
    <main className="site-page">
      <Container>
        <Link className="back-link" href="/projets">
          <span aria-hidden="true">←</span> {common("backToProjects")}
        </Link>
        <div className="project-detail__intro">
          <SectionHeading
            as="h1"
            description={project.summary[locale]}
            eyebrow={project.category[locale]}
            title={project.title[locale]}
          />
        </div>
        <ImagePlaceholder
          alt={common("placeholderImage")}
          className="project-detail__image"
          src={project.image}
        />
        <div className="project-detail__layout">
          <div className="project-detail__sections">
            {detailSections.map(([field, label]) => {
              const text = project.details[field][locale];
              if (text === notSpecified) return null;

              return (
                <section className="detail-section" key={field}>
                  <h2>{t(label)}</h2>
                  <p>{text}</p>
                </section>
              );
            })}
          </div>
          <aside className="project-detail__aside">
            <h2>{common("technologies")}</h2>
            <ul className="tag-list">
              {project.stack.map((technology) => (
                <li key={technology}>
                  <Tag>{technology}</Tag>
                </li>
              ))}
            </ul>
            <h2>{copy("role")}</h2>
            <p>{project.role[locale]}</p>
            {project.demo ? (
              <a className="text-link" href={project.demo} rel="noreferrer" target="_blank">
                {t("demo")}
              </a>
            ) : null}
            {project.code ? (
              <a className="text-link" href={project.code} rel="noreferrer" target="_blank">
                {t("code")}
              </a>
            ) : null}
          </aside>
        </div>
      </Container>
    </main>
  );
}
