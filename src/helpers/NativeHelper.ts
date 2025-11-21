import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { COOKIES } from '@/shared/Constants';
import { API_BASE_URL, API_ENPOINTS } from '@/services/api';
import axios from 'axios';

/**
 * Extends the Window interface to include React Native WebView
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
 */
export const sendToApp = (type: string, payload: Record<string, any>): void => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
  }
};

/**
 * Check if page is opened in mobile app WebView
 */
export const isInMobileApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  return typeof window.ReactNativeWebView !== 'undefined';
};

/**
 * Get auth token from URL parameters (sent by mobile app)
 */
export const getAuthTokenFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('auth_token');
};

/**
 * Get user ID from URL parameters (sent by mobile app)
 */
export const getUserIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('userId');
};

/**
 * Get user email from URL parameters (sent by mobile app)
 */
export const getUserEmailFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('userEmail');
};

/**
 * Verify token and get user details
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
 * Authenticate user in WebView with token from mobile app
 */
export const authenticateFromMobileApp = async () => {
  try {
    const mobileToken = getAuthTokenFromUrl();
    const expectedUserEmail = getUserEmailFromUrl();
    console.log({mobileToken, expectedUserEmail});
    if (!mobileToken) {
      throw new Error('No auth token provided');
    }

    // Verify token with backend
    const { success, user, error } = await verifyTokenAndGetUser(mobileToken);

    if (!success || !user) {
      throw new Error(error || 'Invalid token');
    }

    // Check if user email matches (prevent user switching)
    if (expectedUserEmail && user.email !== expectedUserEmail) {
      throw new Error('USER_EMAIL_MISMATCH');
    }

    // Check if user already logged in as different user
    const existingUserCookie = getCookie(COOKIES.AUCTION_USER_KEY);
    if (existingUserCookie) {
      try {
        const existingUser = JSON.parse(existingUserCookie as string);
        if (existingUser.id.toString() !== user.id.toString()) {
          // Different user - clear old session
          console.warn('Different user detected, clearing old session');
          deleteCookie(COOKIES.TOKEN_KEY);
          deleteCookie(COOKIES.AUCTION_USER_KEY);
        }
      } catch (e) {
        console.error('Error parsing existing user cookie:', e);
      }
    }

    // Set cookies (same as login flow)
    setCookie(COOKIES.TOKEN_KEY, mobileToken, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    setCookie(COOKIES.AUCTION_USER_KEY, JSON.stringify(user), {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return { success: true, user };
  } catch (error: any) {
    console.error('WebView authentication failed:', error);
    return {
      success: false,
      error: error.message || 'Authentication failed',
    };
  }
};
