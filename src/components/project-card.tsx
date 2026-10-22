"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import type projects from "@/data/projects.json";
import { Link } from "@/i18n/navigation";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { Tag } from "@/components/ui/tag";

type Project = (typeof projects)[number];

export function ProjectCard({ project }: { project: Project }) {
  const locale = useLocale() === "en" ? "en" : "fr";
  const t = useTranslations("common");
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      className="project-card"
      whileHover={reducedMotion ? undefined : { y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <Link
        aria-label={`${t("viewProject")}: ${project.title[locale]}`}
        className="project-card__link"
        href={`/projets/${project.slug}`}
      >
        <ImagePlaceholder
          alt={t("placeholderImage")}
          className="project-card__image"
          src={project.image}
        />
        <div className="project-card__body">
          <p className="project-card__category">{project.category[locale]}</p>
          <h3>{project.title[locale]}</h3>
          <p className="project-card__summary">{project.summary[locale]}</p>
          <ul className="tag-list" aria-label={t("technologies")}>
            {project.stack.slice(0, 4).map((technology) => (
              <li key={technology}>
                <Tag>{technology}</Tag>
              </li>
            ))}
          </ul>
          <span className="project-card__action">
            {t("viewProject")} <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
