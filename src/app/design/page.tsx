import React from "react";
import { Card } from "@/components/Card";
import { Hand } from "@/components/Hand";
import { HeroPortrait } from "@/components/HeroPortrait";

export default function DesignPage() {
    const sampleCards = [
        { id: "1", title: "Heavy Strike", cost: 1, description: "Deal 6 damage to target enemy.", type: "Attack" },
        { id: "2", title: "Defend", cost: 1, description: "Gain 5 Block.", type: "Skill" },
        { id: "3", title: "Fireball", cost: 2, description: "Deal 8 damage. Apply 2 Burn.", type: "Spell", image: "https://images.unsplash.com/photo-1633511090164-b43840ea1607?q=80&w=400&auto=format&fit=crop" },
        { id: "4", title: "Insight", cost: 0, description: "Draw 2 cards.", type: "Skill" },
        { id: "5", title: "Execute", cost: 3, description: "Deal 20 damage if enemy HP < 50%.", type: "Attack" }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-10 font-sans">
            <h1 className="text-3xl font-bold mb-10 text-center text-amber-500 font-serif">Design System Preview</h1>

            <section className="mb-20">
                <h2 className="text-xl text-slate-500 mb-6 uppercase tracking-widest text-center">Components</h2>

                <div className="flex flex-wrap justify-center gap-20 items-center">
                    {/* Hero Portrait */}
                    <div className="flex flex-col items-center gap-4">
                        <HeroPortrait />
                        <span className="text-sm text-slate-600">Hero Portrait</span>
                    </div>

                    {/* Single Card */}
                    <div className="flex flex-col items-center gap-4">
                        <Card
                            title="Dark Ritual"
                            cost={2}
                            description="Lose 3 HP. Gain 2 Energy."
                            type="Skill"
                            image="https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=400&auto=format&fit=crop"
                            glowColor="#a855f7"
                        />
                        <span className="text-sm text-slate-600">Single Card (Hover Me)</span>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
                <h2 className="text-xl text-slate-500 mb-10 uppercase tracking-widest text-center">Hand & Layout</h2>

                <div className="flex justify-center items-end" style={{ height: "400px" }}>
                    {/* The Hand Component */}
                    <div className="relative w-[800px] border-b border-slate-800 border-dashed">

                        {/* Simulation of Hero Area */}
                        <div className="absolute left-0 bottom-0 z-50">
                            <HeroPortrait />
                        </div>

                        {/* The Cards */}
                        <div className="absolute bottom-4 left-32 right-0">
                            <Hand cards={sampleCards} />
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}
