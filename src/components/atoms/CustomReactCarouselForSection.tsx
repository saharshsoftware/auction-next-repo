"use client";
import React from "react";
import "./slickslider.style.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ICustomReactCarousel {
  children: React.ReactNode | any;
}

const iconClassCommon = () => "absolute top-0 cursor-pointer h-full";

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <>
      <em className={`${iconClassCommon()} -right-12`} onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2.4rem"
          height="2.4rem"
          className="flex items-center justify-center h-full"
          viewBox="0 0 16 16"
        >
          <path
            fill="#000"
            fillRule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
          />
        </svg>
      </em>
    </>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <>
      <em className={`${iconClassCommon()} -left-12`} onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2.4rem"
          height="2.4rem"
          viewBox="0 0 16 16"
          className="flex items-center justify-center h-full"
        >
          <path
            fill="#000"
            fillRule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"
          />
        </svg>
      </em>
    </>
  );
};

const CustomReactCarouselForSection = (props: ICustomReactCarousel) => {
  const { children } = props;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: false,
    slidesToShow: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 2048,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          autoplay: true,
          infinite: true,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          autoplay: true,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          autoplay: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <>
      <div className={` py-12`}>
        <div className={"slides-container"}>
          <Slider {...settings} lazyLoad="ondemand">
            {children}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default CustomReactCarouselForSection;
