export type ChatLocale = "fr" | "en";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
