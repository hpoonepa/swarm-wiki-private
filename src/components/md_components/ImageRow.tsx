import React from 'react';

interface Props {
  images: { src: string, caption?: string }[];  // Array of image URLs with optional captions
  size?: number;     // Optional size for image width and height, default to 100 if not provided
}

const ImageRow: React.FC<Props> = ({ images, size = 100 }) => { // Default size set to 100px
  return (
    <div className="flex w-full items-center justify-center p-1 space-x-4">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center justify-center">
          <img
            src={image.src}
            style={{ width: size, height: size }} // Apply the size prop to both width and height
            alt={`image-${index}`}
            className="rounded-xl object-fit"
          />
          {image.caption && <div className="text-center italic mt-2">{image.caption}</div>}
        </div>
      ))}
    </div>
  );
}

export default ImageRow;
