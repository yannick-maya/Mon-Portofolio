import credentials from "@/data/credentials.json";

export type Credential = Omit<
  (typeof credentials)[number],
  "fichier" | "vignette"
> & {
  fichier: string | null;
  vignette: string | null;
  dateSort?: string;
  description?: { fr: string; en: string };
  featured?: boolean;
};

export const credentialEntries: Credential[] = credentials;
