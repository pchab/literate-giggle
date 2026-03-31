import { motion } from "motion/react";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import FloatingDamage from "@/modules/battle/components/FloatingDamage";
import HealthBar from "@/modules/battle/components/HealthBar";
import IntentDisplay from "@/modules/battle/components/IntentDisplay";
import { useCombatText } from "@/modules/battle/hooks/useCombatText";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { getBlockFromStatuses } from "../helpers/figures.helpers";

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
			activeCard: state.activeHeroCard,
			activeMoveUnitId: state.activeMoveHeroId,
			aiIntents: state.aiIntents,
		})),
	);

	const src = `/sprites/${spriteBase}_${stance}.webp`;
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
						src={src}
						alt={`${spriteBase} stance ${stance}`}
						width={0}
						height={0}
						sizes="100vw"
						// Ensures the image fills the new multi-tile wrapper nicely
						style={{ width: "auto", height: "100%", maxWidth: "150%" }}
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
