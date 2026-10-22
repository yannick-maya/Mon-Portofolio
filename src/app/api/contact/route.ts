import { Resend } from "resend";
import profile from "@/data/profile.json";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function makeMailto(name: string, email: string, message: string) {
  const subject = encodeURIComponent(`Portfolio — ${name}`);
  const body = encodeURIComponent(`${message}\n\n${name} · ${email}`);
  return `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (
    name.length < 1 ||
    name.length > 120 ||
    email.length > 254 ||
    !emailPattern.test(email) ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return Response.json({ error: "Please check the submitted fields." }, { status: 400 });
  }

  const fallbackUrl = makeMailto(name, email, message);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return Response.json({ fallbackUrl });
  }

  const from = process.env.CONTACT_FROM_EMAIL;
  if (!from) {
    console.error("Contact email is configured without CONTACT_FROM_EMAIL.");
    return Response.json(
      { error: "The contact service is not configured correctly.", fallbackUrl },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: profile.email,
      replyTo: email,
      subject: `Portfolio contact — ${name}`,
      text: `${message}\n\n${name} · ${email}`,
    });

    if (error) {
      console.error("Contact email delivery failed.");
      return Response.json(
        { error: "Email delivery failed.", fallbackUrl },
        { status: 502 },
      );
    }
  } catch {
    console.error("Contact email provider request failed.");
    return Response.json(
      { error: "Email provider request failed.", fallbackUrl },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
