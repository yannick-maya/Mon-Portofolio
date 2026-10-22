"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type ContactResponse = {
  fallbackUrl?: string;
  message?: string;
};

export function ContactForm() {
  const t = useTranslations("contactPage");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "fallback" | "error">("idle");
  const [fallbackUrl, setFallbackUrl] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ContactResponse;

      if (result.fallbackUrl) {
        setFallbackUrl(result.fallbackUrl);
        setStatus("fallback");
      } else if (response.ok) {
        form.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      const subject = encodeURIComponent(`Portfolio — ${payload.name}`);
      const body = encodeURIComponent(
        `${payload.message}\n\n${payload.name} · ${payload.email}`,
      );
      setFallbackUrl(
        `mailto:yannickmadjiadoum@gmail.com?subject=${subject}&body=${body}`,
      );
      setStatus("fallback");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>{t("name")}</span>
        <input autoComplete="name" maxLength={120} name="name" required />
      </label>
      <label className="form-field">
        <span>{t("emailLabel")}</span>
        <input
          autoComplete="email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </label>
      <label className="form-field">
        <span>{t("message")}</span>
        <textarea maxLength={5000} minLength={10} name="message" required rows={6} />
      </label>
      <Button disabled={status === "sending"} type="submit">
        {status === "sending" ? t("sending") : t("send")}
      </Button>
      <p
        aria-live="polite"
        className={`form-status${status === "error" ? " form-status--error" : ""}`}
        role={status === "error" ? "alert" : "status"}
      >
        {status === "success" ? t("success") : null}
        {status === "error" ? t("error") : null}
        {status === "fallback" ? (
          <>
            {t("fallback")}{" "}
            <a href={fallbackUrl}>{t("fallbackLink")}</a>
          </>
        ) : null}
      </p>
    </form>
  );
}
