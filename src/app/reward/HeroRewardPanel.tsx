"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";
import { BattleCard } from "@/modules/cards/components/BattleCard";
import type { CardEffect } from "@/modules/cards/domain/cards.type";
import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import { CLASS_REGISTRY } from "@/modules/figures/data/heroClass.data";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { RuneDraftOption } from "@/modules/figures/domain/heroClass.types";
import { RetroPanel } from "@/modules/shared/components/RetroPanel";

const runeTypeToCardEffectType: Record<string, CardEffect["type"]> = {
	bonusDamage: "damage",
	bonusHeal: "heal",
	bonusStatusAmount: "apply_status",
	bonusStatusDuration: "apply_status",
};

export default function HeroRewardPanel({
	hero,
	xpEarned,
	index,
	onDraftComplete,
}: {
	hero: Hero;
	xpEarned: number;
	index: number;
	onDraftComplete: (
		draft: { rune: RuneDraftOption; cardInstanceId: string } | null,
	) => void;
}) {
	const classDef = CLASS_REGISTRY[hero.heroClass];
	const targetMaxXp = classDef.xpThresholds[hero.currentLevel] || 999;

	const startPercent = Math.min((hero.currentXp / targetMaxXp) * 100, 100);
	const endPercent = Math.min(
		((hero.currentXp + xpEarned) / targetMaxXp) * 100,
		100,
	);
	const isLevelUp = hero.currentXp + xpEarned >= targetMaxXp;

	// Find if this specific level-up grants a Power Rune
	const powerRuneTrigger = isLevelUp
		? classDef.levelUpTriggers[hero.currentLevel]?.find(
				(t) => t.type === "powerRune",
			)
		: null;

	// State machine for the panel
	const [step, setStep] = useState<"xp" | "chooseRune" | "chooseCard" | "done">(
		"xp",
	);
	const [selectedRune, setSelectedRune] = useState<RuneDraftOption | null>(
		null,
	);

	// Auto-advance to Draft UI after XP bar fills (if they leveled up & get a rune)
	useEffect(() => {
		if (isLevelUp && powerRuneTrigger) {
			const timer = setTimeout(() => setStep("chooseRune"), 2500); // Waits for bar animation
			return () => clearTimeout(timer);
		} else {
			// If no draft needed, immediately signal readiness
			onDraftComplete(null);
		}
	}, [isLevelUp, powerRuneTrigger, onDraftComplete]);

	const primaryWeapon = hero.deck[0];

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
			className="flex-1 min-w-75"
		>
			<RetroPanel
				title={hero.id}
				className="h-full relative overflow-hidden min-h-40"
			>
				{/* STEP 1: Default XP Bar */}
				{step === "xp" && (
					<m.div
						className="flex flex-col gap-6 pt-4"
						exit={{ opacity: 0, y: -10 }}
					>
						<div className="flex items-center gap-6">
							{primaryWeapon && (
								<div className="w-20 shrink-0 transform hover:scale-105 transition-transform">
									<BattleCard
										card={getComputedCard(primaryWeapon)}
										isPlayable={false}
									/>
								</div>
							)}

							<div className="flex-1 flex flex-col gap-2">
								<div className="flex justify-between items-end">
									<div className="flex flex-col">
										<span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">
											{classDef.name} Lv.{hero.currentLevel}
										</span>
									</div>
									<span className="text-cyan-400 font-mono text-sm font-bold">
										+{xpEarned} XP
									</span>
								</div>

								<div className="h-4 w-full bg-slate-950 rounded border border-slate-700 relative overflow-hidden shadow-inner">
									<div
										className="absolute top-0 left-0 h-full bg-cyan-950"
										style={{ width: `${startPercent}%` }}
									/>
									<m.div
										className="absolute top-0 h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
										style={{ left: `${startPercent}%` }}
										initial={{ width: "0%" }}
										animate={{ width: `${endPercent - startPercent}%` }}
										transition={{
											duration: 1.2,
											delay: index * 0.2 + 0.5,
											ease: "easeOut",
										}}
									/>
								</div>

								<div className="flex justify-between items-center text-xs font-mono h-6">
									<span className="text-slate-500">
										{Math.min(hero.currentXp + xpEarned, targetMaxXp)} /{" "}
										{targetMaxXp}
									</span>
									{isLevelUp && (
										<m.span
											initial={{ opacity: 0, scale: 0.5, y: 10 }}
											animate={{ opacity: 1, scale: 1, y: 0 }}
											transition={{ delay: 1.8, type: "spring" }}
											className="text-yellow-400 font-black uppercase tracking-widest animate-pulse"
										>
											Level Up!
										</m.span>
									)}
								</div>
							</div>
						</div>
					</m.div>
				)}

				{/* STEP 2: Choose Rune */}
				{step === "chooseRune" &&
					powerRuneTrigger &&
					powerRuneTrigger.type === "powerRune" && (
						<m.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex flex-col gap-3 pt-2"
						>
							<span className="text-xs font-bold text-yellow-400 uppercase">
								Draft an Upgrade:
							</span>
							<div className="flex flex-col gap-2">
								{powerRuneTrigger.choices.map((rune, i) => (
									<button
										type="button"
										key={i}
										onClick={() => {
											setSelectedRune(rune);
											setStep("chooseCard");
										}}
										className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded p-2 text-sm text-left transition-colors flex justify-between items-center"
									>
										<span className="text-slate-200">{rune.label}</span>
										<span className="text-xs text-emerald-400 font-mono">
											+{rune.amount}
										</span>
									</button>
								))}
							</div>
						</m.div>
					)}

				{/* STEP 3: Choose Card */}
				{step === "chooseCard" && selectedRune && (
					<m.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex flex-col gap-3 pt-2 h-full"
					>
						<div className="flex justify-between items-center">
							<span className="text-xs font-bold text-cyan-400 uppercase">
								Apply {selectedRune.label} to:
							</span>
							<button
								type="button"
								onClick={() => setStep("chooseRune")}
								className="text-[10px] text-slate-500 hover:text-slate-300 uppercase"
							>
								Back
							</button>
						</div>
						{/* Scrollable grid of deck */}
						<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700">
							{hero.deck
								.filter((cardInstance) => {
									if (selectedRune.type === "bonusRange") return true;

									return cardInstance.effects.some((effect) => {
										if (
											selectedRune.type === "bonusStatusAmount" ||
											selectedRune.type === "bonusStatusDuration"
										) {
											return (
												effect.type === "apply_status" &&
												effect.statusType === selectedRune.statusType
											);
										}

										return (
											effect.type ===
											runeTypeToCardEffectType[selectedRune.type]
										);
									});
								})
								.map((cardInstance) => (
									<button
										type="button"
										key={cardInstance.instanceId}
										className="w-20 shrink-0 cursor-pointer transform hover:scale-105 hover:-translate-y-1 transition-all"
										onClick={() => {
											setStep("done");
											onDraftComplete({
												rune: selectedRune,
												cardInstanceId: cardInstance.instanceId,
											});
										}}
									>
										<BattleCard
											card={getComputedCard(cardInstance)}
											isPlayable={false}
										/>
									</button>
								))}
						</div>
					</m.div>
				)}

				{/* STEP 4: Done */}
				{step === "done" && selectedRune && (
					<m.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex flex-col items-center justify-center h-full pt-4 text-center"
					>
						<span className="text-4xl mb-2">✨</span>
						<span className="text-sm font-bold text-emerald-400 uppercase">
							Upgrade Applied!
						</span>
						<span className="text-xs text-slate-400 mt-1">
							{selectedRune.label} successfully forged.
						</span>
					</m.div>
				)}
			</RetroPanel>
		</m.div>
	);
}
