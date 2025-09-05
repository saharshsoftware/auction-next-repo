"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faHome } from "@fortawesome/free-solid-svg-icons";

export interface IBreadcrumbItem {
  name: string;
  item?: string;
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

const textColor = "text-[#90a5bb]";

const Breadcrumb: React.FC<IBreadcrumbProps> = ({
  items,
  showHome = true,
  homeHref = "/",
  separator = <FontAwesomeIcon icon={faChevronRight} className={`${textColor} text-[0.50rem] mx-1 sm:mx-2`} />,
  className = "",
  itemClassName = "",
  activeItemClassName = `${textColor} font-medium`,
  linkClassName = `${textColor} transition-colors duration-200 hover:underline text-xs`,
  maxMobileItems = 2,
  truncateLength = 25,
}) => {
  
  const truncateText = (text: string, maxLength: number): string => {
    return text
  };

  const getResponsiveItems = () => {
    return items;
  };
  const renderBreadcrumbItem = (item: IBreadcrumbItem, index: number, isLast: boolean, isMobile: boolean = false) => {
    const baseItemClass = `items-center flex-shrink-0 ${itemClassName}`;
    const displayLabel = isMobile ? truncateText(item.name, truncateLength) : item.name;
    
    // If it's the last item and active, but still has href, make it a link with different styling
    if ((isLast || item.isActive) && item.item) {
      return (
        <Link
          key={index}
          href={item.item}
          className={`${baseItemClass} ${activeItemClassName} ${linkClassName}`}
          title={item.name} // Full text on hover
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
          className={`${baseItemClass} ${activeItemClassName} ${textColor}`}
          title={item.name} // Full text on hover
        >
          {displayLabel}
        </span>
      );
    }

    // Regular link item
    if (item.item) {
      return (
        <Link
          key={index}
          href={item.item}
          className={`${baseItemClass} ${linkClassName}`}
          title={item.name} // Full text on hover
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
        title={item.name}
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
      className={`flex items-start rounded-lg ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Desktop View */}
      <p className="hidden sm:flex items-center gap-1 flex-wrap w-full">
        {showHome && (
          <>
            <Link
              href={homeHref}
              className={`inline-flex items-center ${linkClassName} py-1 rounded`}
              title="Home"
            >
              <span className={`${textColor}`}>Home</span>
            </Link>
            {items.length > 0 && renderSeparator(-1)}
          </>
        )}
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <span key={index} className="inline-flex items-center">
              {renderBreadcrumbItem(item, index, isLast, false)}
              {!isLast && renderSeparator(index)}
            </span>
          );
        })}
      </p>

      {/* Mobile View */}
      <p className="block sm:hidden text-sm leading-relaxed">
        {showHome && (
          <>
            <Link
              href={homeHref}
              className={`${linkClassName} ${textColor}`}
              title="Home"
            >
              Home
            </Link>
            {displayItems.length > 0 && <span className={`${textColor} mx-1`}>&gt;</span>}
          </>
        )}
        
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          return (
            <span key={index}>
              {renderBreadcrumbItem(item as IBreadcrumbItem, index, isLast, true)}
              {!isLast && <span className={`${textColor} mx-1`}>&gt;</span>}
            </span>
          );
        })}
      </p>
    </nav>
  );
};

export default Breadcrumb;
