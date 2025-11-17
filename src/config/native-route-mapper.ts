import { deepLinkRoutes, DeepLinkRouteRule } from "./deep-link-routes";

const normalizePath = (path: string): string => path.replace(/^\/+|\/+$/g, "");

const findMatchingRoute = (path: string): DeepLinkRouteRule | undefined =>
  deepLinkRoutes.find((route) => route.pattern.test(path));

/**
 * Maps a normalized web path to its native counterpart using the shared deep link rules.
 */
export function mapNativeRoute(path: string): string {
  const normalizedPath = normalizePath(path);
  const matchedRoute = findMatchingRoute(normalizedPath);
  if (!matchedRoute) {
    return normalizedPath;
  }
  if (matchedRoute.link) {
    return matchedRoute.link;
  }
  return normalizedPath;
}

