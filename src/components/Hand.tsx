"use client";

import { useShallow } from "zustand/shallow";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { CardComponent } from "./Card";

export function Hand({ id: heroId, cards }: Pick<Hero, "id" | "cards">) {
	const { playCard, setHoveredCard } = useBattleStore(
		useShallow((state) => ({
			playCard: state.playCard,
			setHoveredCard: state.setHoveredCard,
		})),
	);

	return (
		<div className="w-full h-32 flex justify-center items-center gap-2">
			{cards.map((card) => (
				<button
					key={card.id}
					type="button"
					className="transition-all duration-300 hover:z-50 hover:scale-120 cursor-pointer origin-bottom focus:outline-none"
					onClick={() => playCard(heroId, card.id)}
					onMouseEnter={() => setHoveredCard({ heroId, cardId: card.id })}
					onMouseLeave={() => setHoveredCard(null)}
				>
					<CardComponent {...card} />
				</button>
			))}
		</div>
	);
}
