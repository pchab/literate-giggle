import FloatingDamage from "@/modules/battle/components/FloatingDamage";
import HealthBar from "@/modules/battle/components/HealthBar";
import { useCombatText } from "@/modules/battle/hooks/useCombatText.hook";
import type { Summon } from "@/modules/figures/domain/figures.type";
import { UnitSprite } from "./UnitSprite";

interface SummonSpriteProps {
	unitInCell: Summon;
}

export default function SummonSprite({ unitInCell }: SummonSpriteProps) {
	const { texts, isHit } = useCombatText(unitInCell.currentHp);

	return (
		<div className="absolute inset-0 z-20 flex items-center justify-center">
			<FloatingDamage texts={texts} />

			<UnitSprite
				id={unitInCell.id}
				spriteBase={unitInCell.spriteBase}
				isHit={isHit}
			/>

			<HealthBar currentHp={unitInCell.currentHp} maxHp={unitInCell.maxHp} />
		</div>
	);
}
