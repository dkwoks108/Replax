import { useState, useEffect } from 'react';

export default function AnnouncementBoard({ announcements = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [announcements.length]);

  if (!announcements.length) return null;

  return (
    <div className="bg-olive text-cream py-2">
      <div className="container mx-auto px-4">
        <div className="relative h-6 overflow-hidden">
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center text-sm transition-transform duration-500 ${
                index === currentIndex ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              {announcement}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}