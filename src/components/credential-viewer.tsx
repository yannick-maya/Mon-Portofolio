"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type SyntheticEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Credential } from "@/lib/credentials";

type CredentialViewerProps = {
  credentials: Credential[];
  selected: Credential;
  onClose: () => void;
  onSelect: (credential: Credential) => void;
};

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2;

export function CredentialViewer({
  credentials: viewableCredentials,
  selected,
  onClose,
  onSelect,
}: CredentialViewerProps) {
  const locale = useLocale() === "en" ? "en" : "fr";
  const t = useTranslations("credentialsPage");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(1);
  const currentIndex = viewableCredentials.findIndex(
    (credential) => credential.id === selected.id,
  );
  const source = selected.fichier || selected.vignette;
  const isPdf = source?.toLowerCase().split("?")[0].endsWith(".pdf") ?? false;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        event.preventDefault();
        onSelect(viewableCredentials[currentIndex - 1]);
      } else if (
        event.key === "ArrowRight" &&
        currentIndex < viewableCredentials.length - 1
      ) {
        event.preventDefault();
        onSelect(viewableCredentials[currentIndex + 1]);
      } else if (event.key === "+" || event.key === "=") {
        setZoom((value) => Math.min(MAX_ZOOM, value + 0.2));
      } else if (event.key === "-") {
        setZoom((value) => Math.max(MIN_ZOOM, value - 0.2));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, onSelect, viewableCredentials]);

  function closeDialog() {
    dialogRef.current?.close();
    onClose();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    closeDialog();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  if (!source) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className="credential-viewer"
      aria-label={t("previewLabel", { title: selected.titre[locale] })}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="credential-viewer__shell">
        <header className="credential-viewer__header">
          <div className="credential-viewer__heading">
            <p>{selected.organisme[locale]}</p>
            <h2>{selected.titre[locale]}</h2>
          </div>
          <button
            className="button button--secondary button--sm"
            type="button"
            onClick={closeDialog}
            autoFocus
          >
            {t("close")}
          </button>
        </header>
        <div className="credential-viewer__toolbar">
          <div className="credential-viewer__navigation">
            <button
              className="button button--secondary button--sm"
              type="button"
              disabled={currentIndex <= 0}
              aria-label={t("previous")}
              onClick={() => onSelect(viewableCredentials[currentIndex - 1])}
            >
              ← <span className="sr-only">{t("previous")}</span>
            </button>
            <button
              className="button button--secondary button--sm"
              type="button"
              disabled={currentIndex < 0 || currentIndex >= viewableCredentials.length - 1}
              aria-label={t("next")}
              onClick={() => onSelect(viewableCredentials[currentIndex + 1])}
            >
              → <span className="sr-only">{t("next")}</span>
            </button>
          </div>
          <div className="credential-viewer__zoom">
            <button
              className="button button--secondary button--sm"
              type="button"
              aria-label={t("zoomOut")}
              disabled={zoom <= MIN_ZOOM}
              onClick={() =>
                setZoom((value) => Math.max(MIN_ZOOM, value - 0.2))
              }
            >
              −
            </button>
            <span aria-live="polite">{Math.round(zoom * 100)}%</span>
            <button
              className="button button--secondary button--sm"
              type="button"
              aria-label={t("zoomIn")}
              disabled={zoom >= MAX_ZOOM}
              onClick={() =>
                setZoom((value) => Math.min(MAX_ZOOM, value + 0.2))
              }
            >
              +
            </button>
          </div>
          {selected.fichier && selected.allowDownload ? (
            <a className="button button--primary button--sm" href={selected.fichier} download>
              {t("download")}
            </a>
          ) : null}
        </div>
        <div className="credential-viewer__content">
          {isPdf ? (
            <object
              className="credential-viewer__document"
              data={`${source}#zoom=${Math.round(zoom * 100)}`}
              type="application/pdf"
              aria-label={t("previewLabel", { title: selected.titre[locale] })}
            >
              <p className="credential-viewer__fallback">
                {t("previewFallback")}{" "}
                <a href={source} target="_blank" rel="noreferrer">
                  {t("view")}
                </a>
              </p>
            </object>
          ) : (
            <Image
              className="credential-viewer__image"
              src={source}
              alt={t("previewLabel", { title: selected.titre[locale] })}
              width={1600}
              height={1200}
              unoptimized
              style={{ transform: `scale(${zoom})` }}
            />
          )}
          <div className="credential-viewer__watermark" aria-hidden="true">
            <span>{t("watermark")}</span>
            <span>{t("watermark")}</span>
            <span>{t("watermark")}</span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
