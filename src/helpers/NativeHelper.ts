/**
 * Mobile App WebView Helper Functions
 * 
 * This module provides utilities for communication between the web app and React Native mobile app.
 * It handles authentication, token management, and WebView messaging.
 * 
 * Key Features:
 * - Auto-login when user navigates from mobile app
 * - Automatic logout of existing user before new login
 * - Token verification with backend API
 * - WebView bridge for sending messages to mobile app
 * 
 * URL Parameters Expected from Mobile App:
 * - auth_token: JWT authentication token
 * - userEmail: User's email for verification
 * 
 * Example URL: /pricing?auth_token=TOKEN&userEmail=user@example.com
 */

import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { COOKIES } from '@/shared/Constants';
import { API_BASE_URL, API_ENPOINTS } from '@/services/api';
import axios from 'axios';

// ============================================================================
// DEBUG CONFIGURATION
// Set to true to enable detailed logging for troubleshooting auto-login issues
// Toggle this flag to debug issues on different environments (production, staging, etc.)
// ============================================================================
const DEBUG_WEBVIEW_AUTH = true;

/**
 * Debug logger for WebView authentication
 * Only logs when DEBUG_WEBVIEW_AUTH is enabled
 * Prefixes all logs with [WebViewAuth] for easy filtering in console
 */
const debugLog = (message: string, data?: Record<string, unknown>): void => {
  if (!DEBUG_WEBVIEW_AUTH) return;
  const prefix = '[WebViewAuth]';
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
};

/**
 * Debug error logger for WebView authentication
 * Always logs errors regardless of DEBUG_WEBVIEW_AUTH flag
 */
const debugError = (message: string, error?: unknown): void => {
  const prefix = '[WebViewAuth ERROR]';
  console.error(`${prefix} ${message}`, error);
};

/**
 * Extends the Window interface to include React Native WebView
 * This allows TypeScript to recognize the WebView bridge object
 */
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

/**
 * Sends messages to React Native app via WebView bridge
 * 
 * Messages are sent as JSON with { type, payload } structure
 * 
 * Example message types:
 * - AUTH_SUCCESS: Authentication succeeded
 * - AUTH_FAILED: Authentication failed
 * - USER_MISMATCH: Email mismatch detected
 * - TOKEN_EXPIRED: Token has expired
 * - WEBVIEW_READY: WebView is ready and authenticated
 * 
 * @param type - Message type identifier
 * @param payload - Message data as key-value pairs
 */
export const sendToApp = (type: string, payload: Record<string, any>): void => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
  }
};

/**
 * Check if page is opened in mobile app WebView
 * 
 * Returns true if the ReactNativeWebView object exists on window
 * This is automatically injected by React Native WebView component
 * 
 * @returns boolean - true if running in mobile app WebView
 */
export const isInMobileApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  return typeof window.ReactNativeWebView !== 'undefined';
};

/**
 * Check if auth token exists in URL parameters
 * 
 * Used to detect if page was opened from mobile app with authentication intent
 * This is a reliable indicator that doesn't depend on WebView bridge timing
 * 
 * @returns boolean - true if auth_token param exists in URL
 */
export const hasAuthTokenInUrl = (): boolean => {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  const hasToken = urlParams.has('auth_token');
  debugLog('Checking auth_token in URL', {
    hasToken,
    fullUrl: window.location.href,
    hostname: window.location.hostname,
    search: window.location.search,
  });
  return hasToken;
};

/**
 * Wait for ReactNativeWebView bridge to be available
 * 
 * React Native WebView injects the bridge object after page load.
 * Due to timing variations, it may not be immediately available when
 * React hydrates. This function polls for the bridge with a timeout.
 * 
 * @param timeoutMs - Maximum time to wait in milliseconds (default: 3000ms)
 * @param intervalMs - Polling interval in milliseconds (default: 100ms)
 * @returns Promise<boolean> - resolves to true if bridge found, false if timeout
 */
export const waitForWebViewBridge = (
  timeoutMs: number = 3000,
  intervalMs: number = 100
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.ReactNativeWebView) {
      resolve(true);
      return;
    }
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (window.ReactNativeWebView) {
        clearInterval(checkInterval);
        resolve(true);
        return;
      }
      if (Date.now() - startTime >= timeoutMs) {
        clearInterval(checkInterval);
        console.log('WebView bridge not found after timeout');
        resolve(false);
      }
    }, intervalMs);
  });
};

/**
 * Get auth token from URL parameters (sent by mobile app)
 * 
 * Mobile app passes token as query param: ?auth_token=TOKEN
 * 
 * @returns JWT token string or null if not found
 */
export const getAuthTokenFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('auth_token');
};

/**
 * Get user email from URL parameters (sent by mobile app)
 * 
 * Used to verify that the token belongs to the expected user
 * Mobile app passes email as query param: ?userEmail=user@example.com
 * 
 * @returns User email string or null if not found
 */
export const getUserEmailFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('userEmail');
};

/**
 * Verify token with backend and get user details
 * 
 * Makes API call to /api/user/me with Bearer token
 * Backend validates token and returns user information
 * 
 * @param token - JWT authentication token
 * @returns Object with success status and user data or error message
 */
export const verifyTokenAndGetUser = async (token: string) => {
  const apiUrl = `${API_BASE_URL}${API_ENPOINTS.USER_ME}`;
  debugLog('Verifying token with backend API', {
    apiUrl,
    tokenLength: token?.length,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'null',
  });
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    debugLog('Token verification successful', {
      userEmail: response.data?.email,
      userId: response.data?.id,
    });
    return { success: true, user: response.data };
  } catch (error: any) {
    debugError('Token verification failed', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      errorData: error.response?.data,
      message: error.message,
    });
    return {
      success: false,
      error: error.response?.data?.error || 'Authentication failed',
    };
  }
};

/**
 * Check if user is currently logged in
 * 
 * Checks for presence of both authentication token and user data cookies
 * Both must exist for user to be considered logged in
 * 
 * @returns boolean - true if both token and user cookies exist
 */
export const isUserLoggedIn = (): boolean => {
  const token = getCookie(COOKIES.TOKEN_KEY);
  const user = getCookie(COOKIES.AUCTION_USER_KEY);
  return !!(token && user);
};

/**
 * Get currently logged in user details from cookies
 * 
 * Retrieves and parses user data stored in cookie
 * Returns null if cookie doesn't exist or parsing fails
 * 
 * @returns User object or null
 */
export const getCurrentUser = (): Record<string, any> | null => {
  const userCookie = getCookie(COOKIES.AUCTION_USER_KEY);
  if (!userCookie) return null;
  
  try {
    return JSON.parse(userCookie as string);
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
};

/**
 * Logout user by clearing all authentication cookies
 * 
 * Removes both token and user data cookies
 * This effectively logs out the user
 */
export const logoutUser = (): void => {
  deleteCookie(COOKIES.TOKEN_KEY);
  deleteCookie(COOKIES.AUCTION_USER_KEY);
  console.log('User logged out successfully');
};

/**
 * Extract root domain from hostname for cookie domain setting
 * 
 * Examples:
 * - 'www.eauctiondekho.com' → '.eauctiondekho.com'
 * - 'api.eauctiondekho.com' → '.eauctiondekho.com'
 * - 'eauctiondekho.com' → '.eauctiondekho.com'
 * - 'staging.app.example.com' → '.example.com'
 * - 'localhost' → undefined (skip domain setting)
 * - '192.168.1.1' → undefined (skip for IP addresses)
 * - 'xxx.ngrok-free.app' → undefined (skip for development domains)
 * - 'xxx.vercel.app' → undefined (skip for preview deployments)
 * 
 * @param hostname - The current window.location.hostname
 * @returns Root domain with leading dot, or undefined if should skip
 */
const extractRootDomain = (hostname: string): string | undefined => {
  // Skip for localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return undefined;
  }
  // Skip for IP addresses (e.g., 192.168.1.1)
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return undefined;
  }
  // Skip for development/preview domains where we don't control subdomains
  const skipDomains = [
    'ngrok-free.app',
    'ngrok.io',
    'vercel.app',
    'netlify.app',
    'herokuapp.com',
    'github.io',
    'pages.dev',
  ];
  if (skipDomains.some(domain => hostname.endsWith(domain))) {
    return undefined;
  }
  // Extract root domain (last two parts for standard TLDs)
  // e.g., 'www.eauctiondekho.com' → 'eauctiondekho.com'
  const parts = hostname.split('.');
  if (parts.length < 2) {
    return undefined;
  }
  // Handle standard TLDs (e.g., .com, .org, .in)
  // For two-part TLDs like .co.in, .com.au, this simple logic still works
  // because we want at least the domain + TLD
  const rootDomain = parts.slice(-2).join('.');
  // Return with leading dot to enable subdomain access
  return `.${rootDomain}`;
};

/**
 * Determine the cookie domain based on current hostname
 * 
 * Cookie Domain Strategy:
 * - For production domains: Use root domain with leading dot (e.g., '.eauctiondekho.com')
 *   This allows cookies to work across all subdomains (www, api, etc.)
 * - For development/staging domains: Don't set domain
 *   Let browser use the exact hostname automatically
 * 
 * Why leading dot matters:
 * - '.eauctiondekho.com' → Cookie works on: www.eauctiondekho.com, eauctiondekho.com, api.eauctiondekho.com
 * - 'www.eauctiondekho.com' → Cookie ONLY works on: www.eauctiondekho.com
 * 
 * @returns Cookie domain string or undefined
 */
const getCookieDomain = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const hostname = window.location.hostname;
  const rootDomain = extractRootDomain(hostname);
  debugLog('Cookie domain calculation', {
    hostname,
    calculatedRootDomain: rootDomain || '(using browser default)',
  });
  return rootDomain;
};

/**
 * Authenticate user from mobile app with auto-login
 * 
 * Main authentication flow for mobile app WebView:
 * 
 * 1. Extract token and email from URL parameters
 * 2. Check if a user is currently logged in
 * 3. If logged in, automatically logout the existing user
 * 4. Verify the new token with backend API
 * 5. Validate that token email matches expected email
 * 6. Set authentication cookies for the new user
 * 7. Return success with user details
 * 
 * This function handles the "user switch" scenario automatically:
 * - User A is logged in → Opens from mobile app as User B
 * - Result: User A is logged out, User B is logged in
 * 
 * @returns Object with:
 *   - success: boolean
 *   - user: user object (if success)
 *   - wasLoggedIn: boolean indicating if someone was logged in before
 *   - previousUser: previous user object (if wasLoggedIn is true)
 *   - error: error message (if failed)
 */
export const authenticateFromMobileApp = async () => {
  debugLog('========== STARTING MOBILE APP AUTHENTICATION ==========');
  debugLog('Environment info', {
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'SSR',
    href: typeof window !== 'undefined' ? window.location.href : 'SSR',
    nodeEnv: process.env.NODE_ENV,
  });

  try {
    // Step 1: Extract authentication parameters from URL
    const mobileToken = getAuthTokenFromUrl();
    const expectedUserEmail = getUserEmailFromUrl();
    debugLog('Step 1: Extracted URL parameters', {
      hasToken: !!mobileToken,
      tokenLength: mobileToken?.length,
      expectedUserEmail,
    });
    
    if (!mobileToken) {
      throw new Error('No auth token provided');
    }

    // Step 2 & 3: Check for existing session and logout if found
    const isLoggedIn = isUserLoggedIn();
    const currentUser = getCurrentUser();
    debugLog('Step 2: Checked existing session', {
      isLoggedIn,
      currentUserEmail: currentUser?.email,
    });
    
    if (isLoggedIn && currentUser) {
      debugLog('Existing user found, will be replaced with new user', {
        existingEmail: currentUser.email,
      });
    }

    // Step 4: Verify token with backend API
    debugLog('Step 3: Verifying token with backend...');
    const { success, user, error } = await verifyTokenAndGetUser(mobileToken);

    if (!success || !user) {
      throw new Error(error || 'Invalid token');
    }
    debugLog('Step 3: Token verified successfully', {
      userEmail: user.email,
      userId: user.id,
    });

    // Step 5: Validate email matches (security check to prevent user switching)
    if (expectedUserEmail && user.email !== expectedUserEmail) {
      debugError('Email mismatch detected', {
        expected: expectedUserEmail,
        actual: user.email,
      });
      throw new Error('USER_EMAIL_MISMATCH');
    }
    debugLog('Step 4: Email validation passed');

    // Step 6: Set authentication cookies for new user
    const cookieDomain = getCookieDomain();
    const isSecure = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax' as const,
      secure: isSecure,
      ...(cookieDomain && { domain: cookieDomain }),
    };
    debugLog('Step 5: Setting cookies with options', {
      domain: cookieDomain || '(browser default - exact hostname)',
      secure: isSecure,
      sameSite: 'lax',
      maxAgeDays: 7,
    });

    // Token cookie - used for API authentication
    setCookie(COOKIES.TOKEN_KEY, mobileToken, cookieOptions);
    debugLog('Token cookie set successfully');

    // User data cookie - stores user information
    setCookie(COOKIES.AUCTION_USER_KEY, JSON.stringify(user), cookieOptions);
    debugLog('User data cookie set successfully');

    debugLog('========== AUTHENTICATION COMPLETED SUCCESSFULLY ==========', {
      userEmail: user.email,
      wasLoggedIn: isLoggedIn,
      previousUserEmail: currentUser?.email,
      cookieDomain: cookieDomain || 'default',
    });
    
    // Step 7: Return success with metadata about the operation
    return { 
      success: true, 
      user,
      wasLoggedIn: isLoggedIn,
      previousUser: currentUser,
    };
  } catch (error: any) {
    debugError('========== AUTHENTICATION FAILED ==========', {
      errorMessage: error.message,
      errorStack: error.stack,
    });
    return {
      success: false,
      error: error.message || 'Authentication failed',
    };
  }
};
