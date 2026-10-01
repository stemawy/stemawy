import { searchReportableResources } from "@/lib/resource-reporting";

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
