/**
 * Mobile App Authentication Debug Component
 * 
 * Visual debug panel for monitoring mobile app WebView authentication flow.
 * 
 * Features:
 * - Real-time state monitoring (auto-refreshes every 2 seconds)
 * - Status indicators (🟢 success, 🔴 error, 🟡 loading, ⚪ idle)
 * - Displays URL parameters (token, email)
 * - Shows current session info (logged in user, cookies)
 * - Authentication result tracking
 * - Token copy functionality
 * - Collapsible UI
 * 
 * Usage:
 * <MobileAuthDebug authResult={result} isLoading={loading} />
 * 
 * Component only appears when:
 * - Running in mobile app WebView, OR
 * - URL contains auth parameters
 * 
 * For production: Wrap in environment check or remove entirely
 */

"use client";
import React, { useEffect, useState } from 'react';
import { 
  getAuthTokenFromUrl, 
  getUserEmailFromUrl,
  isInMobileApp,
  getCurrentUser,
  isUserLoggedIn,
} from '@/helpers/NativeHelper';
import { getCookie } from 'cookies-next';
import { COOKIES } from '@/shared/Constants';

// Debug state interface - holds all authentication-related state
interface AuthDebugState {
  isInMobileApp: boolean;
  urlToken: string | null;
  urlEmail: string | null;
  isLoggedIn: boolean;
  currentUser: Record<string, any> | null;
  cookieToken: string | null;
  timestamp: string;
}

// Component props interface
interface MobileAuthDebugProps {
  readonly authResult?: {
    success: boolean;
    user?: any;
    error?: string;
    wasLoggedIn?: boolean;
    previousUser?: any;
  } | null;
  readonly isLoading?: boolean;
}

/**
 * Mobile Auth Debug Component
 * 
 * Displays authentication state and debugging information
 * Only visible in mobile app context or when URL has auth params
 */
const MobileAuthDebug: React.FC<MobileAuthDebugProps> = ({ 
  authResult = null, 
  isLoading = false 
}) => {
  const [debugState, setDebugState] = useState<AuthDebugState>({
    isInMobileApp: false,
    urlToken: null,
    urlEmail: null,
    isLoggedIn: false,
    currentUser: null,
    cookieToken: null,
    timestamp: new Date().toISOString(),
  });
  const [isExpanded, setIsExpanded] = useState(true);

  // Refresh debug state by reading current values
  const refreshDebugState = () => {
    setDebugState({
      isInMobileApp: isInMobileApp(),
      urlToken: getAuthTokenFromUrl(),
      urlEmail: getUserEmailFromUrl(),
      isLoggedIn: isUserLoggedIn(),
      currentUser: getCurrentUser(),
      cookieToken: getCookie(COOKIES.TOKEN_KEY) as string | null,
      timestamp: new Date().toISOString(),
    });
  };

  useEffect(() => {
    refreshDebugState();
    
    // Auto-refresh every 2 seconds to catch real-time changes
    const interval = setInterval(refreshDebugState, 2000);
    
    return () => clearInterval(interval);
  }, [authResult]);

  // Hide debug panel if not in mobile app context
  if (!debugState.isInMobileApp && !debugState.urlToken) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-auto bg-gray-900 text-white rounded-lg shadow-2xl border-2 border-blue-500">
      {/* Header */}
      <div 
        className="bg-blue-600 p-3 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <h3 className="font-bold text-sm">Mobile Auth Debug</h3>
        </div>
        <button className="text-white hover:text-gray-200">
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Status Indicator */}
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-3 h-3 rounded-full ${
                isLoading ? 'bg-yellow-500 animate-pulse' : 
                authResult?.success ? 'bg-green-500' : 
                authResult?.error ? 'bg-red-500' : 'bg-gray-500'
              }`} />
              <span className="font-semibold text-xs">
                {isLoading ? 'Loading...' : 
                 authResult?.success ? 'Authenticated' : 
                 authResult?.error ? 'Failed' : 'Ready'}
              </span>
            </div>
            {authResult?.error && (
              <p className="text-xs text-red-400 mt-2">Error: {authResult.error}</p>
            )}
          </div>

          {/* Environment */}
          <DebugSection title="Environment">
            <DebugItem label="In Mobile App" value={debugState.isInMobileApp ? 'Yes' : 'No'} />
            <DebugItem label="Timestamp" value={new Date(debugState.timestamp).toLocaleTimeString()} />
            <DebugItem 
              label="Node Env" 
              value={process.env.NODE_ENV || 'unknown'} 
            />
          </DebugSection>

          {/* URL Parameters */}
          <DebugSection title="URL Parameters">
            <DebugItem 
              label="Token" 
              value={debugState.urlToken ? `${debugState.urlToken.substring(0, 20)}...` : 'None'} 
              copyValue={debugState.urlToken}
            />
            <DebugItem label="User Email" value={debugState.urlEmail || 'None'} />
          </DebugSection>

          {/* Current Session */}
          <DebugSection title="Current Session">
            <DebugItem label="Logged In" value={debugState.isLoggedIn ? 'Yes' : 'No'} />
            <DebugItem 
              label="User Email" 
              value={debugState.currentUser?.email || 'None'} 
            />
            <DebugItem 
              label="User ID" 
              value={debugState.currentUser?.id || 'None'} 
            />
            <DebugItem 
              label="Cookie Token" 
              value={debugState.cookieToken ? `${debugState.cookieToken.substring(0, 20)}...` : 'None'}
              copyValue={debugState.cookieToken}
            />
          </DebugSection>

          {/* Auth Result */}
          {authResult && (
            <DebugSection title="Authentication Result">
              <DebugItem label="Success" value={authResult.success ? 'Yes' : 'No'} />
              <DebugItem label="Was Logged In" value={authResult.wasLoggedIn ? 'Yes' : 'No'} />
              {authResult.previousUser && (
                <DebugItem 
                  label="Previous User" 
                  value={authResult.previousUser.email} 
                />
              )}
              {authResult.user && (
                <>
                  <DebugItem label="New User Email" value={authResult.user.email} />
                  <DebugItem label="New User ID" value={authResult.user.id} />
                </>
              )}
            </DebugSection>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={refreshDebugState}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded"
            >
              Refresh
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 px-3 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Debug section wrapper with title
 */
const DebugSection: React.FC<{ title: string; children: React.ReactNode }> = ({ 
  title, 
  children 
}) => (
  <div className="bg-gray-800 p-3 rounded">
    <h4 className="font-semibold text-xs text-blue-400 mb-2">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

/**
 * Debug item with label, value, and optional copy functionality
 */
const DebugItem: React.FC<{ 
  label: string; 
  value: string | number | boolean;
  copyValue?: string | null;
}> = ({ label, value, copyValue }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyValue) {
      navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex justify-between items-start text-xs">
      <span className="text-gray-400">{label}:</span>
      <div className="flex items-center gap-2">
        <span className="text-white font-mono text-right break-all max-w-48">
          {String(value)}
        </span>
        {copyValue && (
          <button
            onClick={handleCopy}
            className="text-blue-400 hover:text-blue-300 text-xs"
            title="Copy full value"
          >
            {copied ? '✓' : '📋'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileAuthDebug;

