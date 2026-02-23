"use client";

import { useShallow } from "zustand/shallow";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { UnitSprite } from "./UnitSprite";

export default function HeroSprite({ unitInCell }: { unitInCell: Hero }) {
	const { currentMove, currentAttack } = useBattleStore(
		useShallow((state) => ({
			currentMove: state.currentMove,
			currentAttack: state.currentAttack,
		})),
	);

	const isUnitMoving = currentMove && unitInCell?.id === currentMove[0];
	const isUnitAttacking = currentAttack && unitInCell?.id === currentAttack[0];

	const stance = isUnitAttacking ? 2 : isUnitMoving ? 1 : 0;

	return (
		<div className="absolute inset-0 z-10">
			<UnitSprite type={unitInCell.heroClass} stance={stance} />
		</div>
	);
}
