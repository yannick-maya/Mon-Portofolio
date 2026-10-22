import { useLocale, useTranslations } from "next-intl";
import timeline from "@/data/timeline.json";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TimelineProgress } from "@/components/timeline-progress";

export default function TimelinePage() {
  const locale = useLocale() === "en" ? "en" : "fr";
  const t = useTranslations("timelinePage");

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
        <TimelineProgress>
          <ol className="timeline-list">
            {timeline.map((item) => (
              <li className="timeline-entry" key={item.id}>
                <span className="timeline-entry__marker" aria-hidden="true" />
                <details className="timeline-entry__details">
                  <summary>
                    <span className="timeline-entry__period">
                      {item.period[locale]}
                    </span>
                    <span className="timeline-entry__heading">
                      <span>
                        <strong>{item.title[locale]}</strong>
                        <span className="timeline-entry__organization">
                          {item.organization[locale]} · {item.location[locale]}
                        </span>
                      </span>
                      <span className="timeline-entry__toggle" aria-hidden="true">
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
      </Container>
    </main>
  );
}
