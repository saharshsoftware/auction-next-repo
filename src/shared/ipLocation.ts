/**
 * Gets user's city from IP via our API route (server-side proxy).
 * Used when the client cannot call ip geolocation directly (e.g. CORS / HTTPS).
 * Returns city name or null if fetch fails or no city.
 */
export async function getLocationFromIP(): Promise<string | null> {
  try {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXTAUTH_URL ?? "";
    const response = await fetch(`${base}/api/ip-location`);
    const data = await response.json();
    const city = data?.city ?? null;
    return typeof city === "string" && city.length > 0 ? city : null;
  } catch (err) {
    console.log("[getLocationFromIP] Failed to fetch user location:", err);
    return null;
  }
}
