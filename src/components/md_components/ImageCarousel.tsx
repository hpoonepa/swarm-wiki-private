import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./carousel-custom.css"; // Ensure this points to your custom CSS
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { type CarouselApi } from "../ui/carousel";

export interface Props {
  images: string[];
  caption?: string;
}

export default function Image(props: Props) {
  // State to track the currently active slide
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex w-full flex-col items-center mx-auto justify-right p-1" style={{maxWidth: "60%"}}>
      <Carousel setApi={setApi}>
        <CarouselContent className="z-0">
          {Array.from({ length: props.images.length }).map((_, index) => (
            // This is the line that was changed
            <CarouselItem key={index} className="flex items-center justify-center">
              <img alt={`slide_${index}`} src={props.images[index]} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-white-1 text-black font-bold w-10 h-10" />
        <CarouselNext className="bg-white-1 text-black font-bold w-10 h-10" />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>

      <div className="text-center italic">{props.caption}</div>
    </div>
  );
}