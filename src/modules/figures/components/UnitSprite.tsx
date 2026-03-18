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

export function UnitSprite({
	unitInCell: { id, statuses, currentHp, maxHp, spriteBase, stance },
}: {
	unitInCell: BattleUnit;
}) {
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

	return (
		<div className="absolute inset-0 flex flex-col items-center">
			{intent && <IntentDisplay intent={intent} />}

			<FloatingDamage texts={texts} />
			<motion.div
				layout
				layoutId={`unit-${id}`}
				transition={{ type: "spring", stiffness: 350, damping: 30 }}
				className="relative h-full flex pointer-events-none"
			>
				<motion.div
					className="flex flex-col h-full origin-bottom overflow-x-visible items-center"
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
						style={{ width: "auto", height: "100%", maxWidth: "150%" }}
						className="z-20"
						priority
					/>
				</motion.div>
			</motion.div>

			<HealthBar currentHp={currentHp} maxHp={maxHp} statuses={statuses} />
		</div>
	);
}
