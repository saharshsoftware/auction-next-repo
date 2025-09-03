import React, { type ReactElement } from "react";

/**
 * ImageJsonLd renders JSON-LD structured data for images to help Google index them
 */
interface IImageData {
  url: string;
  name?: string;
  description?: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface IImageJsonLdProps {
  images: IImageData[];
  propertyTitle?: string;
  propertyDescription?: string;
}

const ImageJsonLd = ({ 
  images, 
  propertyTitle = "Property Images",
  propertyDescription 
}: IImageJsonLdProps): ReactElement | null => {
  
  if (!images || images.length === 0) return null;

  const imageObjects = images.map((image, index) => ({
    "@type": "ImageObject",
    "@id": `${image.url}#image`,
    url: image.url,
    contentUrl: image.url,
    name: image.name || `${propertyTitle} - Image ${index + 1}`,
    description: image.description || propertyDescription || `Property image ${index + 1} for ${propertyTitle}`,
    caption: image.caption || image.description,
    ...(image.width && { width: image.width }),
    ...(image.height && { height: image.height }),
    encodingFormat: "image/jpeg",
    thumbnailUrl: image.url,
  }));

  // If multiple images, create an ImageGallery
  const structuredData = images.length > 1 ? {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: propertyTitle,
    description: propertyDescription || `Image gallery for ${propertyTitle}`,
    image: imageObjects,
    associatedMedia: imageObjects
  } : {
    "@context": "https://schema.org",
    ...imageObjects[0]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default ImageJsonLd;