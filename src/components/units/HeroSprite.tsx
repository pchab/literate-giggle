"use client";

import type { Hero } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import FloatingDamage from "./FloatingDamage";
import HealthBar from "./HealthBar";
import { UnitSprite } from "./UnitSprite";
import { useCombatText } from "./useCombatText.hook";

export default function HeroSprite({ unitInCell }: { unitInCell: Hero }) {
	const { texts, isHit } = useCombatText(
		unitInCell.currentHp,
		unitInCell.currentPhysBlock,
		unitInCell.currentMagBlock,
	);
	const activeCard = useBattleStore((state) => state.activeCard);

	const currentHp = unitInCell.currentHp;
	const maxHp = unitInCell.maxHp;

	let stance = 0;
	if (activeCard?.heroId === unitInCell.id) {
		const allEffects = activeCard.card.effects.map(({ type }) => type);
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

			<div className="relative w-24 h-24 flex items-center justify-center z-10">
				<UnitSprite type={unitInCell.heroClass} stance={stance} isHit={isHit} />
			</div>

			<HealthBar
				currentHp={currentHp}
				maxHp={maxHp}
				currentPhysBlock={unitInCell.currentPhysBlock}
				currentMagBlock={unitInCell.currentMagBlock}
			/>
		</div>
	);
}
