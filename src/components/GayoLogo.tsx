import React from "react";

interface GayoLogoProps {
  className?: string;
  light?: boolean;
}

export const GayoLogo: React.FC<GayoLogoProps> = ({ className = "", light = false }) => {
  return (
    <div id="gayo-logo-container" className={["flex items-center justify-center", className].filter(Boolean).join(" ")}>
      <img
        id="gayo-logo-image"
        src="/gayozenith.png"
        alt="Gayo Zenith"
        className={["w-36 h-auto object-contain", light && "drop-shadow-[0_1px_2px_rgba(255,255,255,0.35)]"].filter(Boolean).join(" ")}
      />
    </div>
  );
};
