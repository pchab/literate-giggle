"use client";

import Image from "next/image";
import { useShallow } from "zustand/shallow";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { Hand } from "./Hand";
import { HeroPortrait } from "./HeroPortrait";

export function HeroCard({
	id,
	heroClass,
	cards,
	currentHp,
	maxHp,
	currentPhysBlock,
	currentMagBlock,
}: Hero) {
	const {
		usedCardsThisTurn,
		currentMove,
		currentAttack,
		cancelCard,
	} = useBattleStore(useShallow((state) => ({
		usedCardsThisTurn: state.usedCardsThisTurn,
		currentMove: state.currentMove,
		currentAttack: state.currentAttack,
		cancelCard: state.cancelCard,
	})));
	const hasUsedCard = !!usedCardsThisTurn[id];
	const isCurrentPlayer = currentMove?.[0] === id || currentAttack?.[0] === id;

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
					HP: {currentHp}/{maxHp}
				</span>
				<span className="text-xs text-zinc-300 ml-2">
					Block: Phys {currentPhysBlock} / Mag {currentMagBlock}
				</span>
				{!hasUsedCard && <Hand id={id} cards={cards} />}
				{isCurrentPlayer && (
					<button 
					className="mt-12 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest rounded transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
					type="button" onClick={() => cancelCard(id, usedCardsThisTurn[id])}>
						Cancel
					</button>
				)}
			</div>
		</div>
	);
}
