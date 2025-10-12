import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PosterSlider({ posters = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (posters.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % posters.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [posters.length]);

  if (!posters.length) return null;

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
      {posters.map((poster, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={poster.image}
              alt={poster.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="container mx-auto">
                <h2 className="text-cream text-3xl md:text-4xl font-bold mb-4">
                  {poster.title}
                </h2>
                <p className="text-cream/90 text-lg mb-6 max-w-2xl">
                  {poster.description}
                </p>
                {poster.link && (
                  <Link
                    href={poster.link}
                    className="inline-block bg-olive text-cream px-6 py-3 rounded-lg hover:bg-forest-green transition-colors"
                  >
                    Learn More
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {posters.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-cream' : 'bg-cream/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}