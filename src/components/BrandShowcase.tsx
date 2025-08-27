import { useState, useEffect } from 'react';

const BrandShowcase = () => {
  const images = [
    '/lovable-uploads/9f9cfa03-4b91-40c2-b99c-4f47c36e71e4.png',
    '/lovable-uploads/71887d26-b5c7-4976-bcab-78388f0efa00.png',
    '/lovable-uploads/ce84c529-47a8-48ec-b843-f77c89f7fdb2.png',
    '/lovable-uploads/241b87f1-0758-430c-9e05-32cae0fb0850.png'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="bg-background">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden shadow-medium">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`ZARVEAN Brand Showcase ${index + 1}`}
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
          
          {/* Dots indicator */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  index === currentIndex
                    ? 'bg-white shadow-lg'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
    </section>
  );
};

export default BrandShowcase;