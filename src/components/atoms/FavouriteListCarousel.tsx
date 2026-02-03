"use client";
import React from "react";
import "./slickslider.style.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from "./CustomReactCarousel";
import MarkdownIt from "markdown-it";
import { IFavouriteList } from "@/types";
import FavouriteListCollectionCard from "./FavouriteListCollectionCard";

interface IFavouriteListCarouselProps {
  title: string;
  desc: string;
  subTitle?: string;
  items: IFavouriteList[];
}

const FavouriteListCarousel = ({ title, desc, subTitle, items }: IFavouriteListCarouselProps) => {
  // Calculate the number of items
  const itemCount = items?.length ?? 0;

  // Determine if arrows should be shown on desktop (when slidesToShow is 3)
  const shouldShowArrowsOnDesktop = itemCount > 3;

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1536, // 2xl screens
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: shouldShowArrowsOnDesktop,
        },
      },
      {
        breakpoint: 1280, // xl screens
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: shouldShowArrowsOnDesktop,
        },
      },
      {
        breakpoint: 1024, // lg screens (tablet landscape)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 768, // md screens (tablet portrait)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 640, // sm screens (large mobile)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 480, // xs screens (small mobile)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  const renderMarkdown = (markdown: any) => {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
    });
    return md.render(markdown);
  };

  return (
    <div className={`carousel-container common-section py-6 sm:py-8 md:py-10 lg:py-12`}>
      <div className="flex flex-col items-center justify-center text-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-full md:w-4/5 lg:w-3/5 mx-auto mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
        <div className="ps-[10px] text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 font-semibold">
          {subTitle?.toUpperCase() ?? "-"}
        </div>
        <div
          className="carousel-p text-xl sm:text-2xl md:text-3xl lg:text-3xl px-2"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(title ?? ""),
          }}
        ></div>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base px-2 sm:px-4 max-w-full">{desc ?? ""}</p>
      </div>
      <div className="slides-container">
        <Slider {...settings} lazyLoad="ondemand">
          {items?.map((item: IFavouriteList, index: number) => (
            <div key={index} className="px-1 sm:px-2 md:px-3 h-full">
              <div className="h-full flex">
                <FavouriteListCollectionCard item={item} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default FavouriteListCarousel;

