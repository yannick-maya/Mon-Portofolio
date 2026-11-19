"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatedName, HeroContours } from "@/components/hero-contours";
import { ContactForm } from "@/components/contact-form";
import { CredentialGrid } from "@/components/credential-grid";
import { CvTabs } from "@/components/cv-tabs";
import { ProjectGrid } from "@/components/project-grid";
import { TimelineProgress } from "@/components/timeline-progress";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import contact from "@/data/contact.json";
import cv from "@/data/cv.json";
import profile from "@/data/profile.json";
import timeline from "@/data/timeline.json";

type ThemeName = "A" | "B" | "C";
type PreviewMode = "home" | "light";

type DashboardPalette = {
  background: string;
  foreground: string;
  surface: string;
  border: string;
  accent: string;
};

const themes: { id: ThemeName; label: string }[] = [
  { id: "A", label: "themeA" },
  { id: "B", label: "themeB" },
  { id: "C", label: "themeC" },
];

const dashboardFallback: DashboardPalette = {
  background: "#f4f6f8",
  foreground: "#152337",
  surface: "#ffffff",
  border: "#738195",
  accent: "#875500",
};

function dashboardDocument(
  palette: DashboardPalette,
  labels: {
    title: string;
    visits: string;
    coverage: string;
    sources: string;
    activity: string;
  },
) {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 1.25rem; background: ${palette.background}; color: ${palette.foreground}; font: 14px/1.5 Arial, sans-serif; }
      h1 { margin: 0 0 1rem; font-size: 1.25rem; }
      .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: .75rem; }
      .metric, .chart { border: 1px solid ${palette.border}; background: ${palette.surface}; padding: 1rem; }
      .metric span { display: block; opacity: .8; }
      .metric strong { display: block; margin-top: .5rem; font-size: 1.5rem; }
      .chart { margin-top: .75rem; }
      svg { display: block; width: 100%; height: 7rem; }
      path { fill: none; stroke: ${palette.accent}; stroke-width: 4; }
    </style>
  </head>
  <body>
    <main>
      <h1>${labels.title}</h1>
      <section class="metrics" aria-label="Résumé des indicateurs">
        <article class="metric"><span>${labels.visits}</span><strong>3,28 M</strong></article>
        <article class="metric"><span>${labels.coverage}</span><strong>87 %</strong></article>
        <article class="metric"><span>${labels.sources}</span><strong>12</strong></article>
      </section>
      <section class="chart">
        <strong>${labels.activity}</strong>
        <svg viewBox="0 0 600 120" role="img" aria-label="${labels.activity}">
          <path d="M5 95 C 55 80, 70 35, 120 62 S 205 100, 250 55 S 330 68, 380 32 S 460 72, 510 24 S 565 40, 595 8" />
        </svg>
      </section>
    </main>
  </body>
</html>`;
}

export function ThemePreview() {
  const locale = useLocale() === "en" ? "en" : "fr";
  const searchParams = useSearchParams();
  const previewT = useTranslations("themePreview");
  const projectsT = useTranslations("projectsPage");
  const credentialsT = useTranslations("credentialsPage");
  const timelineT = useTranslations("timelinePage");
  const cvT = useTranslations("cvPage");
  const contactT = useTranslations("contactPage");
  const homeT = useTranslations("home");
  const currentTheme = searchParams.get("theme")?.toUpperCase();
  const theme: ThemeName =
    currentTheme === "B" || currentTheme === "C" ? currentTheme : "A";
  const [previewMode, setPreviewMode] = useState<PreviewMode>("home");
  const homeRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const home = homeRef.current;
    if (!home) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPreviewMode(entry.isIntersecting ? "home" : "light");
      },
      { threshold: 0.15 },
    );
    observer.observe(home);

    return () => observer.disconnect();
  }, []);

  const dashboardLabels = useMemo(
    () => ({
      title: previewT("dashboardTitle"),
      visits: previewT("dashboardVisits"),
      coverage: previewT("dashboardConversion"),
      sources: previewT("dashboardSessions"),
      activity: previewT("dashboardActivity"),
    }),
    [previewT],
  );

  useEffect(() => {
    const frame = dashboardRef.current;
    if (!frame) return;

    const styles = getComputedStyle(document.documentElement);
    const readColor = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;

    frame.srcdoc = dashboardDocument(
      {
        background: readColor(
          "--page-background",
          dashboardFallback.background,
        ),
        foreground: readColor("--page-text", dashboardFallback.foreground),
        surface: readColor("--surface", dashboardFallback.surface),
        border: readColor("--border", dashboardFallback.border),
        accent: readColor("--page-accent", dashboardFallback.accent),
      },
      dashboardLabels,
    );
  }, [dashboardLabels, theme]);

  function chooseTheme(nextTheme: ThemeName) {
    const query = new URLSearchParams(searchParams.toString());
    query.set("theme", nextTheme);
    window.history.replaceState(null, "", `?${query.toString()}`);
  }

  return (
    <main
      className="theme-preview"
      data-theme={theme.toLowerCase()}
      data-preview-mode={previewMode}
    >
      <section className="theme-preview__controls">
        <Container>
          <div className="theme-preview__controls-copy">
            <p className="eyebrow">{previewT("pageTitle")}</p>
            <p>{previewT("intro")}</p>
          </div>
          <div
            aria-label={previewT("chooseTheme")}
            className="theme-preview__theme-picker"
            role="group"
          >
            {themes.map(({ id, label }) => (
              <button
                aria-pressed={theme === id}
                className="theme-preview__theme-option"
                key={id}
                onClick={() => chooseTheme(id)}
                type="button"
              >
                {previewT(label)}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <header
        className="theme-preview__navigation"
        data-mode={previewMode}
      >
        <a className="theme-preview__brand" href="#preview-home">
          <span aria-hidden="true">YM</span>
          {profile.name[locale]}
        </a>
        <nav aria-label={previewT("pageTitle")}>
          <a href="#preview-home">{previewT("home")}</a>
          <a href="#preview-projects">{previewT("projects")}</a>
          <a href="#preview-credentials">{previewT("credentials")}</a>
          <a href="#preview-timeline">{previewT("journey")}</a>
          <a href="#preview-cv">{previewT("cv")}</a>
          <a href="#preview-contact">{previewT("contact")}</a>
          <a href="#preview-chat">{previewT("chat")}</a>
        </nav>
      </header>

      <section
        aria-labelledby="preview-hero-title"
        className="theme-preview__home"
        id="preview-home"
        ref={homeRef}
      >
        <HeroContours />
        <Container className="landing__layout">
          <div className="landing__copy">
            <p className="landing__eyebrow">
              <span aria-hidden="true" />
              {previewT("homeEyebrow")}
            </p>
            <h1 className="landing__title" id="preview-hero-title">
              <AnimatedName name={profile.name[locale]} />
            </h1>
            <p className="landing__role">{profile.title[locale]}</p>
            <p className="landing__description">
              {profile.heroDescription[locale] || previewT("homeDescription")}
            </p>
            <p className="landing__location">
              {profile.location[locale]} · {profile.origin[locale]}
            </p>
            <div className="landing__actions">
              <a
                className="button button--primary button--lg"
                href="#preview-projects"
              >
                {homeT("viewProjects")}
              </a>
              <a
                className="button button--secondary button--lg"
                href="#preview-cv"
              >
                {homeT("downloadCv")}
              </a>
              <a className="button button--quiet" href="#preview-contact">
                {homeT("contact")}
              </a>
            </div>
          </div>
          <div className="landing__portrait">
            <Image
              alt={homeT("portraitAlt")}
              className="landing__portrait-image"
              height={600}
              priority
              sizes="(max-width: 48rem) 80vw, 36rem"
              src="/images/profile.jpg"
              width={600}
            />
            <div className="landing__portrait-caption">
              <span>{profile.location[locale]}</span>
              <span>{homeT("portraitCaption")}</span>
            </div>
          </div>
        </Container>
      </section>

      <section
        className="theme-preview__section"
        id="preview-projects"
        aria-label={projectsT("title")}
      >
        <Container>
          <SectionHeading
            as="h2"
            description={projectsT("intro")}
            eyebrow={projectsT("eyebrow")}
            title={projectsT("title")}
          />
          <div className="theme-preview__component">
            <ProjectGrid />
          </div>
        </Container>
      </section>

      <section
        className="theme-preview__section theme-preview__section--surface"
        id="preview-timeline"
      >
        <Container>
          <SectionHeading
            as="h2"
            description={timelineT("intro")}
            eyebrow={timelineT("eyebrow")}
            title={timelineT("title")}
          />
          <div className="theme-preview__component">
            <TimelineProgress>
              <ol className="timeline-list">
                {timeline.map((item) => (
                  <li className="timeline-entry" key={item.id}>
                    <span
                      aria-hidden="true"
                      className="timeline-entry__marker"
                    />
                    <details className="timeline-entry__details">
                      <summary>
                        <span className="timeline-entry__period">
                          {item.period[locale]}
                        </span>
                        <span className="timeline-entry__heading">
                          <span>
                            <strong>{item.title[locale]}</strong>
                            {item.organization[locale] ||
                            item.location[locale] ? (
                              <span className="timeline-entry__organization">
                                {item.organization[locale]}
                                {item.organization[locale] &&
                                item.location[locale]
                                  ? " · "
                                  : null}
                                {item.location[locale]}
                              </span>
                            ) : null}
                          </span>
                          <span
                            aria-hidden="true"
                            className="timeline-entry__toggle"
                          >
                            +
                          </span>
                        </span>
                      </summary>
                      <p className="timeline-entry__description">
                        {item.description[locale]}
                      </p>
                    </details>
                  </li>
                ))}
              </ol>
            </TimelineProgress>
          </div>
        </Container>
      </section>

      <section
        className="theme-preview__section"
        id="preview-credentials"
      >
        <Container>
          <SectionHeading
            as="h2"
            description={credentialsT("intro")}
            eyebrow={credentialsT("eyebrow")}
            title={credentialsT("title")}
          />
          <div className="theme-preview__component">
            <CredentialGrid />
          </div>
        </Container>
      </section>

      <section
        className="theme-preview__section theme-preview__section--surface"
        id="preview-dashboard"
      >
        <Container>
          <SectionHeading
            as="h2"
            description={previewT("dashboardDescription")}
            eyebrow={previewT("dashboardTitle")}
            title={previewT("dashboardTitle")}
          />
          <iframe
            className="theme-preview__dashboard"
            loading="lazy"
            ref={dashboardRef}
            sandbox=""
            srcDoc={dashboardDocument(dashboardFallback, dashboardLabels)}
            title={previewT("dashboardTitle")}
          />
        </Container>
      </section>

      <section className="theme-preview__section" id="preview-cv">
        <Container>
          <SectionHeading
            as="h2"
            description={cvT("intro")}
            eyebrow={cvT("eyebrow")}
            title={cvT("title")}
          />
          <div className="theme-preview__component">
            <CvTabs files={cv} />
          </div>
        </Container>
      </section>

      <section
        className="theme-preview__section theme-preview__section--surface"
        id="preview-contact"
      >
        <Container>
          <SectionHeading
            as="h2"
            description={contactT("intro")}
            eyebrow={contactT("eyebrow")}
            title={contactT("title")}
          />
          <div className="theme-preview__component contact-layout">
            <div className="contact-details">
              <a className="contact-method" href={`mailto:${profile.email}`}>
                <span>{contactT("email")}</span>
                <strong>{profile.email}</strong>
              </a>
              {contact.additionalEmails.map((email) => (
                <a
                  className="contact-method"
                  href={`mailto:${email}`}
                  key={email}
                >
                  <span>{contactT("alternateEmail")}</span>
                  <strong>{email}</strong>
                </a>
              ))}
            </div>
            <section className="contact-form-panel">
              <h3>{contactT("formTitle")}</h3>
              <ContactForm preview />
            </section>
          </div>
        </Container>
      </section>
    </main>
  );
}
