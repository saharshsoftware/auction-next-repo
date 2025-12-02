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
  // return true
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
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENPOINTS.USER_ME}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, user: response.data };
  } catch (error: any) {
    console.error('Token verification failed:', error);
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
  try {
    // Step 1: Extract authentication parameters from URL
    const mobileToken = getAuthTokenFromUrl();
    const expectedUserEmail = getUserEmailFromUrl();
    console.log({ mobileToken, expectedUserEmail });
    
    if (!mobileToken) {
      throw new Error('No auth token provided');
    }

    // Step 2 & 3: Check for existing session and logout if found
    const isLoggedIn = isUserLoggedIn();
    const currentUser = getCurrentUser();
    
    if (isLoggedIn && currentUser) {
      console.log('User already logged in:', currentUser.email);
      console.log('Logging out existing user before new authentication');
      // logoutUser(); // Clear existing session
    } else {
      console.log('No existing user session found');
    }

    // Step 4: Verify token with backend API
    const { success, user, error } = await verifyTokenAndGetUser(mobileToken);

    if (!success || !user) {
      throw new Error(error || 'Invalid token');
    }

    // Step 5: Validate email matches (security check to prevent user switching)
    if (expectedUserEmail && user.email !== expectedUserEmail) {
      throw new Error('USER_EMAIL_MISMATCH');
    }

    // Step 6: Set authentication cookies for new user
    // Token cookie - used for API authentication
    setCookie(COOKIES.TOKEN_KEY, mobileToken, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // User data cookie - stores user information
    setCookie(COOKIES.AUCTION_USER_KEY, JSON.stringify(user), {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    console.log('Authentication successful for user:', user.email);
    
    // Step 7: Return success with metadata about the operation
    return { 
      success: true, 
      user,
      wasLoggedIn: isLoggedIn, // Was someone logged in before?
      previousUser: currentUser, // Who was logged in before?
    };
  } catch (error: any) {
    console.error('WebView authentication failed:', error);
    return {
      success: false,
      error: error.message || 'Authentication failed',
    };
  }
};
