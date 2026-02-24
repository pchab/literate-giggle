"use client";

import { useShallow } from "zustand/shallow";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { CardComponent } from "./Card";

export function Hand({ id: heroId, cards }: Pick<Hero, "id" | "cards">) {
	const {
		usedCardsThisTurn,
		activeCard,
		cancelCard,
		selectCard,
		setHoveredCard,
	} = useBattleStore(
		useShallow((state) => ({
			usedCardsThisTurn: state.usedCardsThisTurn,
			activeCard: state.activeCard,
			cancelCard: state.cancelCard,
			selectCard: state.selectCard,
			setHoveredCard: state.setHoveredCard,
		})),
	);

	return (
		<div className="w-full h-32 flex justify-center items-center gap-2">
			{cards.map((card) => {
				const isSelected =
					activeCard?.heroId === heroId && activeCard?.card.id === card.id;
				const hasUsedCard = !!usedCardsThisTurn[heroId];

				// 1. GUARD: Has this hero already acted?
				// Return a non-clickable, grayed-out card.
				if (hasUsedCard) {
					return (
						<button
							type="button"
							key={card.id}
							className="opacity-40 grayscale cursor-not-allowed origin-bottom"
							onMouseEnter={() => setHoveredCard({ heroId, cardId: card.id })}
							onMouseLeave={() => setHoveredCard(null)}
						>
							<CardComponent {...card} />
						</button>
					);
				}

				// 2. This card is currently selected (Click to cancel)
				if (isSelected) {
					return (
						<button
							key={card.id}
							type="button"
							className="transition-all duration-300 z-50 scale-110 cursor-pointer origin-bottom focus:outline-none ring-2 ring-blue-500 rounded-md"
							onClick={() => cancelCard(heroId, card.id)}
							onMouseEnter={() => setHoveredCard({ heroId, cardId: card.id })}
							onMouseLeave={() => setHoveredCard(null)}
						>
							<CardComponent {...card} />
						</button>
					);
				}

				// 3. No card is active yet. Render as a clickable button to select.
				if (!activeCard) {
					return (
						<button
							key={card.id}
							type="button"
							className="transition-all duration-300 hover:z-50 hover:scale-110 cursor-pointer origin-bottom focus:outline-none"
							onClick={() => selectCard(heroId, card.id)}
							onMouseEnter={() => setHoveredCard({ heroId, cardId: card.id })}
							onMouseLeave={() => setHoveredCard(null)}
						>
							<CardComponent {...card} />
						</button>
					);
				}

				// 4. Another card is currently active. Render as unclickable so the
				// player must cancel the active card or finish playing it first.
				return (
					<button
						type="button"
						key={card.id}
						className="opacity-75 origin-bottom"
						onMouseEnter={() => setHoveredCard({ heroId, cardId: card.id })}
						onMouseLeave={() => setHoveredCard(null)}
					>
						<CardComponent {...card} />
					</button>
				);
			})}
		</div>
	);
}
