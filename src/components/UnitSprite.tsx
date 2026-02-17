import Image from "next/image";
import type { EnemyType, HeroClass } from "@/modules/figures/figures.type";

type SpriteType = HeroClass | EnemyType;

interface UnitSpriteProps {
	type: SpriteType;
	stance?: number;
}

const UNIT_ASSETS: (stance: number) => Record<SpriteType, string> = (
	stance,
) => ({
	Squire: `/sprites/squire_${stance}.png`,
	Knight: `/sprites/warrior_${stance}.png`,
	Mage: `/sprites/mage_${stance}.png`,
	Thief: `/sprites/thief_${stance}.png`,
	Boss: `/sprites/boss_${stance}.png`,
});

export function UnitSprite({ type, stance = 0 }: UnitSpriteProps) {
	const src = UNIT_ASSETS(stance)[type];

	return (
		<div className="relative w-full h-full flex items-center justify-center pointer-events-none -translate-y-4">
			<Image src={src} alt={type} fill className="object-contain" priority />
		</div>
	);
}
