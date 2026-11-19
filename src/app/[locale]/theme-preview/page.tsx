import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ThemePreview } from "@/components/theme-preview";
import { isThemePreviewEnabled } from "@/lib/theme-preview-access";

export default function ThemePreviewPage() {
  if (!isThemePreviewEnabled()) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <main className="theme-preview-loading" aria-busy="true">
          Aperçu du thème…
        </main>
      }
    >
      <ThemePreview />
    </Suspense>
  );
}
