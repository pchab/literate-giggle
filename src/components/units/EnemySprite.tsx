"use client";

import { AnimatePresence, motion } from "motion/react";
import { useShallow } from "zustand/shallow";
import type { Monster } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { UnitSprite } from "./UnitSprite";
import { useCombatText } from "./useCombatText.hook";

export default function EnemySprite({ unitInCell }: { unitInCell: Monster }) {
	const { heroes, usedCardsThisTurn, activeCard, enemyIntents } =
		useBattleStore(
			useShallow((state) => ({
				heroes: state.heroes,
				usedCardsThisTurn: state.usedCardsThisTurn,
				activeCard: state.activeCard,
				enemyIntents: state.enemyIntents,
			})),
		);
	const { texts, isHit } = useCombatText(unitInCell.currentHp);

	const isEnemyTurn =
		!activeCard &&
		Object.keys(usedCardsThisTurn).length ===
			heroes.filter(({ currentHp }) => currentHp > 0).length;

	const stance = isEnemyTurn ? 1 : 0;
	const intent = enemyIntents?.[unitInCell.id];
	const currentHp = unitInCell.currentHp;
	const maxHp = unitInCell.maxHp;
	const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

	return (
		<div className="absolute inset-0 z-10 flex flex-col items-center justify-end">
			{/* Intent UI remains untouched */}
			{intent && !isEnemyTurn && (
				<div className="absolute -top-8 bg-zinc-950/90 border border-zinc-700 rounded px-2 py-1 flex items-center gap-1.5 shadow-lg pointer-events-none z-20">
					<span className="text-xs drop-shadow-md">
						{intent.attackData.effect === "physDmg" ? "⚔️" : "🔮"}
					</span>
					<span className="text-xs font-bold text-red-400">
						{intent.attackData.damage}
					</span>
				</div>
			)}

			{/* 1. MOTION: The Floating Damage Numbers */}
			<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
				<AnimatePresence>
					{texts.map((text) => (
						<motion.span
							key={text.id}
							// Start normal
							initial={{ opacity: 1, y: 0, scale: 1 }}
							// Pop up to scale 1.4, then float up to y: -40 and fade out
							animate={{
								opacity: [1, 1, 0],
								y: [0, -15, -40],
								scale: [1, 1.4, 1],
							}}
							// Remove from DOM when done!
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

			{/* 2. MOTION: The Stable Layout + Animated Inner Shell */}
			<div className="relative w-24 h-24 flex items-center justify-center z-10">
				<motion.div
					className="absolute inset-0 flex items-center justify-center origin-bottom"
					animate={
						isHit
							? {
									// Recreating the hit-flash keyframes with Motion!
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
					<UnitSprite type={unitInCell.enemyType} stance={stance} />
				</motion.div>
			</div>

			{/* Health Bar */}
			<div className="absolute -bottom-2 w-14 flex flex-col items-center pointer-events-none z-20">
				<div className="w-full h-1.5 bg-zinc-950 border border-zinc-700/80 rounded-sm overflow-hidden shadow-lg relative">
					{/* 3. MOTION: Smooth HP Bar Drain! */}
					<motion.div
						className="h-full bg-red-600 origin-left"
						initial={{ width: `${hpPercent}%` }}
						animate={{ width: `${hpPercent}%` }}
						transition={{ type: "spring", bounce: 0, duration: 0.5 }}
					/>
				</div>
			</div>
		</div>
	);
}
