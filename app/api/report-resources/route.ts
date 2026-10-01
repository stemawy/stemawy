import {
  getReportableResourcesByKeys,
  searchReportableResources,
} from "@/lib/resource-reporting";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const language = url.searchParams.get("lang") === "ar" ? "ar" : "en";
  const requestedLimit = Number(url.searchParams.get("limit")) || 40;
  const limit = Math.min(100, Math.max(1, requestedLimit));

  return Response.json(searchReportableResources(query, language, limit), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ resources: [] }, { status: 400 });
  }

  const payload = body as { keys?: unknown; language?: unknown };
  const keys = Array.isArray(payload.keys)
    ? payload.keys.filter((key): key is string => typeof key === "string")
    : [];
  const language = payload.language === "ar" ? "ar" : "en";

  return Response.json({
    resources: getReportableResourcesByKeys(keys, language),
  });
}
