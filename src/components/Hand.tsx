import React from "react";
import { Card } from "./Card";

interface HandProps {
    cards: Array<{
        id: string;
        title: string;
        cost: number;
        description: string;
    }>;
}

export const Hand: React.FC<HandProps> = ({ cards }) => {
    return (
        <div className="relative h-[250px] w-full flex justify-center items-end pb-4 perspective-[1000px]">
            <div className="relative flex justify-center items-end h-full">
                {cards.map((card, index) => {
                    // Calculate rotation based on index and total cards
                    // Center is 0 deg.
                    const total = cards.length;
                    const center = (total - 1) / 2;
                    const offset = index - center;
                    const rotation = offset * 5; // 5 degrees per card
                    const translateY = Math.abs(offset) * 10; // Arch effect: center cards are lower (or higher? usually lower in fan if bottom-aligned)
                    // Actually for a hand fan, usually edge cards are lower/rotated down.
                    // Let's try: Translate Y down for edges.

                    return (
                        <div
                            key={card.id}
                            className="absolute transition-all duration-300 origin-bottom hover:!rotate-0 hover:!-translate-y-16 hover:z-50 hover:scale-110"
                            style={{
                                marginLeft: `${offset * 120}px`, // Spacing mechanism (absolute center based)
                                transform: `rotate(${rotation}deg) translateY(${Math.abs(offset) * 15}px)`,
                                zIndex: index + 10,
                            }}
                        >
                            <Card {...card} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
