import credentials from "@/data/credentials.json";
import explainers from "@/data/explainers.json";
import faq from "@/data/faq.json";
import glossary from "@/data/glossary.json";
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import timeline from "@/data/timeline.json";

export function retrieve(query: string) {
  void query;
  return JSON.stringify(
    {
      profile,
      timeline,
      projects,
      credentials: credentials.map(
        ({ id, categorie, titre, organisme, date, lienVerification }) => ({
          id,
          categorie,
          titre,
          organisme,
          date,
          lienVerification,
        }),
      ),
      faq,
      glossary,
      explainers,
    },
    null,
    2,
  );
}
