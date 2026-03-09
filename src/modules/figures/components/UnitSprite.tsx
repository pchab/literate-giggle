import { motion } from "motion/react";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import FloatingDamage from "@/modules/battle/components/FloatingDamage";
import HealthBar from "@/modules/battle/components/HealthBar";
import IntentDisplay from "@/modules/battle/components/IntentDisplay";
import { useCombatText } from "@/modules/battle/hooks/useCombatText.hook";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import {
	type BattleUnit,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import { getBlockFromStatuses } from "../helpers/figures.helpers";

export function UnitSprite({
	unitInCell: { id, statuses, currentHp, maxHp, spriteBase },
}: {
	unitInCell: BattleUnit;
}) {
	const currentBlock = getBlockFromStatuses(statuses);
	const { texts, isHit } = useCombatText(currentHp, currentBlock);
	const { activeCard, activeMoveUnitId, aiIntents } = useBattleStore(
		useShallow((state) => ({
			activeCard: state.activeCard,
			activeMoveUnitId: state.activeMoveUnitId,
			aiIntents: state.aiIntents,
		})),
	);

	let stance = UnitStance.IDLE;
	if (activeMoveUnitId === id) {
		stance = UnitStance.MOVING;
	}
	if (activeCard?.unitId === id) {
		stance = UnitStance.ATTACKING;
	}
	const src = `/sprites/${spriteBase}_${stance}.png`;
	const intent = aiIntents?.[id];

	return (
		<div className="absolute inset-0 z-10 flex flex-col items-center justify-end">
			{intent && <IntentDisplay intent={intent} />}

			<FloatingDamage texts={texts} />
			<motion.div
				layout
				layoutId={`unit-${id}`}
				transition={{ type: "spring", stiffness: 350, damping: 30 }}
				className="relative w-grid h-grid flex items-center justify-center pointer-events-none"
			>
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
							alt={`${spriteBase} stance ${stance}`}
							fill
							className="object-contain z-20"
							priority
						/>
					</div>
				</motion.div>
			</motion.div>

			<HealthBar
				currentHp={currentHp}
				maxHp={maxHp}
				currentBlock={currentBlock}
			/>
		</div>
	);
}
