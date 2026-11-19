"use client";

import { lazy, Suspense, useState } from "react";
import { useTranslations } from "next-intl";

const ChatWidget = lazy(() =>
  import("@/components/chat-widget").then((module) => ({
    default: module.ChatWidget,
  })),
);

export function ChatWidgetLoader() {
  const t = useTranslations("chatWidget");
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return (
      <Suspense
        fallback={
          <div className="chat-widget">
            <button
              aria-expanded="true"
              aria-label={t("open")}
              className="chat-widget__launcher"
              disabled
              type="button"
            >
              <span aria-hidden="true">?</span>
            </button>
          </div>
        }
      >
        <ChatWidget initiallyOpen />
      </Suspense>
    );
  }

  return (
    <div className="chat-widget">
      <button
        aria-expanded="false"
        aria-label={t("open")}
        className="chat-widget__launcher"
        onClick={() => setIsLoaded(true)}
        type="button"
      >
        <span aria-hidden="true">?</span>
      </button>
    </div>
  );
}
