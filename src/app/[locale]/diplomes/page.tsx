import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { CredentialGrid } from "@/components/credential-grid";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isEnglish = locale === "en";

  return {
    title: isEnglish ? "Degrees and certificates" : "Diplômes et certificats",
    description: isEnglish
      ? "Browse Yannick Madjiadoum’s degrees, certificates, and attestations."
      : "Parcourir les diplômes, certificats et attestations de Yannick Madjiadoum.",
  };
}

export default async function CredentialsPage() {
  const t = await getTranslations("credentialsPage");

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
        <CredentialGrid />
      </Container>
    </main>
  );
}
