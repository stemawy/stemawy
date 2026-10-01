import { searchStemawy } from "@/lib/search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const language = url.searchParams.get("lang") === "ar" ? "ar" : "en";
  const requestedLimit = Number(url.searchParams.get("limit")) || 4;
  const limit = Math.min(250, Math.max(1, requestedLimit));

  return Response.json(searchStemawy(query, language, limit), {
    headers: { "Cache-Control": "no-store" },
  });
}
