"use client";

import { Card, type CardProps } from "./Card";

interface HandProps {
    cards: CardProps[];
    onPlay?: (cardId: string) => void;
}

export function Hand({ cards, onPlay }: HandProps) {
    // Limit to 3 cards as requested
    const visibleCards = cards.slice(0, 3);

    return (
        <div className="w-full h-32 flex justify-center items-center">
            {visibleCards.map((card, index) => {
                const total = visibleCards.length;
                const center = (total - 1) / 2;
                const offset = index - center;
                
                // Fan calculations
                const rotation = offset * 5; // Slight rotation
                const translateX = offset * 50; // Overlap spacing
                const translateY = Math.abs(offset) * 10; // Arch

                return (
                    <button
                        key={card.id}
                        type="button"
                        className="absolute transition-all duration-300 hover:z-50 hover:-translate-y-12 hover:scale-110 cursor-pointer origin-bottom focus:outline-none"
                        style={{
                            transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg)`,
                            zIndex: index,
                        }}
                        onClick={() => onPlay?.(card.id)}
                    >
                        <Card id={card.id} title={card.title} />
                    </button>
                );
            })}
        </div>
    );
}
