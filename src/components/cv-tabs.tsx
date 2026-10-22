"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";

type Locale = "fr" | "en";

type CvTabsProps = {
  files: Record<Locale, string | null>;
};

const languages: { locale: Locale; labelKey: "frenchTab" | "englishTab" }[] = [
  { locale: "fr", labelKey: "frenchTab" },
  { locale: "en", labelKey: "englishTab" },
];

export function CvTabs({ files }: CvTabsProps) {
  const t = useTranslations("cvPage");
  const [activeLocale, setActiveLocale] = useState<Locale>("fr");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    let nextIndex: number | undefined;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % languages.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex + languages.length - 1) % languages.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = languages.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextLocale = languages[nextIndex].locale;
    setActiveLocale(nextLocale);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section className="cv-section" aria-label={t("title")}>
      <div className="cv-tabs" role="tablist" aria-label={t("title")}>
        {languages.map(({ locale, labelKey }, index) => (
          <button
            key={locale}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={`cv-tab-${locale}`}
            className="cv-tab"
            type="button"
            role="tab"
            aria-selected={activeLocale === locale}
            aria-controls={`cv-panel-${locale}`}
            tabIndex={activeLocale === locale ? 0 : -1}
            onClick={() => setActiveLocale(locale)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
      {languages.map(({ locale, labelKey }) => {
        const file = files[locale];
        const languageLabel = t(labelKey);

        return (
          <div
            key={locale}
            id={`cv-panel-${locale}`}
            className="cv-panel"
            role="tabpanel"
            aria-labelledby={`cv-tab-${locale}`}
            hidden={activeLocale !== locale}
            tabIndex={0}
          >
            {file ? (
              <>
                <div className="cv-actions">
                  <a className="button button--primary" href={file} download>
                    {t("download")}
                  </a>
                  <a
                    className="button button--secondary"
                    href={file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("open")}
                  </a>
                </div>
                <object
                  className="cv-document-frame"
                  data={`${file}#view=FitH`}
                  type="application/pdf"
                  aria-label={t("previewLabel", { language: languageLabel })}
                >
                  <p className="cv-preview-fallback">
                    {t("previewFallback")}{" "}
                    <a href={file} target="_blank" rel="noreferrer">
                      {t("open")}
                    </a>
                  </p>
                </object>
              </>
            ) : (
              <div className="cv-unavailable" role="status">
                <p>{t("unavailable")}</p>
                <a
                  className="button button--secondary"
                  href={`mailto:yannickmadjiadoum@gmail.com?subject=${encodeURIComponent(
                    `CV ${locale.toUpperCase()} de Yannick Madjiadoum`,
                  )}`}
                >
                  {t("requestCopy")}
                </a>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
