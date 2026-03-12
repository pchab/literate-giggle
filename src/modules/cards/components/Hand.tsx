"use client";

import { AnimatePresence } from "motion/react";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { BattleHero } from "@/modules/figures/domain/figures.type";
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
					<button
						key={card.id}
						type="button"
						className="relative origin-bottom focus:outline-none"
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
						<AnimatePresence>
							{isHovered && <CardTooltip card={card} />}
						</AnimatePresence>

						<BattleCard
							card={card}
							isSelected={isSelected}
							isPlayable={!hasUsedCard}
						/>
					</button>
				);
			})}
		</div>
	);
}
