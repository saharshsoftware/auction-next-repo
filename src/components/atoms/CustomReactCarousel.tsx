"use client"
import React, { useEffect, useState } from 'react'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./customCarouselStyle.css"
import useResize from '@/hooks/useResize';

interface ICustomReactCarousel {
  homePageCollection: any;
  ItemComponent: any;
  children: React.ReactNode | any;
  slideCount: number;
  title: string;
}


const CustomReactCarousel = (props: ICustomReactCarousel) => {
    const { homePageCollection, title, children, slideCount } = props;
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    // const [slideCount, setSlideCount] = useState<number>(0);
    const [items, setItems] = useState<any[]>([]);
    const windowSize = useResize();
    const [carouselStep, setCarouselStep] = useState<number>(1);

    const handleBackwardScroll = () => {
          console.log(currentIndex, carouselStep, carouselStep, "back-carouselStep");
      if (currentIndex - carouselStep > carouselStep)
        setCurrentIndex(currentIndex - carouselStep);
      else setCurrentIndex(0);
    };

  const handleForwardScroll = () => {
// debugger;
    // if (items.length * getCardWidth(window.screen.width) < window.screen.width) return;
    console.log(currentIndex, slideCount, carouselStep, "carouselStep", slideCount - currentIndex > carouselStep);
    // setCurrentIndex(currentIndex + 1);
    // debugger;
    if (currentIndex === 0 && slideCount > 2) {
      setCurrentIndex(carouselStep + 1)
    }
    else if (slideCount - currentIndex > carouselStep) {
      setCurrentIndex(currentIndex + carouselStep);
    } else {
      setCurrentIndex(0);
    }
  };
  
  return (
    <>
      <div className={"carousel-container"}>
        <div className={"carousel-header"}>
          <div className={"carousel-heading"}>
            <span>{title ?? "-"}</span>
          </div>
          {/* <div className={"carousel-control-container"}>
            <div className={"carousel-control"} onClick={handleBackwardScroll}>
              <i className={"fa fa-chevron-left"} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2rem"
                height="1.2rem"
                viewBox="0 0 24 24"
              >
                <path fill="#000" d="m14 17l-5-5l5-5z" />
              </svg>
            </div>
            <div className={"carousel-control"} onClick={handleForwardScroll}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2rem"
                height="1.2rem"
                viewBox="0 0 24 24"
              >
                <path fill="#000" d="M10 17V7l5 5z" />
              </svg>
            </div>
          </div> */}
        </div>
        <div className={"slides-container"}>
          <Carousel
            centerMode
            showStatus={false}
            showThumbs={false}
            showArrows={true}
            centerSlidePercentage={windowSize?.width < 768 ? 100 : 25}
            showIndicators={true}
            className="custom-carousel-class"
          >
            {children}
          </Carousel>
        </div>
      </div>
    </>
  );
}

export default CustomReactCarousel