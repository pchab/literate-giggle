import type { Summon } from "@/modules/figures/domain/figures.type";
import FloatingDamage from "./FloatingDamage";
import HealthBar from "./HealthBar";
import { UnitSprite } from "./UnitSprite";
import { useCombatText } from "./useCombatText.hook";

interface SummonSpriteProps {
	unitInCell: Summon;
}

export default function SummonSprite({ unitInCell }: SummonSpriteProps) {
	const { texts, isHit } = useCombatText(unitInCell.currentHp);

	return (
		<div className="absolute inset-0 z-20 flex items-center justify-center">
			<FloatingDamage texts={texts} />

			<div className="relative w-24 h-24 flex items-center justify-center z-10">
				<UnitSprite spriteBase={unitInCell.spriteBase} isHit={isHit} />
			</div>

			<HealthBar currentHp={unitInCell.currentHp} maxHp={unitInCell.maxHp} />
		</div>
	);
}
