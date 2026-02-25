import { motion } from "motion/react";
import Image from "next/image";
import type {
	EnemyType,
} from "@/modules/figures/domain/figures.type";
import type { HeroClass } from "@/modules/heroClass/heroClass.types";

type SpriteType = HeroClass | EnemyType;

interface UnitSpriteProps {
	type: SpriteType;
	stance?: number;
	isHit?: boolean;
}

const UNIT_ASSETS: (stance: number) => Record<SpriteType, string> = (
	stance,
) => ({
	SQUIRE: `/sprites/squire_${stance}.png`,
	KNIGHT: `/sprites/knight_${stance}.png`,
	CRYOMANCER: `/sprites/cryomancer_${stance}.png`,
	PYROMANCER: `/sprites/pyromancer_${stance}.png`,
	BARBARIAN: `/sprites/barbarian_${stance}.png`,
	PALADIN: `/sprites/paladin_${stance}.png`,
	CLERIC: `/sprites/cleric_${stance}.png`,
	THIEF: `/sprites/thief_${stance}.png`,
	BOSS: `/sprites/boss_${stance}.png`,
	SKELETON: `/sprites/skeleton_${stance}.png`,
	BAT: `/sprites/bat_${stance}.png`,
	ARCHER: `/sprites/archer_${stance}.png`,
});

export function UnitSprite({
	type,
	stance = 0,
	isHit = false,
}: UnitSpriteProps) {
	const src = UNIT_ASSETS(stance)[type];

	return (
		<motion.div
			className={`
                        absolute inset-0 
                        flex items-center justify-center origin-bottom
                    `}
			animate={
				isHit
					? {
							filter: [
								"brightness(1)",
								"brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)",
								"brightness(1)",
							],
							x: [0, -4, 4, -2, 0],
							rotate: [0, -3, 3, -1, 0],
							scale: [1, 1.05, 1.05, 1, 1],
						}
					: {}
			}
			transition={{ duration: 0.4, ease: "easeInOut" }}
		>
			<div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
				<Image
					src={src}
					alt={type}
					fill
					className="object-contain z-20"
					priority
				/>
			</div>
		</motion.div>
	);
}
