import React from 'react';

export default function AuthBackground() {
  // Vite base-path aware path resolving to public/background.jpg
  const imageUrl = `${import.meta.env.BASE_URL || '/Jamex-global-markets/'}background.jpg`.replace(/\/+/g, '/');

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Blurred background image — scale-110 prevents blurred edge artifacts */}
      <img 
        src={imageUrl} 
        alt="Authentication Page Background" 
        className="w-full h-full object-cover object-center scale-110"
        style={{ filter: 'blur(8px)' }}
      />
      
      {/* Dark overlay to maintain card readability over blurred image */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
