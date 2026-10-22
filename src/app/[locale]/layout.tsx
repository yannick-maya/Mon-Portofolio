import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LocaleSwitcher } from "@/components/locale-switcher";
import "../globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFrench = locale === "fr";

  return {
    title: isFrench
      ? "Yannick Madjiadoum — Ingénieur informatique"
      : "Yannick Madjiadoum — Computer Engineer",
    description: isFrench
      ? "Portfolio de Yannick Madjiadoum, ingénieur informatique spécialisé en data engineering et bases de données."
      : "Portfolio of Yannick Madjiadoum, a computer engineer specializing in data engineering and databases.",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${bricolageGrotesque.variable} ${publicSans.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <header className="site-header">
            <LocaleSwitcher />
          </header>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
