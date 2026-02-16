import React from "react";

interface HeroPortraitProps {
  name: string;
  classType: string;
  color?: string; // Tailwind color class for border/accent
}

export function HeroPortrait({ name, classType, color = "border-zinc-600" }: HeroPortraitProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
      {/* Portrait Circle */}
      <div className={`w-12 h-12 rounded-full border-2 ${color} flex items-center justify-center bg-zinc-950 shadow-md group-hover:shadow-lg transition-all`}>
        {/* Placeholder Icon: First letter of class */}
        <span className="text-zinc-400 font-bold text-lg select-none">
          {classType[0]}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <span className="text-zinc-200 font-semibold text-sm">{name}</span>
        <span className="text-zinc-500 text-xs uppercase tracking-wide">{classType}</span>
      </div>
      
      {/* Status Bars (Visual Stub) */}
      <div className="flex flex-col gap-1 ml-auto w-16">
          <div className="h-1 w-full bg-zinc-800 rounded overflow-hidden">
             <div className="h-full bg-green-600 w-3/4"></div>
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded overflow-hidden">
             <div className="h-full bg-blue-600 w-1/2"></div>
          </div>
      </div>
    </div>
  );
}
