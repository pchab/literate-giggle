"use client";

import { Hand } from "./Hand";
import { HeroPortrait } from "./HeroPortrait";
import Image from "next/image";
import { useBattleStore } from "@/store/battle.store";
import type { Hero } from "@/modules/figures/figures.type";

export function HeroCard({ id, heroClass, cards, hp, maxHp }: Hero) {
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
				<span className="text-xs text-zinc-300 ml-2">
					HP: {hp}/{maxHp}
				</span>
				{!hasUsedCard && <Hand id={id} cards={cards} />}
			</div>
		</div>
	);
}
