"use client";

import type { Hero } from "@/modules/figures/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { CardComponent } from "./Card";

export function Hand({ id: heroId, cards }: Pick<Hero, "id" | "cards">) {
	const playCard = useBattleStore((state) => state.playCard);
	return (
		<div className="w-full h-32 flex justify-center items-center gap-2">
			{cards.map((card) => (
				<button
					key={card.id}
					type="button"
					className="transition-all duration-300 hover:z-50 hover:scale-120 cursor-pointer origin-bottom focus:outline-none"
					onClick={() => playCard(heroId, card.id)}
				>
					<CardComponent {...card} />
				</button>
			))}
		</div>
	);
}
