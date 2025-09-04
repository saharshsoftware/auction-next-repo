"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faHome } from "@fortawesome/free-solid-svg-icons";

export interface IBreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean; // If true, item is styled as current page but can still be clickable if href is provided
}

interface IBreadcrumbProps {
  items: IBreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
  separator?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  linkClassName?: string;
  maxMobileItems?: number;
  truncateLength?: number;
}

const Breadcrumb: React.FC<IBreadcrumbProps> = ({
  items,
  showHome = true,
  homeHref = "/",
  separator = <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 text-xs mx-1 sm:mx-2" />,
  className = "",
  itemClassName = "",
  activeItemClassName = "text-gray-700 font-medium",
  linkClassName = "text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline",
  maxMobileItems = 2,
  truncateLength = 25,
}) => {
  
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getResponsiveItems = () => {
    if (items.length <= maxMobileItems) return items;
    
    // On mobile, show first item + "..." + last item if there are too many items
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    
    return [
      firstItem,
      { label: "...", isActive: false },
      lastItem,
    ];
  };
  const renderBreadcrumbItem = (item: IBreadcrumbItem, index: number, isLast: boolean, isMobile: boolean = false) => {
    const baseItemClass = `inline-flex items-center text-sm sm:text-base ${itemClassName}`;
    const displayLabel = isMobile ? truncateText(item.label, truncateLength) : item.label;
    
    // If it's the last item and active, but still has href, make it a link with different styling
    if ((isLast || item.isActive) && item.href) {
      return (
        <Link
          key={index}
          href={item.href}
          className={`${baseItemClass} ${activeItemClassName} ${linkClassName}`}
          title={item.label} // Full text on hover
        >
          {displayLabel}
        </Link>
      );
    }
    
    // If it's the last item without href, show as active text
    if (isLast || item.isActive) {
      return (
        <span 
          key={index} 
          className={`${baseItemClass} ${activeItemClassName}`}
          title={item.label} // Full text on hover
        >
          {displayLabel}
        </span>
      );
    }

    // Regular link item
    if (item.href) {
      return (
        <Link
          key={index}
          href={item.href}
          className={`${baseItemClass} ${linkClassName}`}
          title={item.label} // Full text on hover
        >
          {displayLabel}
        </Link>
      );
    }

    // Fallback for items without href
    return (
      <span 
        key={index} 
        className={`${baseItemClass} text-gray-500`}
        title={item.label}
      >
        {displayLabel}
      </span>
    );
  };

  const renderSeparator = (index: number) => (
    <span key={`separator-${index}`} className="inline-flex items-center">
      {separator}
    </span>
  );

  const displayItems = getResponsiveItems();

  return (
    <nav
      className={`flex items-center rounded-lg overflow-x-auto ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Desktop View */}
      <ol className="hidden sm:inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        {showHome && (
          <>
            <li className="inline-flex items-center">
              <Link
                href={homeHref}
                className={`inline-flex items-center ${linkClassName} px-2 py-1 rounded`}
                title="Home"
              >
                <FontAwesomeIcon icon={faHome} className="text-sm mr-1" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            {items.length > 0 && renderSeparator(-1)}
          </>
        )}
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="inline-flex items-center">
              {renderBreadcrumbItem(item, index, isLast, false)}
              {!isLast && renderSeparator(index)}
            </li>
          );
        })}
      </ol>

      {/* Mobile View */}
      <ol className="inline-flex sm:hidden items-center space-x-1 flex-nowrap min-w-0">
        {showHome && (
          <>
            <li className="inline-flex items-center flex-shrink-0">
              <Link
                href={homeHref}
                className={`inline-flex items-center ${linkClassName} p-1 rounded hover:bg-blue-50`}
                title="Home"
              >
                <FontAwesomeIcon icon={faHome} className="text-sm" />
              </Link>
            </li>
            {displayItems.length > 0 && renderSeparator(-1)}
          </>
        )}
        
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          return (
            <li key={index} className="inline-flex items-center min-w-0">
              <div className="min-w-0">
                {renderBreadcrumbItem(item, index, isLast, true)}
              </div>
              {!isLast && renderSeparator(index)}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
