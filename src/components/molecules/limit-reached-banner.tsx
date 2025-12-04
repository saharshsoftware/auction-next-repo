'use client';
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useLimitReached, LimitFeatureType } from '@/hooks/useLimitReached';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import { useIsAuthenticated } from '@/hooks/useAuthenticated';

/**
 * Props for LimitReachedBanner components
 */
interface LimitReachedBannerProps {
  readonly featureType: LimitFeatureType;
  readonly className?: string;
  readonly featureName?: string;
}

/**
 * Banner Design 4: A slim, single-line banner focusing on dynamic plan-based messaging.
 */
export const LimitReachedBanner: React.FC<LimitReachedBannerProps> = ({
  featureType,
  className = '',
  featureName = '',
}) => {
  const { isAuthenticated } = useIsAuthenticated();
  const { description } = useLimitReached(featureType, isAuthenticated, featureName);

  return (
    <div
      className={`bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-row items-center sm:justify-between justify-end gap-2 sm:flex-nowrap  flex-wrap  ${className}`}
    >
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-800 text-left">
            {description}
          </p>
        </div>
      </div>
      <Link
        href={ROUTE_CONSTANTS.PRICING}
        className="px-4 py-2 bg-brand-color text-white rounded-md text-sm font-semibold whitespace-nowrap"
      >
        Upgrade Plan
      </Link>
    </div>
  );
};

