"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CredentialViewer } from "@/components/credential-viewer";
import { credentialEntries } from "@/lib/credentials";
import type { Credential } from "@/lib/credentials";

type Category = "all" | "Diplôme" | "Certificat" | "Attestation" | "Compétition";

const filters: { id: Category; message: string }[] = [
  { id: "all", message: "all" },
  { id: "Diplôme", message: "degrees" },
  { id: "Certificat", message: "certificates" },
  { id: "Attestation", message: "attestations" },
  { id: "Compétition", message: "competitions" },
];

export function CredentialGrid() {
  const locale = useLocale() === "en" ? "en" : "fr";
  const t = useTranslations("credentialsPage");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedCredential, setSelectedCredential] =
    useState<Credential | null>(null);
  const visibleCredentials = useMemo(
    () =>
      selectedCategory === "all"
        ? credentialEntries
        : credentialEntries.filter(
            (credential) => credential.categorie.fr === selectedCategory,
          ),
    [selectedCategory],
  );
  const viewableCredentials = useMemo(
    () =>
      visibleCredentials.filter(
        (credential) => credential.fichier || credential.vignette,
      ),
    [visibleCredentials],
  );

  return (
    <>
      <div
        className="project-filters"
        role="group"
        aria-label={t("filterLabel")}
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            aria-pressed={selectedCategory === filter.id}
            className="project-filters__button"
            onClick={() => setSelectedCategory(filter.id)}
            type="button"
          >
            {t(filter.message)}
          </button>
        ))}
      </div>
      {visibleCredentials.length ? (
        <div className="credential-grid" aria-live="polite">
          {visibleCredentials.map((credential) => {
            const preview = credential.vignette || credential.fichier;
            const isViewable = Boolean(preview);

            return (
              <article className="credential-card" key={credential.id}>
                <div className="credential-card__preview">
                  {credential.vignette ? (
                    <Image
                      alt=""
                      className="credential-card__image"
                      fill
                      sizes="(max-width: 48rem) 100vw, 33vw"
                      src={credential.vignette}
                    />
                  ) : (
                    <div
                      className="credential-card__placeholder"
                      aria-hidden="true"
                    >
                      <span>{credential.categorie[locale]}</span>
                    </div>
                  )}
                </div>
                <div className="credential-card__body">
                  <p className="credential-card__category">
                    {credential.categorie[locale]}
                  </p>
                  <h2>{credential.titre[locale]}</h2>
                  <p className="credential-card__issuer">
                    {credential.organisme[locale]}
                  </p>
                  <p className="credential-card__date">
                    {credential.date[locale]}
                  </p>
                  <div className="credential-card__actions">
                    {isViewable ? (
                      <button
                        className="button button--secondary button--sm"
                        type="button"
                        onClick={() => setSelectedCredential(credential)}
                      >
                        {t("view")}
                      </button>
                    ) : (
                      <span className="credential-card__unavailable">
                        {t("unavailable")}
                      </span>
                    )}
                    {credential.lienVerification ? (
                      <a
                        className="credential-card__verified"
                        href={credential.lienVerification}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {t("verified")}
                        <span aria-hidden="true"> ↗</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="empty-state">{t("empty")}</p>
      )}
      <p className="sr-only" aria-live="polite">
        {t("resultCount", { count: visibleCredentials.length })}
      </p>
      {selectedCredential ? (
        <CredentialViewer
          key={selectedCredential.id}
          credentials={viewableCredentials}
          selected={selectedCredential}
          onClose={() => setSelectedCredential(null)}
          onSelect={setSelectedCredential}
        />
      ) : null}
    </>
  );
}
