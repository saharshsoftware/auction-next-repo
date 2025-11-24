/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Custom Hook: useWebViewAuth
 * 
 * Handles authentication when user navigates to web app from mobile app WebView.
 * 
 * Features:
 * - Detects mobile app WebView context
 * - Auto-login with token from URL parameters
 * - Automatic logout of existing user before new login
 * - Token verification with backend
 * - WebView messaging (success/failure notifications)
 * - URL cleanup to prevent infinite reload loop
 * 
 * Usage:
 * ```tsx
 * const { authResult, isAuthenticating } = useWebViewAuth();
 * ```
 * 
 * The hook automatically triggers authentication on mount if:
 * - Page is opened in mobile app WebView
 * - URL contains auth_token parameter
 * 
 * @returns {Object} Authentication state
 * - authResult: Result object from authentication attempt
 * - isAuthenticating: Boolean indicating if auth is in progress
 * - authError: Error message if authentication failed
 */

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  isInMobileApp,
  authenticateFromMobileApp,
  sendToApp
} from '@/helpers/NativeHelper';
import { NATIVE_APP_MESSAGE_TYPES } from '@/shared/Constants';

interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
  wasLoggedIn?: boolean;
  previousUser?: any;
}

interface UseWebViewAuthReturn {
  authResult: AuthResult | null;
  isAuthenticating: boolean;
  authError: string | null;
}

/**
     * Handle WebView authentication with auto-login
     * 
     * Main authentication handler for mobile app WebView integration.
     * 
     * Flow:
     * 1. Check if running in mobile app WebView (early exit if not)
     * 2. Check if auth token exists in URL (early exit if not)
     *    - This prevents infinite reload loop after successful auth
     * 3. Authenticate using token from URL
     *    - Automatically logs out existing user if any
     *    - Verifies token with backend
     *    - Sets new authentication cookies
     * 4. Send success/failure messages to mobile app
     * 5. Remove auth params from URL (prevents re-authentication)
     * 6. Refresh page to show authenticated state
     * 
     * Why URL param check is critical:
     * - Without it, page would re-authenticate on every load
     * - Causes infinite reload loop
     * - URL params are removed after first successful auth
     * - Subsequent loads skip authentication
     * 
     * Messages sent to mobile app:
     * - AUTH_SUCCESS: Authentication succeeded
     * - WEBVIEW_READY: WebView is ready and user is logged in
     * - USER_MISMATCH: Email doesn't match token
     * - TOKEN_EXPIRED: Token has expired
     * - AUTH_FAILED: General authentication failure
     */

export const useWebViewAuth = (): UseWebViewAuthReturn => {
  const router = useRouter();
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);



  const handleWebViewAuth = async () => {
    // Guard: Only run in mobile app WebView
    if (!isInMobileApp()) {
      console.log('Not in mobile app, skipping WebView auth');
      return;
    }

    // Guard: Only run if auth token exists in URL
    // This prevents re-authentication after page reload
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthToken = urlParams.has('auth_token');

    if (!hasAuthToken) {
      console.log('No auth token in URL, skipping WebView auth');
      return;
    }

    console.log('In mobile app, starting auto-login...');
    setIsAuthenticating(true);
    setAuthResult(null);
    setAuthError(null);

    try {
      // Authenticate using token from URL
      // This function handles logout + login automatically
      const result = await authenticateFromMobileApp();
      setAuthResult(result);

      if (result.success) {
        console.log('Auto-login successful:', result.user);
        console.log('Was previously logged in:', result.wasLoggedIn);
        if (result.previousUser) {
          console.log('Previous user:', result.previousUser.email);
        }

        // Notify mobile app of successful authentication
        sendToApp(NATIVE_APP_MESSAGE_TYPES.AUTH_SUCCESS, {
          userId: result.user.id,
          email: result.user.email,
          wasLoggedIn: result.wasLoggedIn,
          previousUserEmail: result.previousUser?.email,
          timestamp: Date.now(),
        });

        // Mark WebView as ready for mobile app
        sendToApp(NATIVE_APP_MESSAGE_TYPES.WEBVIEW_READY, {
          authenticated: true,
          user: {
            id: result.user.id,
            email: result.user.email,
          },
        });

        // CRITICAL FIX FOR INFINITE RELOAD LOOP:
        // Remove auth parameters from URL before refresh
        // Without this, page would reload with same params and re-authenticate
        const url = new URL(window.location.href);
        url.searchParams.delete('auth_token');
        url.searchParams.delete('userEmail');

        console.log('Clearing URL params and refreshing...');

        // Update URL in browser without triggering navigation
        window.history.replaceState({}, '', url.toString());

        // Refresh page to update authentication state
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('WebView auto-login failed:', error);
      setAuthError(error.message);
      setAuthResult({ success: false, error: error.message });

      // Notify mobile app of authentication failure with specific error types
      if (error.message === 'USER_EMAIL_MISMATCH') {
        sendToApp(NATIVE_APP_MESSAGE_TYPES.USER_MISMATCH, {
          message: 'Account mismatch detected',
        });
      } else if (error.message.includes('expired')) {
        sendToApp(NATIVE_APP_MESSAGE_TYPES.TOKEN_EXPIRED, {
          message: 'Session expired',
        });
      } else {
        sendToApp(NATIVE_APP_MESSAGE_TYPES.AUTH_FAILED, {
          message: error.message || 'Authentication failed',
        });
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    // Trigger authentication on mount if in mobile app
    if (isInMobileApp()) {
      handleWebViewAuth();
    }
  }, []);

  return {
    authResult,
    isAuthenticating,
    authError,
  };
};

