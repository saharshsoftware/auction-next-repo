'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string | React.ReactNode;
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  className = '',
  iconClassName = '',
  tooltipClassName = '',
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const iconRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const updateTooltipPosition = () => {
    if (!iconRef.current || !tooltipRef.current) return;

    const iconRect = iconRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = iconRect.top - tooltipRect.height - 8;
        left = iconRect.left + (iconRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = iconRect.bottom + 8;
        left = iconRect.left + (iconRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = iconRect.top + (iconRect.height / 2) - (tooltipRect.height / 2);
        left = iconRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = iconRect.top + (iconRect.height / 2) - (tooltipRect.height / 2);
        left = iconRect.right + 8;
        break;
    }

    // Adjust for viewport boundaries
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }
    if (top < 8) top = iconRect.bottom + 8;
    if (top + tooltipRect.height > viewportHeight - 8) {
      top = iconRect.top - tooltipRect.height - 8;
    }

    setTooltipPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        updateTooltipPosition();
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        hideTooltip();
      }
    };

    const handleResize = () => {
      if (isVisible) {
        updateTooltipPosition();
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={iconRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={`inline-flex items-center justify-center text-blue-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-full ${iconClassName}`}
        aria-label="More information"
      >
        <Info className="h-4 w-4" />
      </button>

      {/* Tooltip */}
      {isVisible && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden" 
            onClick={hideTooltip}
          />
          
          {/* Tooltip content */}
          <div
            ref={tooltipRef}
            className={`fixed z-50 bg-white rounded-xl shadow-xl border border-gray-200 max-w-xs md:max-w-sm ${tooltipClassName}`}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              opacity: tooltipPosition.top === 0 && tooltipPosition.left === 0 ? 0 : 1,
            }}
          >
            {/* Arrow */} 
            <div 
              className={`absolute w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45 ${
                position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
                position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
                position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
                'left-[-4px] top-1/2 -translate-y-1/2'
              }`}
            />
            
            {/* Content */}
            <div className="relative z-10 p-3">
              {typeof content === 'string' ? (
                <div className="text-gray-700">
                  <p className="text-sm leading-relaxed normal-case">{content}</p>
                </div>
              ) : (
                content
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};