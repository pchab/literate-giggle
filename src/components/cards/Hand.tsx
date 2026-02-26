"use client";

import { AnimatePresence } from "motion/react";
import { useShallow } from "zustand/shallow";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { CardComponent } from "./Card";
import { CardTooltip } from "./CardTooltip";

export function Hand({ id: heroId, cards }: Pick<Hero, "id" | "cards">) {
	const {
		usedCardsThisTurn,
		activeCard,
		cancelCard,
		selectCard,
		hoveredCard,
		setHoveredCard,
	} = useBattleStore(
		useShallow((state) => ({
			usedCardsThisTurn: state.usedCardsThisTurn,
			activeCard: state.activeCard,
			cancelCard: state.cancelCard,
			selectCard: state.selectCard,
			hoveredCard: state.hoveredCard,
			setHoveredCard: state.setHoveredCard,
		})),
	);

	return (
		<div className="w-full h-32 flex justify-end items-center gap-3 px-4">
			{cards.map((card, index) => {
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
					activeCard?.heroId === heroId && activeCard?.card.id === card.id;
				const hasUsedCard = !!usedCardsThisTurn[heroId];
				const isPlayable = !hasUsedCard && (!activeCard || isSelected);

				// Check if THIS specific card is being hovered
				const isHovered =
					hoveredCard?.heroId === heroId && hoveredCard?.cardId === card.id;

				return (
					<button
						key={card.id}
						type="button"
						className="relative origin-bottom focus:outline-none"
						style={{ cursor: isPlayable ? "pointer" : "not-allowed" }}
						disabled={!isPlayable && !isSelected}
						onClick={() => {
							if (hasUsedCard) return;
							if (isSelected) cancelCard(heroId, card.id);
							else if (!activeCard) selectCard(heroId, card.id);
						}}
						onMouseEnter={() => setHoveredCard({ heroId, cardId: card.id })}
						onMouseLeave={() => setHoveredCard(null)}
					>
						<AnimatePresence>
							{isHovered && <CardTooltip card={card} />}
						</AnimatePresence>

						<CardComponent
							{...card}
							isSelected={isSelected}
							isPlayable={isPlayable}
						/>
					</button>
				);
			})}
		</div>
	);
}
