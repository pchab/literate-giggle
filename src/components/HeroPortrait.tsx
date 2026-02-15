/* eslint-disable @next/next/no-img-element */
import React from "react";

export const HeroPortrait = () => {
    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Glow/Backdrop */}
            <div className="absolute inset-4 rounded-full bg-cyan-900/40 blur-xl animate-pulse"></div>

            {/* Character Image (Clipped circle) */}
            <div className="absolute inset-6 rounded-full overflow-hidden bg-slate-900 border-2 border-slate-700">
                {/* Placeholder Hero */}
                <img
                    src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
                    alt="Hero"
                    className="w-full h-full object-cover scale-110 mt-2"
                />
            </div>

            {/* Rune Frame Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <img
                    src="/assets/rune-frame.png"
                    alt="Rune Frame"
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                />
            </div>

            {/* Status (HP) */}
            <div className="absolute -bottom-2 -right-2 z-20 bg-red-900/90 text-red-100 w-12 h-12 rounded-full flex items-center justify-center border-2 border-red-500 shadow-lg font-serif font-bold text-lg">
                30
            </div>
        </div>
    );
}
