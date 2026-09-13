import { benchmarkPublicationStatus } from "@/lib/benchmark-aggregation";

export function GET() {
  return Response.json(benchmarkPublicationStatus, { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
