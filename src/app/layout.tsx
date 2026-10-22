import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Yannick Madjiadoum — Ingénieur informatique",
  description:
    "Portfolio de Yannick Madjiadoum, ingénieur informatique spécialisé en data engineering et bases de données.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${bricolageGrotesque.variable} ${publicSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
