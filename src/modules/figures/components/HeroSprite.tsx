"use client";

import { useBattleStore } from "@/modules/battle/store/battle.store";
import FloatingDamage from "../../battle/components/FloatingDamage";
import HealthBar from "../../battle/components/HealthBar";
import { useCombatText } from "../../battle/hooks/useCombatText.hook";
import type { BattleHero } from "../domain/figures.type";
import { getBlockFromStatuses } from "../helpers/figures.helpers";
import { UnitSprite } from "./UnitSprite";

export default function HeroSprite({ unitInCell }: { unitInCell: BattleHero }) {
	const currentBlock = getBlockFromStatuses(unitInCell.statuses);
	const { texts, isHit } = useCombatText(unitInCell.currentHp, currentBlock);
	const activeCard = useBattleStore((state) => state.activeCard);

	const currentHp = unitInCell.currentHp;
	const maxHp = unitInCell.maxHp;

	let stance = 0;
	if (activeCard?.heroId === unitInCell.id) {
		const { card } = activeCard;
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
				currentBlock={currentBlock}
			/>
		</div>
	);
}
