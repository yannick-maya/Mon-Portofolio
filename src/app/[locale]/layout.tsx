import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat-widget";
import profile from "@/data/profile.json";
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
    title: `${profile.name[isFrench ? "fr" : "en"]} — ${
      profile.title[isFrench ? "fr" : "en"]
    }`,
    description: isFrench
      ? `Portfolio de ${profile.name.fr}. ${profile.heroDescription.fr}`
      : `Portfolio of ${profile.name.en}. ${profile.heroDescription.en}`,
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
          <SiteHeader name={profile.name[locale]} />
          {children}
          <SiteFooter />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
