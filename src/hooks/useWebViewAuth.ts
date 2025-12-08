/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Custom Hook: useWebViewAuth
 * 
 * Handles authentication when user navigates to web app from mobile app WebView.
 * 
 * Features:
 * - Detects mobile app WebView context via auth_token URL param (reliable)
 * - Auto-login with token from URL parameters
 * - Automatic logout of existing user before new login
 * - Token verification with backend
 * - WebView messaging (success/failure notifications)
 * - URL cleanup to prevent infinite reload loop
 * - Waits for WebView bridge to be available for messaging
 * 
 * Usage:
 * ```tsx
 * const { authResult, isAuthenticating } = useWebViewAuth();
 * ```
 * 
 * The hook automatically triggers authentication on mount if:
 * - URL contains auth_token parameter (primary trigger - always available)
 * - Waits for ReactNativeWebView bridge for sending messages back to app
 * 
 * @returns {Object} Authentication state
 * - authResult: Result object from authentication attempt
 * - isAuthenticating: Boolean indicating if auth is in progress
 * - authError: Error message if authentication failed
 */

'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  isInMobileApp,
  authenticateFromMobileApp,
  sendToApp,
  hasAuthTokenInUrl,
  waitForWebViewBridge
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
  const hasAttemptedAuth = useRef(false);

  /**
   * Send message to native app, waiting for bridge if necessary
   * 
   * @param type - Message type
   * @param payload - Message payload
   */
  const sendMessageToApp = async (type: string, payload: Record<string, any>) => {
    if (isInMobileApp()) {
      sendToApp(type, payload);
      return;
    }
    const bridgeAvailable = await waitForWebViewBridge(2000, 50);
    if (bridgeAvailable) {
      sendToApp(type, payload);
    } else {
      console.log('WebView bridge not available, skipping message:', type);
    }
  };

  const handleWebViewAuth = async () => {
    // Prevent duplicate authentication attempts
    if (hasAttemptedAuth.current) {
      console.log('Auth already attempted, skipping');
      return;
    }

    // Guard: Only run if auth token exists in URL
    // This is the PRIMARY trigger - URL params are always available immediately
    // This prevents re-authentication after page reload (params are removed after success)
    if (!hasAuthTokenInUrl()) {
      console.log('No auth token in URL, skipping WebView auth');
      return;
    }

    hasAttemptedAuth.current = true;
    console.log('Auth token found in URL, starting auto-login...');
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

        // Notify mobile app of successful authentication (async, non-blocking)
        sendMessageToApp(NATIVE_APP_MESSAGE_TYPES.AUTH_SUCCESS, {
          userId: result.user.id,
          email: result.user.email,
          wasLoggedIn: result.wasLoggedIn,
          previousUserEmail: result.previousUser?.email,
          timestamp: Date.now(),
        });

        // Mark WebView as ready for mobile app
        sendMessageToApp(NATIVE_APP_MESSAGE_TYPES.WEBVIEW_READY, {
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
        sendMessageToApp(NATIVE_APP_MESSAGE_TYPES.USER_MISMATCH, {
          message: 'Account mismatch detected',
        });
      } else if (error.message.includes('expired')) {
        sendMessageToApp(NATIVE_APP_MESSAGE_TYPES.TOKEN_EXPIRED, {
          message: 'Session expired',
        });
      } else {
        sendMessageToApp(NATIVE_APP_MESSAGE_TYPES.AUTH_FAILED, {
          message: error.message || 'Authentication failed',
        });
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    // Trigger authentication on mount if auth_token exists in URL
    // This is more reliable than checking for ReactNativeWebView which may not be
    // injected immediately due to bridge initialization timing
    handleWebViewAuth();
  }, []);

  return {
    authResult,
    isAuthenticating,
    authError,
  };
};

