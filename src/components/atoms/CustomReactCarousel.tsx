"use client";
import React from "react";
import "./slickslider.style.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import MarkdownIt from "markdown-it";

interface ICustomReactCarousel {
  ItemComponent?: any;
  children: React.ReactNode | any;
  title: string;
  desc: string;
  subTitle?: string;
}

const iconClassCommon = () => "absolute top-0 cursor-pointer h-full";

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return <div className={className} onClick={onClick} />;
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div className={` ${className} `} onClick={onClick}>
      <FontAwesomeIcon icon={faArrowAltCircleLeft} />
    </div>
  );
}

export const NextArrow = (props: any) => {
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

export const PrevArrow = (props: any) => {
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

const CustomReactCarousel = (props: ICustomReactCarousel) => {
  const { title, children, desc, subTitle } = props;
  // const [slidesToShow, setSlidesToShow] = useState(4);
  // const [isLoaded, setIsLoader] = useState(false)

  // useEffect(() => {
  //   setIsLoader(true);
  //   console.log(slidesToShow, "slidesToShow");
  //   // Adjust number of slides to show based on window width
  //   const handleResize = () => {
  //     if (window.innerWidth < 1024) {
  //       setSlidesToShow(window.innerWidth < 600 ? 1 : 4);
  //     } else {
  //       setSlidesToShow(6);
  //     }
  //   };

  //   // Add event listener for window resize
  //   window.addEventListener("resize", handleResize);

  //   // Initial adjustment on component mount
  //   handleResize();

  //   // Cleanup on unmount
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  // Calculate the number of items
  const itemCount = React.Children.count(children);

  // Determine if arrows should be shown on desktop (when slidesToShow is 6)
  const shouldShowArrowsOnDesktop = itemCount > 6;  

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    autoplay: false,
    slidesToShow: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 2048,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 2,
          infinite: false,
          dots: true,
          arrows: shouldShowArrowsOnDesktop,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: false,
          dots: true,
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

  const renderMarkdown = (markdown: any) => {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
    });
    return md.render(markdown);
  };

  return (
    <>
      {/* {isLoaded ?  */}
      <div className={`carousel-container common-section py-12`}>
        <div
          className={
            "flex flex-col items-center justify-center text-center gap-4 md:w-3/5 mx-auto mb-4"
          }
        >
          <div className={"ps-[10px] text-lg text-gray-400 fond-semibold"}>
            {subTitle?.toUpperCase() ?? "-"}
          </div>
          <div
            className="carousel-p"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(title ?? ""),
            }}
          ></div>
          <p className="text-gray-500">{desc ?? ""}</p>
        </div>
        <div className={"slides-container"}>
          <Slider {...settings} lazyLoad="ondemand">
            {children}
          </Slider>
        </div>
      </div>
      {/* : ''} */}
    </>
  );
};

export default CustomReactCarousel;
