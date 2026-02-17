"use client";

import Image from "next/image";
import { Hand } from "./Hand";
import { HeroPortrait } from "./HeroPortrait";
import type { Hero } from "@/modules/figures/figures.type";
import { useBattleStore } from "@/store/battle.store";

export function HeroCard({ id, heroClass, cards }: Hero) {
	const usedCards = useBattleStore((state) => state.usedCards);
	const hasUsedCard = !!usedCards[id];

	return (
		<div className="relative flex flex-col">
			<Image
				src="/hero_card.png"
				alt="Hero"
				fill={true}
				className="absolute inset-0 z-0"
			/>
			<div className="flex z-10 justify-center items-center">
				<HeroPortrait classType={heroClass} />
				{!hasUsedCard && <Hand id={id} cards={cards} />}
			</div>
		</div>
	);
}
