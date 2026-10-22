import { useTranslations } from "next-intl";
import { ProjectGrid } from "@/components/project-grid";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ProjectsPage() {
  const t = useTranslations("projectsPage");

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
        <ProjectGrid />
      </Container>
    </main>
  );
}
