import React from "react";

interface GayoLogoProps {
  className?: string;
  light?: boolean;
}

export const GayoLogo: React.FC<GayoLogoProps> = ({ className = "", light = false }) => {
  return (
    <div id="gayo-logo-container" className={`flex flex-col items-center justify-center ${className}`}>
      {/* Mountain + Coffee Droplet SVG */}
      <svg
        id="gayo-logo-svg"
        className={`w-12 h-12 transition-colors duration-300 ${light ? "text-coffee-100" : "text-coffee-800"}`}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Outer Peak (Mountain) */}
        <path d="M15 65 L50 20 L85 65" />
        {/* Inner Peak line */}
        <path d="M35 65 L50 42 L65 65" />
        {/* Bottom Horizon Line */}
        <path d="M25 65 L75 65" strokeWidth="2.5" />
        
        {/* Droplet outline in the center bottom */}
        <path 
          d="M50 55 C44 65, 44 78, 50 82 C56 78, 56 65, 50 55 Z" 
          fill="currentColor" 
          className="opacity-90"
        />
      </svg>
      <span
        id="gayo-logo-text"
        className={`mt-1 font-serif text-sm tracking-[0.25em] font-bold text-center transition-colors duration-300 ${
          light ? "text-coffee-100" : "text-coffee-900"
        }`}
      >
        GAYO ZENITH
      </span>
    </div>
  );
};
