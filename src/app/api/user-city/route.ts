import { NextResponse } from "next/server";

const IP_API_URL = "http://ip-api.com/json";

/**
 * Normalize city names for consistent matching:
 * "Jaipur Municipal Corporation" → "jaipur"
 */
function normalizeCityName(city: string): string {
  return city
    .replace(/municipal corporation/i, "")
    .replace(/municipality/i, "")
    .replace(/district/i, "")
    .replace(/city/i, "")
    .trim()
    .toLowerCase();
}

/**
 * GET /api/user-city
 * Proxies ip-api.com to avoid CORS and mixed content.
 * Returns { city: string | null } (normalized city name).
 */
export async function GET() {
  try {
    const res = await fetch(IP_API_URL);
    if (!res.ok) {
      return NextResponse.json({ city: null }, { status: 502 });
    }

    const data = await res.json();
    if (data.status !== "success" || !data.city) {
      return NextResponse.json({ city: null }, { status: 200 });
    }

    const city = normalizeCityName(data.city);
    return NextResponse.json({ city });
  } catch {
    return NextResponse.json({ city: null }, { status: 502 });
  }
}
