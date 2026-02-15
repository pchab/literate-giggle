/* eslint-disable @next/next/no-img-element */
import React from "react";

interface CardProps {
  title: string;
  cost: number;
  description: string;
  image?: string;
  type?: string;
  glowColor?: string; // Hex or Tailwind color class
}

export const Card: React.FC<CardProps> = ({
  title,
  cost,
  description,
  image,
  type = "Spell",
  glowColor = "#3b82f6", // Default blue
}) => {
  return (
    <div
      className="relative w-[240px] h-[360px] group select-none transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
      style={{
        filter: `drop-shadow(0 0 10px ${glowColor}40)`, // subtle glow behind everything
      }}
    >
      {/* 1. Underlying Background/Glow */}
      <div className="absolute inset-4 bg-slate-900 rounded-lg opacity-90 z-0"></div>

      {/* 2. Card Content Layer (Clipped inside the frame area) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center pt-8 px-6 pb-6 text-slate-200">
        
        {/* Title Area */}
        <div className="w-full text-center mt-3 mb-2">
            <h3 className="font-serif text-lg font-bold tracking-wider text-amber-100 drop-shadow-md uppercase">
                {title}
            </h3>
        </div>

        {/* Image Placeholder Area */}
        <div className="w-full h-[140px] bg-slate-950/50 mb-4 relative overflow-hidden rounded border border-slate-700/50">
             {image ? (
                <img src={image} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 italic text-xs">
                    No Art
                </div>
             )}
        </div>

        {/* Description Text */}
        <div className="w-full flex-1 flex flex-col justify-center text-center">
             <p className="text-[11px] leading-tight font-medium text-slate-300">
                {description}
             </p>
             <span className="text-[9px] uppercase tracking-widest text-slate-500 mt-2 border-t border-slate-700/50 pt-1">
                {type}
             </span>
        </div>

      </div>

      {/* 3. The Frame Overlay (The star of the show) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <img
          src="/assets/fantasy-card-frame.png"
          alt="Frame"
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </div>

       {/* 4. Cost Gem (Overlaying the frame) */}
       <div className="absolute top-2 left-2 z-30 w-10 h-10 flex items-center justify-center">
            {/* Simple CSS Gem */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 rotate-45 border-2 border-slate-900 shadow-lg rounded-sm"></div>
            <span className="relative z-10 font-bold text-white text-lg drop-shadow-md font-serif">{cost}</span>
       </div>

    </div>
  );
};
