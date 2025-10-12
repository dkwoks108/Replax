import { useState } from 'react';

export default function HamburgerMenu({ onToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onToggle?.(!isOpen);
  };

  return (
    <button
      onClick={handleClick}
      className="lg:hidden p-2 hover:bg-cream/10 rounded-lg transition-colors"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className="w-6 h-5 relative flex flex-col justify-between">
        <span 
          className={`block h-0.5 w-full bg-olive transition-transform ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span 
          className={`block h-0.5 w-full bg-olive transition-opacity ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span 
          className={`block h-0.5 w-full bg-olive transition-transform ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </div>
    </button>
  );
}