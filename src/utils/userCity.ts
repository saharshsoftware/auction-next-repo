/**
 * User city detection via /api/user-city (server proxy → ip-api.com).
 * Shared so the API is called once (e.g. in parent) and result can be passed down.
 * Cache is stored in localStorage with a 1-day TTL.
 */

const USER_CITY_CACHE_KEY = "detected_user_city";
const USER_CITY_API = "/api/user-city";
const USER_CITY_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

interface CachedCity {
  city: string;
  expiresAt: number;
}

function getCachedCity(): string | null {
  try {
    const raw = localStorage.getItem(USER_CITY_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedCity | null;
    if (parsed?.city && typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now()) {
      return parsed.city;
    }
    return null;
  } catch {
    return null;
  }
}

function setCachedCity(city: string): void {
  try {
    const payload: CachedCity = {
      city,
      expiresAt: Date.now() + USER_CITY_CACHE_TTL_MS,
    };
    localStorage.setItem(USER_CITY_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore cache write failure
  }
}

/**
 * Fetches user's city from our server proxy (which calls ip-api.com).
 * Response: { city: string | null } (normalized on server).
 */
async function getCityFromUserCityApi(): Promise<string | null> {
  try {
    const res = await fetch(USER_CITY_API);
    if (!res.ok) return null;

    const data = await res.json();
    return data.city ?? null;
  } catch {
    return null;
  }
}

/**
 * Returns detected city, using localStorage cache when available and not expired (TTL: 1 day).
 * Use this in a single place (e.g. parent) and pass the result to children.
 */
export async function detectAndCacheUserCity(): Promise<string | null> {
  try {
    const cached = getCachedCity();
    if (cached) return cached;

    const city = await getCityFromUserCityApi();
    if (city) setCachedCity(city);

    return city;
  } catch {
    return null;
  }
}
