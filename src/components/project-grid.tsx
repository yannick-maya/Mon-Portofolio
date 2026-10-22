"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import projects from "@/data/projects.json";
import { ProjectCard } from "@/components/project-card";

const filters = [
  { id: "all", message: "all" },
  { id: "data-engineering", message: "dataEngineering" },
  { id: "data-science", message: "dataScience" },
  { id: "dataviz", message: "dataviz" },
  { id: "development", message: "development" },
  { id: "sig", message: "gis" },
] as const;

export function ProjectGrid() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const locale = useLocale();
  const t = useTranslations("projectsPage");
  const filteredProjects = useMemo(
    () =>
      selectedFilter === "all"
        ? projects
        : projects.filter((project) =>
            project.categories.includes(
              selectedFilter as (typeof project.categories)[number],
            ),
          ),
    [selectedFilter],
  );

  return (
    <>
      <div className="project-filters" role="group" aria-label={t("filterLabel")}>
        {filters.map((filter) => (
          <button
            aria-pressed={selectedFilter === filter.id}
            className="project-filters__button"
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            type="button"
          >
            {t(filter.message)}
          </button>
        ))}
      </div>
      {filteredProjects.length ? (
        <div className="project-grid" aria-live="polite">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="empty-state">{t("empty")}</p>
      )}
      <span className="sr-only" aria-live="polite">
        {locale === "fr"
          ? `${filteredProjects.length} projets affichés`
          : `${filteredProjects.length} projects shown`}
      </span>
    </>
  );
}
