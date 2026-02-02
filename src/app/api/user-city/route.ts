import { NextResponse } from "next/server";

const IP_API_BASE = "http://ip-api.com/json";

/**
 * Get client IP from request headers (set by Vercel/proxies).
 * Without this, ip-api.com sees the server IP (e.g. Ashburn) in production.
 */
function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim() || null;
  }
  return request.headers.get("x-real-ip");
}

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
 * Proxies ip-api.com with the client's IP so we get the user's city, not the server's.
 * Returns { city: string | null } (normalized city name).
 */
export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const url = clientIp ? `${IP_API_BASE}/${clientIp}` : IP_API_BASE;
    const res = await fetch(url);
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
