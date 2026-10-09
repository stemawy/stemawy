import { createHash } from "node:crypto";

export const FEEDBACK_RATE_LIMIT = 3;
export const FEEDBACK_RATE_WINDOW_MS = 15 * 60 * 1000;

type SubmissionWindow = Map<string, number[]>;
type FeedbackGlobal = typeof globalThis & {
  __stemawyFeedbackSubmissions?: SubmissionWindow;
};

const feedbackGlobal = globalThis as FeedbackGlobal;
const submissionWindows =
  feedbackGlobal.__stemawyFeedbackSubmissions ?? new Map<string, number[]>();
feedbackGlobal.__stemawyFeedbackSubmissions = submissionWindows;

export function getFeedbackClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp =
    request.headers.get("x-real-ip")?.trim() ||
    forwardedFor?.split(",")[0]?.trim() ||
    "unknown";

  return createHash("sha256").update(clientIp).digest("hex");
}

export function checkFeedbackRateLimit(
  clientKey: string,
  now = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  const windowStart = now - FEEDBACK_RATE_WINDOW_MS;
  const recent = (submissionWindows.get(clientKey) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (recent.length >= FEEDBACK_RATE_LIMIT) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((recent[0] + FEEDBACK_RATE_WINDOW_MS - now) / 1000),
    );
    submissionWindows.set(clientKey, recent);
    return { allowed: false, retryAfterSeconds };
  }

  recent.push(now);
  submissionWindows.set(clientKey, recent);

  if (submissionWindows.size > 5000) {
    for (const [key, timestamps] of submissionWindows) {
      if (timestamps.every((timestamp) => timestamp <= windowStart)) {
        submissionWindows.delete(key);
      }
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
