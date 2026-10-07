import { searchStemawy } from "@/lib/search";
import { fetchDjangoSearch } from "@/lib/django-api";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const language = url.searchParams.get("lang") === "ar" ? "ar" : "en";
  const requestedLimit = Number(url.searchParams.get("limit")) || 4;
  const limit = Math.min(250, Math.max(1, requestedLimit));

  const databaseResults = await fetchDjangoSearch(query, language, limit);
  return Response.json(
    databaseResults ?? searchStemawy(query, language, limit),
    {
      headers: {
        "Cache-Control": "public, max-age=15",
        "Vercel-CDN-Cache-Control":
          "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
