import { motion } from "motion/react";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import FloatingDamage from "@/modules/battle/components/FloatingDamage";
import HealthBar from "@/modules/battle/components/HealthBar";
import IntentDisplay from "@/modules/battle/components/IntentDisplay";
import { useCombatText } from "@/modules/battle/hooks/useCombatText";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { useSprite } from "@/modules/shared/hooks/useSprite";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import { getHeroColor } from "../data/heroPalette.data";
import { getBlockFromStatuses, isHero } from "../helpers/units.helpers";
import { useHeroSprite } from "../hooks/useHeroSprite";

export function UnitSprite({ unitInCell }: { unitInCell: BattleUnit }) {
	const {
		id,
		statuses,
		currentHp,
		spriteBase,
		stance,
		size = { cols: 1, rows: 1 },
	} = unitInCell;
	const currentBlock = getBlockFromStatuses(statuses);
	const { texts, isHit } = useCombatText(currentHp, currentBlock);
	const { aiIntents } = useBattleStore(
		useShallow((state) => ({
			aiIntents: state.aiIntents,
		})),
	);

	const spriteId = `${spriteBase}_${stance}`;
	const imageSrc = useSprite(spriteId, `/sprites/${spriteId}.webp`);
	const heroUnit = isHero(unitInCell);
	const sprite = useHeroSprite(imageSrc, unitInCell.variant, heroUnit);
	const heroColor = heroUnit ? getHeroColor(unitInCell.variant) : null;

	const intent = aiIntents?.[id];

	// Dynamically calculate width/height to span multiple tiles, including the gap-1 (4px)
	const wrapperStyle = {
		width: `calc((var(--width-grid) * ${size.cols}) + (4px * ${size.cols - 1}))`,
		height: `calc((var(--height-grid) * ${size.rows}) + (4px * ${size.rows - 1}))`,
	};

	return (
		<div
			style={wrapperStyle}
			className="absolute inset-0 flex flex-col items-center z-10"
		>
			{intent && <IntentDisplay intent={intent} />}

			{/* Hero identity: name plate + foot ring in the hero's colour */}
			{heroColor && (
				<>
					<span
						className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 text-[9px] font-bold uppercase tracking-wider px-1.5 rounded-sm bg-zinc-950/80 border pointer-events-none whitespace-nowrap"
						style={{ color: heroColor.hex, borderColor: `${heroColor.hex}80` }}
					>
						{unitInCell.name}
					</span>
					<div
						className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-[75%] h-4 rounded-[50%] z-0 pointer-events-none"
						style={{
							border: `2px solid ${heroColor.hex}`,
							background: `radial-gradient(ellipse, ${heroColor.hex}80, transparent 75%)`,
							boxShadow: `0 0 10px ${heroColor.hex}90`,
						}}
					/>
				</>
			)}

			<FloatingDamage texts={texts} />
			<motion.div
				layout
				layoutId={`unit-${id}`}
				transition={{ type: "spring", stiffness: 350, damping: 30 }}
				className="relative h-full flex pointer-events-none w-full"
			>
				<motion.div
					className="flex flex-col h-full w-full origin-bottom overflow-visible items-center"
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
					<Image
						src={sprite.src}
						alt={`${spriteBase} stance ${stance}`}
						width={0}
						height={0}
						sizes="100vw"
						// Ensures the image fills the new multi-tile wrapper nicely
						style={{
							width: "auto",
							height: "100%",
							maxWidth: "150%",
							filter: sprite.filter,
						}}
						className="z-20 object-contain object-bottom"
						priority
					/>
				</motion.div>
			</motion.div>

			{/* HealthBar stays at the bottom center of the whole multi-tile block */}
			<HealthBar unitId={unitInCell.id} />
		</div>
	);
}
