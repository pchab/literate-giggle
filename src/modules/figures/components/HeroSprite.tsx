"use client";

import { useBattleStore } from "@/modules/battle/store/battle.store";
import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { Hero } from "@/modules/figures/domain/figures.type";
import FloatingDamage from "../../battle/components/FloatingDamage";
import HealthBar from "../../battle/components/HealthBar";
import { useCombatText } from "../../battle/hooks/useCombatText.hook";
import { UnitSprite } from "./UnitSprite";

export default function HeroSprite({ unitInCell }: { unitInCell: Hero }) {
	const { texts, isHit } = useCombatText(
		unitInCell.currentHp,
		unitInCell.currentBlock,
	);
	const activeCard = useBattleStore((state) => state.activeCard);

	const currentHp = unitInCell.currentHp;
	const maxHp = unitInCell.maxHp;

	let stance = 0;
	if (activeCard?.heroId === unitInCell.id) {
		const card = cardLibrary[activeCard.cardId];
		const allEffects = card.effects.map(({ type }) => type);
		if (allEffects.includes("move")) {
			stance = 1;
		}

		if (allEffects.includes("damage")) {
			stance = 2;
		}
	}

	return (
		<div className="absolute inset-0 z-10 flex flex-col items-center justify-end">
			<FloatingDamage texts={texts} />

			<UnitSprite
				id={unitInCell.id}
				spriteBase={unitInCell.spriteBase}
				stance={stance}
				isHit={isHit}
			/>

			<HealthBar
				currentHp={currentHp}
				maxHp={maxHp}
				currentBlock={unitInCell.currentBlock}
			/>
		</div>
	);
}
