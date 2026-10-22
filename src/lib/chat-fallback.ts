import faq from "@/data/faq.json";
import type { ChatLocale } from "@/lib/chat-types";

const stopWords = new Set([
  "a",
  "au",
  "aux",
  "avec",
  "comment",
  "quoi",
  "cest",
  "cette",
  "estce",
  "dans",
  "sur",
  "son",
  "ses",
  "elle",
  "does",
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
    const primaryTokens = new Set(
      tokenize(entry.question[locale]).concat(
        entry.keywords.flatMap(tokenize),
      ),
    );
    const answerTokens = new Set(tokenize(entry.answer[locale]));
    const score = [...queryTokens].reduce((total, token) => {
      if (primaryTokens.has(token)) return total + 2;
      if (answerTokens.has(token)) return total + 1;
      return total;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer[locale];
    }
  }

  return bestScore >= 1 ? bestAnswer : undefined;
}

function isSensitiveRequest(query: string) {
  return /\b(date de naissance|birth date|birthday|date of birth|matricule|passport|passeport|identity number|numero d['’]?identite|carte d['’]?identite|phone number|numero de telephone|telephone number|phone|telephone|mobile|whatsapp|qr code|code-barres|barcode)\b/i.test(
    query.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
  );
}

function isUnrelatedRequest(query: string) {
  return /\b(politique|politics|religion|religieux|religious|médical|medical|juridique|legal|diagnostic médical|medical advice)\b/i.test(
    query.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
  );
}

export function buildFallbackAnswer(query: string, locale: ChatLocale) {
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

  const answer = findFaqAnswer(query, locale);
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

  return locale === "fr"
    ? "Je n’ai pas trouvé cette information dans les réponses disponibles. Vous pouvez écrire à Yannick pour en savoir plus. [[UNKNOWN]] [[CONTACT]]\n\nSUGGESTIONS: Quel est son parcours ? | Quels sont ses projets data ? | Comment le contacter ?"
    : "I couldn’t find that information in the available answers. You can contact Yannick to learn more. [[UNKNOWN]] [[CONTACT]]\n\nSUGGESTIONS: What is his background? | What are his data projects? | How can I contact him?";
}
