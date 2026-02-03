import { getClientIp, isPublicIp, normalizeCityName } from "@/helpers/UserCityHelper";
import { NextResponse } from "next/server";

const IP_API_BASE = "http://ip-api.com/json";

/**
 * GET /api/user-city
 * Proxies ip-api.com with the client's IP so we get the user's city, not the server's.
 * Returns { city: string | null } (normalized city name).
 */
export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    // Only pass client IP when it's public; private/local IPs (e.g. localhost) make ip-api.com return status "fail"
    const url = isPublicIp(clientIp) ? `${IP_API_BASE}/${clientIp}` : IP_API_BASE;
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
