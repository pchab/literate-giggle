"use client";

import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { redirect } from 'next/navigation';
import { CardComponent } from '@/components/Card';
import { useWorldStore } from '@/store/world.store';

const MAX_XP = 2; 

export default function RewardScreen() {
    const { roster, pendingBattleLog, claimRewardsAndReturnToMap } = useWorldStore();

    if (!pendingBattleLog) {
        redirect('/');
    }

    return (
        // Simplified the background slightly to ensure it isn't swallowing the content
        <div className="min-h-screen bg-slate-950 text-slate-300 p-8 flex flex-col items-center">
            
            {/* Header - Removed initial opacity: 0 so it's always visible */}
            <div className="text-center mb-12 mt-8">
                <h1 className="text-4xl md:text-5xl font-serif text-cyan-400 tracking-widest uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                    Victory
                </h1>
                <p className="text-slate-500 mt-2 tracking-widest text-sm uppercase">Combat Experience Gained</p>
            </div>

            {/* Container for Heroes */}
            <div className="w-full max-w-3xl flex flex-col gap-8">
                {roster.map(({ id: heroId, deck }) => {
                    const cardIdUsed = pendingBattleLog[heroId] || {};
                    const cardsUsed = deck.filter(card => !!cardIdUsed[card.id]);
                    
                    if (cardsUsed.length === 0) return null;

                    return (
                        <div 
                            key={heroId}
                            className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-2xl relative overflow-hidden"
                        >
                            {/* Decorative Top Border Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-700 to-transparent opacity-50" />

                            <h2 className="text-xl text-slate-400 font-serif mb-6 capitalize border-b border-slate-800 pb-2">
                                {heroId}
                            </h2>

                            <div className="flex flex-col gap-6">
                                {cardsUsed.map((card, index) => {
                                    const xpGained = pendingBattleLog[heroId][card.id];
                                    const startPercent = Math.min((card.xp / MAX_XP) * 100, 100);
                                    const endPercent = Math.min(((card.xp + xpGained) / MAX_XP) * 100, 100);
                                    const isMaxed = endPercent >= 100;

                                    return (
                                        <div key={card.id} className="flex items-center gap-6">
                                            {/* Card Thumbnail */}
                                            <div className="w-20 shrink-0 transform hover:scale-105 transition-transform">
                                                <CardComponent {...card} />
                                            </div>

                                            {/* XP Details */}
                                            <div className="flex-1 flex flex-col gap-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="font-bold text-slate-200">{card.name || card.id}</span>
                                                    <span className="text-cyan-400 font-mono text-sm">+{xpGained} XP</span>
                                                </div>

                                                {/* The Progress Bar Container */}
                                                <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800 relative overflow-hidden shadow-inner">
                                                    {/* Base XP */}
                                                    <div 
                                                        className="absolute top-0 left-0 h-full bg-cyan-950"
                                                        style={{ width: `${startPercent}%` }}
                                                    />
                                                    {/* Animated Gained XP - This should work fine because it animates width, not opacity */}
                                                    <LazyMotion features={domAnimation}>
                                                    <m.div
                                                        className="absolute top-0 h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                                                        style={{ left: `${startPercent}%` }}
                                                        initial={{ width: '0%' }}
                                                        animate={{ width: `${endPercent - startPercent}%` }}
                                                        transition={{ duration: 1, delay: index * 0.2 + 0.3, ease: "easeOut" }}
                                                    />
                                                    </LazyMotion>
                                                </div>

                                                {/* Text Readout under bar */}
                                                <div className="flex justify-between text-xs font-mono text-slate-500">
                                                    <span>{card.xp} / {MAX_XP}</span>
                                                    {isMaxed && (
                                                        <span className="text-yellow-400 font-bold uppercase">
                                                            Ready to Evolve!
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Button */}
            <button 
                type="button" 
                onClick={claimRewardsAndReturnToMap}
                className="mt-12 px-10 py-4 bg-blue-700 hover:bg-blue-600 text-white font-bold tracking-widest rounded transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
            >
                RETURN TO MAP
            </button>

        </div>
    );
}