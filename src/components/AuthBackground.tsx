import React from 'react';

export default function AuthBackground() {
  // Global mesh background lives in index.html; this provides a subtle dark tint for card readability
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
