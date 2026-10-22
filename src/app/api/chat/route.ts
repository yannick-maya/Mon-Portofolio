import { createHash } from "node:crypto";
import type { ChatLocale, ChatMessage } from "@/lib/chat-types";
import { createAssistantStream } from "@/lib/llm";
import { checkChatRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BODY_BYTES = 16_000;
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 6;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getClientIp(request: Request) {
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  const forwardedFor =
    vercelForwardedFor ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  return (forwardedIp || "unknown").slice(0, 128);
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function validateHistory(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.length <= MAX_HISTORY_MESSAGES &&
    value.every(
      (message) =>
        isRecord(message) &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.length <= 3000 &&
        (message.role !== "user" ||
          message.content.length <= MAX_MESSAGE_LENGTH),
    )
  );
}

function isChatLocale(value: unknown): value is ChatLocale {
  return value === "fr" || value === "en";
}

async function readBoundedBody(request: Request) {
  if (!request.body) {
    return { body: null, tooLarge: false };
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;

      if (bytesRead > MAX_BODY_BYTES) {
        await reader.cancel();
        return { body: null, tooLarge: true };
      }

      body += decoder.decode(value, { stream: true });
    }

    body += decoder.decode();
    return { body, tooLarge: false };
  } finally {
    reader.releaseLock();
  }
}

function logUnknownQuestion(query: string, locale: ChatLocale) {
  const queryHash = createHash("sha256").update(query).digest("hex");
  console.info("Chatbot could not answer a question.", { locale, queryHash });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Cross-origin requests are not allowed." }, {
      status: 403,
    });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Request body is too large." }, { status: 413 });
  }

  let requestBody: Awaited<ReturnType<typeof readBoundedBody>>;
  try {
    requestBody = await readBoundedBody(request);
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (requestBody.tooLarge) {
    return Response.json({ error: "Request body is too large." }, { status: 413 });
  }

  if (requestBody.body === null) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = JSON.parse(requestBody.body);
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const query = typeof body.message === "string" ? body.message.trim() : "";
  const locale = body.locale;
  const history = body.history ?? [];

  if (
    query.length < 1 ||
    query.length > MAX_MESSAGE_LENGTH ||
    !isChatLocale(locale) ||
    !validateHistory(history)
  ) {
    return Response.json({ error: "Please check the submitted message." }, {
      status: 400,
    });
  }

  const rateLimit = await checkChatRateLimit(getClientIp(request));
  if (!rateLimit.success) {
    return Response.json(
      { error: "Too many messages. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  const stream = await createAssistantStream({
    locale,
    query,
    history,
    onUnknown: () => logUnknownQuestion(query, locale),
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
