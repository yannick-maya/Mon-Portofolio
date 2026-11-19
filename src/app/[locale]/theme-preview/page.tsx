import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ThemePreview } from "@/components/theme-preview";

export default function ThemePreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <Suspense fallback={<div className="theme-preview-loading" aria-label="Chargement de l’aperçu" />}>
      <ThemePreview />
    </Suspense>
  );
}
