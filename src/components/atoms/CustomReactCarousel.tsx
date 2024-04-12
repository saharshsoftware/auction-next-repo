"use client";
import React from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ICustomReactCarousel {
  homePageCollection: any;
  ItemComponent: any;
  children: React.ReactNode | any;
  slideCount: number;
  title: string;
}

const CustomReactCarousel = (props: ICustomReactCarousel) => {
  const { homePageCollection, title, children, slideCount } = props;

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className={"carousel-container mb-4"}>
        <div className={"carousel-header"}>
          <div className={"ps-[10px] text-lg"}>
            <span>{title ?? "-"}</span>
          </div>
        </div>
        <div className={"slides-container"}>
          <Slider {...settings}>{children}</Slider>
        </div>
      </div>
    </>
  );
};

export default CustomReactCarousel;