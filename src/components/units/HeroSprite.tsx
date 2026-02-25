"use client";

import type { Hero } from "@/modules/figures/domain/figures.type";
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

	const currentHp = unitInCell.currentHp;
	const maxHp = unitInCell.maxHp;

	return (
		<div className="absolute inset-0 z-10 flex flex-col items-center justify-end">
			<FloatingDamage texts={texts} />

			<div className="relative w-24 h-24 flex items-center justify-center z-10">
				<UnitSprite type={unitInCell.heroClass} stance={0} isHit={isHit} />
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
