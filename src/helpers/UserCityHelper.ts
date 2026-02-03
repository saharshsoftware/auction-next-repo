/**
 * Helpers for user-city API: client IP extraction, public IP check, and city name normalization.
 * Used by GET /api/user-city to proxy ip-api.com with the client's IP.
 */

/**
 * Get client IP from request headers (set by Vercel/proxies).
 * Without this, ip-api.com sees the server IP (e.g. Ashburn) in production.
 */
export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim() || null;
  }
  return request.headers.get("x-real-ip");
}

/**
 * Returns true if the IP is a public, routable address that ip-api.com can geolocate.
 * Private/local IPs (127.0.0.1, ::1, 10.x, 172.16-31.x, 192.168.x) make ip-api.com return status "fail".
 */
export function isPublicIp(ip: string | null): boolean {
  if (!ip || ip.length === 0) return false;
  const trimmed = ip.trim().toLowerCase();
  if (trimmed === "127.0.0.1" || trimmed === "::1" || trimmed === "localhost") return false;
  if (trimmed.startsWith("10.")) return false;
  if (trimmed.startsWith("172.")) {
    const second = parseInt(trimmed.split(".")[1], 10);
    if (second >= 16 && second <= 31) return false;
  }
  if (trimmed.startsWith("192.168.")) return false;
  return true;
}

/**
 * Normalize city names for consistent matching:
 * "Jaipur Municipal Corporation" → "jaipur"
 */
export function normalizeCityName(city: string): string {
  return city
    .replace(/municipal corporation/i, "")
    .replace(/municipality/i, "")
    .replace(/district/i, "")
    .replace(/city/i, "")
    .trim()
    .toLowerCase();
}
