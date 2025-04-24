import CustomReactCarouselForSection from "./CustomReactCarouselForSection";
import Image, { StaticImageData } from "next/image";

interface CarouselWrapperProps {
  images: Array<StaticImageData | string>;
}

export function CarouselWrapper({ images }: CarouselWrapperProps) {
  return (
    <CustomReactCarouselForSection>
      {images.map((image, index) => (
        <div key={index} className="relative w-full h-full">
          <Image
            src={image}
            alt={`How to save searches ${index + 1}`}
            width={400}
            height={300}
            priority={index === 0}
            className="rounded-lg shadow-lg w-full h-full object-cover"
            style={{
              transition: "opacity 0.5s ease",
              willChange: "opacity",
            }}
          />
        </div>
      ))}
    </CustomReactCarouselForSection>
  );
}
