import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messages = {
  fr: {
    languageSwitcher: {
      label: "Changer de langue",
      french: "Français",
      english: "Anglais",
    },
    home: {
      status: "Portfolio en construction",
      contact: "Me contacter",
      github: "Voir GitHub",
    },
  },
  en: {
    languageSwitcher: {
      label: "Change language",
      french: "French",
      english: "English",
    },
    home: {
      status: "Portfolio in progress",
      contact: "Contact me",
      github: "View GitHub",
    },
  },
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});
