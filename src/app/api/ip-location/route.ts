import { NextRequest, NextResponse } from "next/server";

/**
 * Gets the client (user) IP from request headers.
 */
function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return null;
}

const LOCALHOST_IPS = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

function isLocalhost(ip: string | null): boolean {
  if (!ip) return false;
  return LOCALHOST_IPS.has(ip.toLowerCase());
}

/**
 * Proxies IP geolocation using ipapi.co (free HTTPS, no key).
 * ip-api.com free tier does not support HTTPS (requires paid key).
 */
export async function GET(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    if (isLocalhost(clientIp)) {
      console.log("[ip-location] Client IP is localhost:", clientIp, "→ city: null");
      return NextResponse.json({ city: null }, { status: 200 });
    }

    const url = clientIp
      ? `https://ipapi.co/${encodeURIComponent(clientIp)}/json/`
      : "https://ipapi.co/json/";
    console.log("[ip-location] Resolving for client IP:", clientIp ?? "(requesting IP)");

    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data?.error) {
      console.log("[ip-location] ipapi.co error:", data?.reason ?? data?.error, "→ city: null");
      return NextResponse.json({ city: null }, { status: 200 });
    }

    const city = data?.city ?? data?.region ?? null;
    const value =
      typeof city === "string" && city.length > 0 ? city : null;
    console.log("[ip-location] IP geolocation response:", data, "→ resolved city:", value);
    return NextResponse.json({ city: value });
  } catch (err) {
    console.log("[ip-location] Failed to get location from IP:", err);
    return NextResponse.json({ city: null }, { status: 200 });
  }
}
