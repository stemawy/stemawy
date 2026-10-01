import nodemailer from "nodemailer";

import {
  checkFeedbackRateLimit,
  getFeedbackClientKey,
  MAX_FEEDBACK_PAYLOAD_BYTES,
} from "@/lib/feedback-validation";
import { validateResourceSuggestion } from "@/lib/resource-suggestion";

export const runtime = "nodejs";

async function readBoundedBody(request: Request): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_FEEDBACK_PAYLOAD_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_FEEDBACK_PAYLOAD_BYTES) {
    return Response.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    const boundedBody = await readBoundedBody(request);
    if (boundedBody === null) {
      return Response.json({ error: "payload_too_large" }, { status: 413 });
    }
    body = JSON.parse(boundedBody);
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const validation = validateResourceSuggestion(body);
  if (!validation.payload) {
    return Response.json(
      { error: "validation_failed", fields: validation.fields },
      { status: 400 },
    );
  }
  if (validation.payload.companyWebsite) {
    return Response.json({ accepted: true }, { status: 202 });
  }

  const gmailUser = process.env.FEEDBACK_GMAIL_USER;
  const appPassword = process.env.FEEDBACK_GMAIL_APP_PASSWORD;
  const to = process.env.FEEDBACK_TO_EMAIL || "youssefbhaa2010@gmail.com";
  if (!gmailUser || !appPassword) {
    return Response.json({ error: "delivery_not_configured" }, { status: 503 });
  }

  const rateLimit = checkFeedbackRateLimit(getFeedbackClientKey(request));
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "rate_limited", retryAfterSeconds: rateLimit.retryAfterSeconds },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const text = [
    `Resource title: ${validation.payload.title}`,
    `Resource URL: ${validation.payload.url}`,
    `Type: ${validation.payload.resourceType}`,
    `Subject or unit: ${validation.payload.subject || "Not specified"}`,
    `Suggested by: ${validation.payload.email || "Not provided"}`,
    "",
    "Why this resource should be added:",
    validation.payload.description,
  ].join("\n");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: appPassword },
    });

    await transporter.sendMail({
      from: { name: "Stemawy Resource Suggestion", address: gmailUser },
      to,
      subject: `Resource suggestion: ${validation.payload.title}`,
      text,
      ...(validation.payload.email
        ? { replyTo: validation.payload.email }
        : {}),
    });
  } catch {
    return Response.json({ error: "email_delivery_failed" }, { status: 502 });
  }

  return Response.json({ accepted: true }, { status: 202 });
}
