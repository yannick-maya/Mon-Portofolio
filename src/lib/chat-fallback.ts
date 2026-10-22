import faq from "@/data/faq.json";
import type { ChatLocale, ChatMessage } from "@/lib/chat-types";

const stopWords = new Set([
  "a",
  "au",
  "aux",
  "avec",
  "comment",
  "quel",
  "quelle",
  "quels",
  "quelles",
  "quoi",
  "cest",
  "cette",
  "estce",
  "dans",
  "sur",
  "son",
  "ses",
  "elle",
  "what",
  "which",
  "who",
  "where",
  "when",
  "why",
  "is",
  "are",
  "his",
  "her",
  "he",
  "she",
  "about",
  "that",
  "one",
  "it",
  "use",
  "does",
  "do",
  "the",
  "like",
  "beginner",
  "simple",
  "debutant",
  "débutant",
  "explique",
  "expliquer",
  "tell",
  "me",
  "please",
  "explain",
  "de",
  "des",
  "du",
  "en",
  "est",
  "et",
  "il",
  "la",
  "le",
  "les",
  "me",
  "mon",
  "ou",
  "pour",
  "que",
  "qui",
  "son",
  "sur",
  "with",
  "how",
  "and",
  "for",
  "from",
  "in",
  "of",
  "to",
]);

function tokenize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

export function findFaqAnswer(query: string, locale: ChatLocale) {
  const queryTokens = new Set(tokenize(query));
  let bestScore = 0;
  let bestAnswer: string | undefined;

  for (const entry of faq) {
    const questionTokens = new Set(tokenize(entry.question[locale]));
    const keywordTokens = new Set(entry.keywords.flatMap(tokenize));
    const answerTokens = new Set(tokenize(entry.answer[locale]));
    const score = [...queryTokens].reduce((total, token) => {
      if (questionTokens.has(token)) return total + 4;
      if (keywordTokens.has(token)) return total + 3;
      if (answerTokens.has(token)) return total + 1;
      return total;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer[locale];
    }
  }

  return bestScore >= 2 ? bestAnswer : undefined;
}

function isSensitiveRequest(query: string) {
  return /\b(date de naissance|anniversaire|birth date|birthday|date of birth|matricule|passport|passeport|identity number|numero d['’]?identite|carte d['’]?identite|phone number|mobile phone number|numero de telephone|telephone number|whatsapp|qr code|code-barres|barcode|his phone|his telephone)\b/i.test(
    query.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
  );
}

function isUnrelatedRequest(query: string) {
  return /\b(politique|politics|political|religion|religieux|religious|médical|medical|juridique|legal|diagnostic médical|medical advice)\b/i.test(
    query.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
  );
}

function isGreeting(query: string) {
  return /^(bonjour|salut|bonsoir|hello|hi|hey|good morning|good afternoon)[!. ]*$/i.test(
    query.trim(),
  );
}

function isGoodbye(query: string) {
  return /^(au revoir|a bientot|bonne journee|bonne soiree|bye|goodbye|see you|take care)[!. ]*$/i.test(
    query.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim(),
  );
}

function isAssistantIdentityQuestion(query: string) {
  return /^(qui es[- ]tu|who are you|what are you)[?!. ]*$/i.test(
    query.trim(),
  );
}

function isFollowUp(query: string) {
  return /\b(et celui[- ]l[aà]|et cette? (?:projet|solution)|ce projet|celui[- ]l[aà]|and that one|what about that|which technologies does it use|what technologies does it use)\b/i.test(
    query.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
  );
}

export function buildFallbackAnswer(
  query: string,
  locale: ChatLocale,
  history: ChatMessage[] = [],
) {
  const suggestionLine =
    locale === "fr"
      ? "SUGGESTIONS: Quel est son parcours ? | Quels sont ses projets data ?"
      : "SUGGESTIONS: What is his background? | What are his data projects?";

  if (isGreeting(query)) {
    const greeting =
      locale === "fr"
        ? "Bonjour ! Je suis l’assistant IA du portfolio de Yannick. Que souhaitez-vous savoir sur son parcours, ses projets ou un terme data ?"
        : "Hello! I’m the AI assistant for Yannick’s portfolio. What would you like to know about his background, projects, or a data term?";
    return `${greeting}\n\n${suggestionLine}`;
  }

  if (isGoodbye(query)) {
    const goodbye =
      locale === "fr"
        ? "Au revoir et merci pour votre visite !"
        : "Goodbye, and thank you for visiting!";
    return `${goodbye}\n\n${suggestionLine}`;
  }

  if (isAssistantIdentityQuestion(query)) {
    const identity =
      locale === "fr"
        ? "Je suis l’assistant IA du portfolio de Yannick, pas Yannick lui-même."
        : "I’m the AI assistant for Yannick’s portfolio, not Yannick himself.";
    return `${identity}\n\n${suggestionLine}`;
  }

  if (isSensitiveRequest(query)) {
    return locale === "fr"
      ? "Je ne peux pas divulguer de données personnelles ou d’informations provenant de documents d’identité. Je peux vous renseigner sur son parcours ou ses projets. [[UNKNOWN]]\n\nSUGGESTIONS: Quel est son parcours ? | Quels sont ses projets data ?"
      : "I can’t disclose personal data or information from identity documents. I can help with questions about his background or projects. [[UNKNOWN]]\n\nSUGGESTIONS: What is his background? | What are his data projects?";
  }

  if (isUnrelatedRequest(query)) {
    return locale === "fr"
      ? "Je ne peux pas aider sur ce sujet, mais je peux vous renseigner sur le portfolio, le parcours ou les projets de Yannick.\n\nSUGGESTIONS: Quel est son parcours ? | Quels sont ses projets data ?"
      : "I can’t help with that topic, but I can answer questions about the portfolio, Yannick’s background, or his projects.\n\nSUGGESTIONS: What is his background? | What are his data projects?";
  }

  const previousUserMessages = history
    .filter((message) => message.role === "user")
    .slice(-2)
    .map((message) => message.content)
    .join(" ");
  const contextualQuery = isFollowUp(query)
    ? `${previousUserMessages} ${query}`
    : query;
  const answer = findFaqAnswer(contextualQuery, locale);
  if (answer) {
    const contactIntent =
      /(?:contact(?:er|e|ing)?|e-?mail|courriel|recrut\w*|collabor\w*|hire|recruit\w*)/i.test(
        query.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
      );
    const contactMarker = contactIntent ? " [[CONTACT]]" : "";
    return locale === "fr"
      ? `${answer}${contactMarker}\n\nSUGGESTIONS: Quel est son parcours ? | Quels sont ses projets data ? | Comment le contacter ?`
      : `${answer}${contactMarker}\n\nSUGGESTIONS: What is his background? | What are his data projects? | How can I contact him?`;
  }

  if (/débutant|beginner|simple/i.test(query)) {
    const beginnerAnswer =
      locale === "fr"
        ? "Je peux simplifier l’explication. Quel terme ou projet souhaitez-vous comprendre ?"
        : "I can simplify the explanation. Which term or project would you like to understand?";
    return `${beginnerAnswer}\n\n${suggestionLine}`;
  }

  return locale === "fr"
    ? "Je n’ai pas trouvé cette information dans les réponses disponibles. Vous pouvez écrire à Yannick pour en savoir plus. [[UNKNOWN]] [[CONTACT]]\n\nSUGGESTIONS: Quel est son parcours ? | Quels sont ses projets data ? | Comment le contacter ?"
    : "I couldn’t find that information in the available answers. You can contact Yannick to learn more. [[UNKNOWN]] [[CONTACT]]\n\nSUGGESTIONS: What is his background? | What are his data projects? | How can I contact him?";
}
