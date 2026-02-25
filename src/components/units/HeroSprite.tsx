"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useShallow } from "zustand/shallow";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { UnitSprite } from "./UnitSprite"; // Assuming you use the same or a similar sprite component
import { useCombatText } from "./useCombatText.hook";

export default function HeroSprite({ unitInCell }: { unitInCell: Hero }) {
	const { activeCard } = useBattleStore(
		useShallow((state) => ({
			activeCard: state.activeCard,
		})),
	);

	const { texts, isHit } = useCombatText(unitInCell.currentHp);

	const currentHp = unitInCell.currentHp;
	const maxHp = unitInCell.maxHp;
	const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

	const isActive = activeCard?.heroId === unitInCell.id;

	return (
		<div className="absolute inset-0 z-10 flex flex-col items-center justify-end">
			<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
				<AnimatePresence>
					{texts.map((text) => (
						<motion.span
							key={text.id}
							initial={{ opacity: 1, y: 0, scale: 1 }}
							animate={{
								opacity: [1, 1, 0],
								y: [0, -15, -40],
								scale: [1, 1.4, 1],
							}}
							exit={{ opacity: 0 }}
							transition={{ duration: 1, ease: "easeOut" }}
							className={`absolute text-xl font-black drop-shadow-md ${text.type === "damage" ? "text-red-500" : "text-green-400"}`}
							style={{
								textShadow:
									"2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
							}}
						>
							{text.type === "damage" ? "-" : "+"}
							{text.amount}
						</motion.span>
					))}
				</AnimatePresence>
			</div>

			<div className="relative w-24 h-24 flex items-center justify-center z-10">
				<motion.div
					className={`
                        absolute inset-0 
                        flex items-center justify-center origin-bottom
                        ${isActive ? "ring-2 ring-white shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-110" : ""}
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
									scale: isActive
										? [1.1, 1.15, 1.15, 1.1, 1.1]
										: [1, 1.05, 1.05, 1, 1],
								}
							: {}
					}
					transition={{ duration: 0.4, ease: "easeInOut" }}
				>
					<UnitSprite type={unitInCell.heroClass} stance={0} />
				</motion.div>
			</div>

			<div className="absolute -bottom-2 w-14 flex flex-col items-center pointer-events-none z-20">
				<div className="w-full h-1.5 bg-zinc-950 border border-zinc-700/80 rounded-sm overflow-hidden shadow-lg relative">
					<motion.div
						className="h-full bg-red-600 origin-left"
						initial={{ width: `${hpPercent}%` }}
						animate={{ width: `${hpPercent}%` }}
						transition={{ type: "spring", bounce: 0, duration: 0.5 }}
					/>
				</div>

				<span className="text-[9px] font-bold text-zinc-300 mt-[1px] drop-shadow-md">
					{currentHp}/{maxHp}{" "}
					{unitInCell.currentPhysBlock > 0 &&
						`🛡️ ${unitInCell.currentPhysBlock}`}{" "}
					{unitInCell.currentMagBlock > 0 && `🔮 ${unitInCell.currentMagBlock}`}
				</span>
			</div>
		</div>
	);
}
