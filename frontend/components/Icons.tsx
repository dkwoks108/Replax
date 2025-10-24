import React from 'react';

export const IconPlaceholder = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <rect width="100%" height="100%" rx="2" ry="2" />
  </svg>
);

export default IconPlaceholder;
