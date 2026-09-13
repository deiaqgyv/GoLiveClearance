import { publicCheckDataset } from "@/lib/public-check-definitions";

export function GET() {
  return Response.json(publicCheckDataset, {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
