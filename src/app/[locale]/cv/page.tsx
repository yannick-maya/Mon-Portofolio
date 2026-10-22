import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CvTabs } from "@/components/cv-tabs";
import cv from "@/data/cv.json";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isEnglish = locale === "en";

  return {
    title: isEnglish ? "Résumé" : "CV",
    description: isEnglish
      ? "View Yannick Madjiadoum’s résumé in French or English."
      : "Consulter le CV de Yannick Madjiadoum en français ou en anglais.",
  };
}

export default async function CvPage() {
  const t = await getTranslations("cvPage");

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
        <CvTabs files={cv} />
      </Container>
    </main>
  );
}
