import React from "react";
import { motion } from "motion/react";

// Coffee Branch with Leaves and Cherries (used for corners)
export const CoffeeBranch: React.FC<{ className?: string; delay?: number }> = ({ className = "", delay = 0 }) => {
  return (
    <motion.div
      id="coffee-branch-deco"
      className={`pointer-events-none select-none opacity-40 md:opacity-50 ${className}`}
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        stroke="#2d2d2d"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Main Stem */}
        <path d="M10 190 Q60 140 180 20" />
        
        {/* Leaf 1 (Left) */}
        <path d="M70 130 C30 110, 20 70, 50 60 C80 50, 90 90, 70 130 Z" fill="#eae8e0" fillOpacity="0.4" />
        {/* Leaf 1 vein */}
        <path d="M70 130 Q50 90 50 60" strokeWidth="0.8" />
        <path d="M60 110 Q45 100 40 100" strokeWidth="0.6" />
        <path d="M65 95 Q55 85 45 85" strokeWidth="0.6" />
        <path d="M68 85 Q60 75 50 75" strokeWidth="0.6" />

        {/* Leaf 2 (Right) */}
        <path d="M110 90 C130 50, 110 20, 95 35 C80 50, 90 80, 110 90 Z" fill="#eae8e0" fillOpacity="0.4" />
        {/* Leaf 2 vein */}
        <path d="M110 90 Q110 50 95 35" strokeWidth="0.8" />
        
        {/* Leaf 3 (Top Left) */}
        <path d="M130 70 C100 50, 110 10, 140 15 C170 20, 160 50, 130 70 Z" fill="#eae8e0" fillOpacity="0.4" />
        
        {/* Coffee Cherries / Berries cluster */}
        <circle cx="85" cy="115" r="8" fill="#8c8876" stroke="#2d2d2d" strokeWidth="1" />
        <circle cx="95" cy="110" r="7" fill="#b9b5a6" stroke="#2d2d2d" strokeWidth="1" />
        <circle cx="92" cy="122" r="8" fill="#eae8e0" stroke="#2d2d2d" strokeWidth="1" />
        <circle cx="78" cy="125" r="6" fill="#8c8876" stroke="#2d2d2d" strokeWidth="1" />
        
        {/* Secondary cluster */}
        <circle cx="135" cy="65" r="7" fill="#b9b5a6" stroke="#2d2d2d" strokeWidth="1" />
        <circle cx="145" cy="60" r="8" fill="#eae8e0" stroke="#2d2d2d" strokeWidth="1" />
      </svg>
    </motion.div>
  );
};

// Simple Coffee Bean
export const CoffeeBean: React.FC<{ 
  className?: string; 
  size?: number; 
  rotate?: number;
  animated?: boolean;
}> = ({ className = "", size = 30, rotate = 45, animated = true }) => {
  const comp = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      stroke="#2d2d2d"
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`text-coffee-600 ${className}`}
    >
      {/* Bean Outline */}
      <path 
        d="M25 5 C10 12, 5 28, 15 40 C25 52, 45 42, 45 28 C45 14, 40 5, 25 5 Z" 
        fill="#eae8e0" 
        fillOpacity="0.3" 
      />
      {/* Center Crease Curve */}
      <path d="M25 5 Q21 20 29 30 T25 45" strokeWidth="1.2" />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        className="pointer-events-none select-none"
        animate={{ 
          y: [0, -6, 0],
          rotate: [rotate, rotate + 4, rotate]
        }}
        transition={{ 
          duration: 4 + Math.random() * 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {comp}
      </motion.div>
    );
  }

  return comp;
};

// Background lines/curves representing vintage craft design
export const VintageWave: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      id="vintage-wave"
      className={`pointer-events-none select-none opacity-25 ${className}`}
      width="100%"
      height="120"
      viewBox="0 0 1440 120"
      fill="none"
      stroke="#8c8876"
      strokeWidth="0.8"
      strokeDasharray="4 4"
    >
      <path d="M0 80 Q180 20 360 80 T720 80 T1080 80 T1440 80" />
      <path d="M0 40 Q220 100 440 40 T880 40 T1320 40" strokeWidth="0.4" />
    </svg>
  );
};
