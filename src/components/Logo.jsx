import React from 'react';

const Logo = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Shield Structure */}
        <path
          d="M50 5L15 20V45C15 65 30 85 50 95C70 85 85 65 85 45V20L50 5Z"
          fill="var(--color-midnight-blue)"
          stroke="var(--color-sentinel-teal)"
          strokeWidth="3"
        />
        
        {/* Cloud Form Integration */}
        <path
          d="M30 55C30 48.3726 35.3726 43 42 43C42.817 43 43.6111 43.0818 44.3768 43.2374C46.5448 38.3846 51.3788 35 57 35C64.1797 35 70 40.8203 70 48C70 48.3377 69.9871 48.6724 69.9618 49.0035C74.5209 50.1197 78 54.1523 78 59C78 64.5228 73.5228 69 68 69H38C33.5817 69 30 65.4183 30 61V55Z"
          fill="white"
          fillOpacity="0.1"
        />

        {/* Eye in Negative Space */}
        <path
          d="M50 45C40 45 32 52 32 52C32 52 40 59 50 59C60 59 68 52 68 52C68 52 60 45 50 45Z"
          stroke="var(--color-sentinel-teal)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="52"
          r="4"
          fill="var(--color-sentinel-teal)"
        />
        
        {/* Sentinel Teal Accent Line */}
        <path
          d="M15 30H85"
          stroke="var(--color-sentinel-teal)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

export default Logo;
