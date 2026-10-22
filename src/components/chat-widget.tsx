"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Locale = "fr" | "en";
type MessageRole = "user" | "assistant";

type ChatMessage = {
  role: MessageRole;
  content: string;
  suggestions?: string[];
  showContact?: boolean;
};

const hiddenMetadataPattern = /\n?SUGGESTIONS:[\s\S]*$/i;

function getVisibleText(text: string) {
  return text
    .replace(hiddenMetadataPattern, "")
    .replace(/\[\[(?:CONTACT|UNKNOWN)\]\]/g, "")
    .trim();
}

function parseAssistantResponse(text: string) {
  const suggestionsMatch = text.match(/(?:^|\n)SUGGESTIONS:\s*(.*)$/i);
  const suggestions = suggestionsMatch?.[1]
    .split("|")
    .map((suggestion) => suggestion.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    content: getVisibleText(text),
    suggestions,
    showContact: text.includes("[[CONTACT]]"),
  };
}

export function ChatWidget() {
  const locale = (useLocale() === "en" ? "en" : "fr") as Locale;
  const t = useTranslations("chatWidget");
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isOpen]);

  useEffect(() => {
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  async function sendMessage(
    event: FormEvent<HTMLFormElement> | null,
    suggestedQuestion?: string,
  ) {
    event?.preventDefault();
    const message = (suggestedQuestion ?? input).trim();
    if (!message || isLoading) return;

    const previousMessages = messages;
    const assistantIndex = previousMessages.length + 1;
    setInput("");
    setIsLoading(true);
    setMessages([
      ...previousMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          message,
          history: previousMessages.slice(-6).map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok) {
        let errorMessage = t("error");
        if (response.status === 429) {
          errorMessage = t("rateLimited");
        } else {
          try {
            const body: unknown = await response.json();
            if (
              typeof body === "object" &&
              body !== null &&
              "error" in body &&
              typeof body.error === "string"
            ) {
              errorMessage = body.error;
            }
          } catch {
            errorMessage = t("error");
          }
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error(t("error"));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let rawResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        rawResponse += decoder.decode(value, { stream: true });
        const visibleContent = getVisibleText(rawResponse);
        setMessages((current) =>
          current.map((item, index) =>
            index === assistantIndex
              ? { role: "assistant", content: visibleContent }
              : item,
          ),
        );
      }

      rawResponse += decoder.decode();
      const parsed = parseAssistantResponse(rawResponse);
      setMessages((current) =>
        current.map((item, index) =>
          index === assistantIndex
            ? { role: "assistant", ...parsed }
            : item,
        ),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("error");
      setMessages((current) =>
        current.map((item, index) =>
          index === assistantIndex
            ? { role: "assistant", content: errorMessage }
            : item,
        ),
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(null);
    }
  }

  const starterQuestions = [
    t("suggestionProjects"),
    t("suggestionLakehouse"),
    t("suggestionJourney"),
    t("suggestionContact"),
  ];

  return (
    <div className="chat-widget">
      {isOpen ? (
        <section
          className="chat-panel"
          id="portfolio-chat-panel"
          aria-labelledby="portfolio-chat-title"
        >
          <header className="chat-panel__header">
            <h2 id="portfolio-chat-title">{t("title")}</h2>
            <div className="chat-panel__header-actions">
              <button
                className="chat-panel__icon-button"
                type="button"
                onClick={() => setMessages([])}
                disabled={isLoading || messages.length === 0}
                aria-label={t("clear")}
                title={t("clear")}
              >
                <span aria-hidden="true">↺</span>
              </button>
              <button
                className="chat-panel__icon-button"
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t("close")}
                title={t("close")}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </header>
          <div className="chat-panel__messages" aria-live="polite">
            <div className="chat-message chat-message--assistant">
              {t("greeting")}
            </div>
            {messages.map((message, index) => (
              <div
                className={`chat-message chat-message--${message.role}`}
                key={`${index}-${message.role}`}
              >
                {message.content || (isLoading ? t("sending") : "")}
                {message.showContact ? (
                  <Link className="chat-message__contact" href="/contact">
                    {t("contact")}
                  </Link>
                ) : null}
                {message.suggestions?.length ? (
                  <div className="chat-message__suggestions">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        disabled={isLoading}
                        onClick={() => void sendMessage(null, suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {messages.length === 0 ? (
              <div className="chat-starters">
                <p>{t("suggestionsTitle")}</p>
                {starterQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    disabled={isLoading}
                    onClick={() => void sendMessage(null, question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            ) : null}
            <div ref={endOfMessagesRef} />
          </div>
          <form className="chat-panel__form" onSubmit={(event) => void sendMessage(event)}>
            <label className="sr-only" htmlFor="portfolio-chat-input">
              {t("inputLabel")}
            </label>
            <textarea
              ref={inputRef}
              id="portfolio-chat-input"
              name="message"
              value={input}
              maxLength={500}
              rows={2}
              placeholder={t("placeholder")}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isLoading}
            />
            <button
              className="button button--primary button--sm"
              type="submit"
              disabled={isLoading || input.trim().length === 0}
            >
              {t("send")}
            </button>
          </form>
          <p className="chat-panel__disclaimer">{t("disclaimer")}</p>
        </section>
      ) : null}
      <button
        className="chat-widget__launcher"
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? t("close") : t("open")}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">{isOpen ? "×" : "?"}</span>
      </button>
    </div>
  );
}
