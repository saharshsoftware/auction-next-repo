"use client";
import React from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";

interface ICustomReactCarousel {
  homePageCollection: any;
  ItemComponent?: any;
  children: React.ReactNode | any;
  slideCount: number;
  title: string;
}

const iconClassCommon = () => "absolute top-0 cursor-pointer h-full";

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return <div className={className} onClick={onClick} />;
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return <div className={` ${className} `} onClick={onClick} ><FontAwesomeIcon  icon={faArrowAltCircleLeft}/></div>;
}

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <>
      <em
        className={`${iconClassCommon()} -right-12`}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2.4rem"
          height="2.4rem"
          className="flex items-center justify-center h-full"
          viewBox="0 0 16 16"
        >
          <path
            fill="#000"
            fill-rule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
          />
        </svg>
      </em>
    </>
  );
}

const PrevArrow = (props: any)=> {
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
            fill-rule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"
          />
        </svg>
      </em>
    </>
  );
}


const CustomReactCarousel = (props: ICustomReactCarousel) => {
  const { homePageCollection, title, children, slideCount } = props;

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: false,
        },
      },
    ],
  };

  return (
    <>
      <div className={"carousel-container mb-8"}>
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
