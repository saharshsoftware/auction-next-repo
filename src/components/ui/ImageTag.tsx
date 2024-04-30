/* eslint-disable @next/next/no-img-element */
"use client"
import Image from 'next/image';
import React from 'react'

const ImageTag = (props: { imageUrl?: string; alt?: string; customClass?:string }) => {
  const { imageUrl='', alt, customClass } = props;

  const renderImage = () => {
    if (imageUrl) {
      return (
        <Image
          width={200}
          height={200}
          src={imageUrl}
          alt={alt ?? "i"}
          className={customClass}
        />
      );
    }
  }  
  return (
    <>
      {/* <img src={imageUrl} alt={alt ?? "i"} className={customClass} /> */}

      {renderImage()}
    </>
  );
};

export default ImageTag