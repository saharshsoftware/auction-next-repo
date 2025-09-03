/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React from "react";

const ImageTag = (props: {
  imageUrl?: string;
  alt?: string;
  customClass?: string;
  title?: string;
  entityName?: string;
  entityType?: string;
}) => {
  const { imageUrl = "", alt, customClass, title, entityName, entityType } = props;
  
  // Generate SEO-friendly alt text if not provided
  const generateAltText = () => {
    if (alt && alt !== "i") return alt;
    
    if (entityName && entityType) {
      return `${entityName} ${entityType} image`;
    }
    
    if (entityName) {
      return `${entityName} image`;
    }
    
    if (entityType) {
      return `${entityType} image`;
    }
    
    return "Property image";
  };
  
  const optimizedAlt = generateAltText();
  const imageTitle = title || optimizedAlt;

  const renderImage = () => {
    if (imageUrl) {
      return (
        <Image
          width={80}
          height={80}
          // objectFit="contain"
          style={{ objectFit: "cover" }}
          src={imageUrl}
          alt={optimizedAlt}
          title={imageTitle}
          className={customClass}
        />
      );
    }
  };
  return (
    <>
      <img
        src={imageUrl}
        alt={optimizedAlt}
        title={imageTitle}
        fetchPriority="high"
        loading="eager"
        width="800"
        height="800"
        className={customClass ?? "w-full  h-auto bg-contain"}
      />

      {/* {renderImage()} */}
    </>
  );
};

export default ImageTag;
