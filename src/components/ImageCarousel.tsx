import React from "react";

interface ImageCarouselProps {
  items: { image: string; caption: string }[]; // Array of images with captions
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ items }) => {
  // Ensure exactly 3 items are displayed
  const displayedItems = items.slice(0, 3);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex justify-center gap-4">
        {displayedItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center w-1/3">
            <img
              src={item.image}
              alt={`Carousel item ${index + 1}`}
              className="w-full h-60 object-cover rounded-lg shadow-lg"
            />
            <p className="mt-2 text-center text-sm font-normal text-gray-700 px-2">
              {item.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
