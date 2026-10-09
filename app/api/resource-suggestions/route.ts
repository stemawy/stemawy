import { MAX_FEEDBACK_PAYLOAD_BYTES } from "@/lib/feedback-validation";
import {
  checkFeedbackRateLimit,
  getFeedbackClientKey,
} from "@/lib/feedback-rate-limit";
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

function getBackendApiBase(): string {
  const configuredBase =
    process.env.NEXT_PUBLIC_STEMAWY_API_URL ??
    process.env.STEMAWY_API_URL ??
    "http://127.0.0.1:8000/api";
  return configuredBase.replace(/\/+$/, "");
}

async function proxySuggestionToBackend(payload: unknown) {
  const backendUrl = `${getBackendApiBase()}/resource-suggestions/`;
  return fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
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

  try {
    const response = await proxySuggestionToBackend(validation.payload);
    const result = (await response.json().catch(() => ({}))) as {
      error?: string;
      retryAfterSeconds?: number;
      fields?: Record<string, string>;
    };

    if (response.status === 429) {
      return Response.json(
        {
          error: "rate_limited",
          retryAfterSeconds: result.retryAfterSeconds ?? 60,
        },
        {
          status: 429,
          headers: { "Retry-After": String(result.retryAfterSeconds ?? 60) },
        },
      );
    }

    if (!response.ok) {
      return Response.json(
        {
          error: result.error ?? "email_delivery_failed",
          fields: result.fields,
        },
        { status: response.status },
      );
    }

    return Response.json({ accepted: true }, { status: 202 });
  } catch {
    return Response.json({ error: "email_delivery_failed" }, { status: 502 });
  }
}
