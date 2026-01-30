import { NextRequest, NextResponse } from "next/server";

/**
 * Gets the client (user) IP from request headers.
 * On Vercel: x-forwarded-for, x-real-ip, or x-vercel-forwarded-for.
 */
function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const first = vercelIp.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return null;
}

const LOCALHOST_IPS = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);
/** Fallback IP for localhost so dev gets a city for testing (ipapi.co resolves to Mountain View). */
const LOCALHOST_FALLBACK_IP = "8.8.8.8";

function isLocalhost(ip: string | null): boolean {
  if (!ip) return false;
  return LOCALHOST_IPS.has(ip.toLowerCase());
}

function normalizeCity(value: unknown): string | null {
  const city = value == null ? null : String(value).trim();
  return typeof city === "string" && city.length > 0 ? city : null;
}

/**
 * ReallyFreeGeoIP.org — no rate limit, no key, returns city/region.
 * https://reallyfreegeoip.org/json/{ip}
 */
async function fetchCityFromReallyFreeGeoIP(ip: string): Promise<string | null> {
  try {
    const res = await fetch(`https://reallyfreegeoip.org/json/${encodeURIComponent(ip)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { city?: string; region_name?: string; region_code?: string };
    return normalizeCity(data?.city ?? data?.region_name ?? data?.region_code) ?? null;
  } catch {
    return null;
  }
}

/**
 * Fallback: ipinfo.io (has rate limits; used when primary fails).
 */
async function fetchCityFromIpinfo(ip: string): Promise<string | null> {
  try {
    const res = await fetch(`https://ipinfo.io/${encodeURIComponent(ip)}/json`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { city?: string; region?: string };
    return normalizeCity(data?.city ?? data?.region) ?? null;
  } catch {
    return null;
  }
}

/**
 * Proxies IP geolocation: Vercel geo headers (Pro/Enterprise), then ReallyFreeGeoIP (no rate limit), then ipinfo.io fallback.
 * On localhost, uses a fallback IP so dev gets a city for testing.
 */
export async function GET(request: NextRequest) {
  try {
    // 1) Vercel Pro/Enterprise: use built-in geo headers (no external API)
    const vercelCity = request.headers.get("x-vercel-ip-city");
    if (vercelCity) {
      const city = normalizeCity(vercelCity);
      if (city) {
        return NextResponse.json({ city });
      }
    }

    const clientIp = getClientIp(request);
    const isLocal = isLocalhost(clientIp);
    // 2) For localhost, use a fallback IP so local dev gets a city
    const ipToLookup = isLocal ? LOCALHOST_FALLBACK_IP : clientIp;

    if (!ipToLookup) {
      console.log("[ip-location] No client IP in headers → city: null");
      return NextResponse.json({ city: null }, { status: 200 });
    }

    if (isLocal) {
      console.log("[ip-location] Localhost detected, using fallback IP for lookup:", ipToLookup);
    }

    // 3) Primary: ReallyFreeGeoIP.org (no rate limit, no API key)
    const fromPrimary = await fetchCityFromReallyFreeGeoIP(ipToLookup);
    if (fromPrimary) {
      return NextResponse.json({ city: fromPrimary });
    }

    // 4) Fallback: ipinfo.io (when primary is down or returns no city)
    const fromIpinfo = await fetchCityFromIpinfo(ipToLookup);
    if (fromIpinfo) {
      return NextResponse.json({ city: fromIpinfo });
    }

    return NextResponse.json({ city: null }, { status: 200 });
  } catch (err) {
    console.log("[ip-location] Failed to get location from IP:", err);
    return NextResponse.json({ city: null }, { status: 200 });
  }
}
