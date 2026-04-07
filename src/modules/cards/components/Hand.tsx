"use client";

import { AnimatePresence, motion } from "motion/react";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { BattleHero } from "@/modules/units/domain/units.type";
import { BattleCard } from "./BattleCard";
import { CardTooltip } from "./CardTooltip";

export function Hand({ id: heroId, hand }: Pick<BattleHero, "id" | "hand">) {
	const {
		usedCardsThisTurn,
		activeCard,
		hoveredHeroCard,
		cancelCard,
		selectCard,
		setHoveredCard,
	} = useBattleStore(
		useShallow((state) => ({
			usedCardsThisTurn: state.usedCardsThisTurn,
			activeCard: state.activeHeroCard,
			hoveredHeroCard: state.hoveredHeroCard,
			cancelCard: state.cancelCard,
			selectCard: state.selectCard,
			setHoveredCard: state.setHoveredCard,
		})),
	);

	return (
		<div className="w-full h-32 flex justify-end items-center gap-3 pr-4">
			{hand.map((card, index) => {
				if (!card) {
					return (
						<div
							key={`empty-slot-${index}`}
							className="w-16 h-24 rounded border-2 border-dashed border-zinc-700/50 flex items-center justify-center bg-zinc-900/20"
						>
							<span className="text-zinc-600 text-xs text-center px-1">
								Locked
							</span>
						</div>
					);
				}

				const isSelected =
					activeCard?.unitId === heroId && activeCard?.card.id === card.id;
				const hasUsedCard = !!usedCardsThisTurn[heroId];
				const isHovered =
					hoveredHeroCard?.unitId === heroId &&
					hoveredHeroCard?.card.id === card.id;

				return (
					<div
						className="relative origin-bottom focus:outline-none"
						key={card.id}
					>
						<AnimatePresence>
							{isHovered && (
								<motion.div
									initial={{ opacity: 0, y: 10, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.15, ease: "easeOut" }}
									className="absolute bottom-[110%] left-1/2 -translate-x-1/2 pointer-events-none"
								>
									<CardTooltip card={card} />
								</motion.div>
							)}
						</AnimatePresence>
						<button
							type="button"
							style={{ cursor: hasUsedCard ? "not-allowed" : "pointer" }}
							disabled={hasUsedCard}
							onClick={() => {
								if (hasUsedCard) return;
								if (isSelected) cancelCard();
								else selectCard(heroId, card);
							}}
							onMouseEnter={() => setHoveredCard({ unitId: heroId, card })}
							onMouseLeave={() => setHoveredCard(null)}
						>
							<BattleCard
								card={card}
								isSelected={isSelected}
								isPlayable={!hasUsedCard}
							/>
						</button>
					</div>
				);
			})}
		</div>
	);
}
