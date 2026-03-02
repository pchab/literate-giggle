"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { BattleCard } from "@/components/cards/BattleCard";
import { RetroPanel } from "@/components/ui/RetroPanel";
import { cardLibrary } from "@/modules/cards/domain/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import { CLASS_REGISTRY } from "@/modules/heroClass/domain/heroClass.data";
import type { HeroClass } from "@/modules/heroClass/domain/heroClass.types";
import { useWorldStore } from "@/store/world.store";
import { HeroPortrait } from "./HeroPortrait";

export function ClassPromotionModal() {
	const { pendingPromotions, resolvePromotion, roster } = useWorldStore(
		useShallow((state) => ({
			pendingPromotions: state.pendingPromotions,
			resolvePromotion: state.resolvePromotion,
			roster: state.roster,
		})),
	);

	const [selectedClassId, setSelectedClassId] = useState<HeroClass | null>(
		null,
	);
	const [selectedCardId, setSelectedCardId] = useState<Card["id"] | null>(null);

	if (!pendingPromotions.length) return null;

	const currentPromotion = pendingPromotions[0];
	const hero = roster.find((h) => h.id === currentPromotion.heroId);
	if (!hero) return null;

	// --- PHASE 1: CLASS SELECTION (Replaces EvolutionModal) ---
	if (!selectedClassId) {
		return (
			<motion.div
				initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
				animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
				exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
				className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4"
			>
				<motion.div
					initial={{ scale: 0.95, y: 10 }}
					animate={{ scale: 1, y: 0 }}
					className="max-w-4xl w-full"
				>
					<RetroPanel title="Choose Your Path">
						{/* Optional: Add a cancel/close button here if promotions are optional */}
						<div className="flex flex-col md:flex-row justify-center items-stretch gap-8 mt-4">
							{currentPromotion.classChoices.map((classId) => {
								const classDef = CLASS_REGISTRY[classId];
								if (!classDef) return null;

								const immediateBonuses = classDef.levelUpTriggers[0] || [];
								const primaryWeaponTrigger = immediateBonuses.find(
									(t) => t.type === "cardUpgrade" || t.type === "cardUnlock",
								);

								let showcaseCardId = null;
								if (primaryWeaponTrigger?.type === "cardUpgrade") {
									showcaseCardId = primaryWeaponTrigger.newCardId;
								} else if (
									primaryWeaponTrigger?.type === "cardUnlock" &&
									primaryWeaponTrigger.newCards.length > 0
								) {
									showcaseCardId = primaryWeaponTrigger.newCards[0];
								}

								const showcaseCard = showcaseCardId
									? cardLibrary[showcaseCardId]
									: null;

								return (
									<motion.button
										type="button"
										key={classId}
										whileHover={{ y: -5 }}
										onClick={() => setSelectedClassId(classId)}
										className="group relative flex-1 bg-zinc-900 border border-zinc-800 rounded-md p-6 hover:border-amber-500 hover:bg-zinc-800 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col items-center gap-4 text-center overflow-hidden"
									>
										<div className="absolute top-0 inset-x-0 bg-linear-to-r from-transparent via-amber-900 to-transparent py-1 border-b border-amber-500/50">
											<span className="text-amber-400 text-[10px] font-black uppercase tracking-widest text-shadow-pixel">
												Class Promotion
											</span>
										</div>

										{showcaseCard && (
											<div className="mt-6 pointer-events-none transform transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
												<BattleCard
													cardId={showcaseCard.id}
													isPlayable={false}
												/>
											</div>
										)}

										<div className="flex flex-col items-center w-full mt-2 gap-2">
											<h3 className="text-xl font-pixel text-zinc-200 group-hover:text-amber-400 transition-colors text-shadow-pixel">
												{classDef.name}
											</h3>
											<div className="w-12 h-px bg-zinc-700 my-1 group-hover:bg-amber-500/50 transition-colors" />

											<div className="flex flex-col gap-1 items-center">
												{immediateBonuses.map((trigger, idx) => {
													if (trigger.type === "statsIncrease") {
														return (
															<span
																key={idx}
																className="text-xs font-mono text-cyan-400 font-bold tracking-wide"
															>
																+{trigger.amount} {trigger.stat.toUpperCase()}
															</span>
														);
													}
													if (trigger.type === "passiveUnlock") {
														return (
															<div
																key={idx}
																className="mt-2 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 shadow-inner"
															>
																<span className="text-emerald-300">
																	✨ Passive:
																</span>
																<span className="uppercase tracking-wider">
																	{trigger.passiveId.replace("passive-", "")}
																</span>
															</div>
														);
													}
													return null;
												})}
											</div>
										</div>
									</motion.button>
								);
							})}
						</div>
					</RetroPanel>
				</motion.div>
			</motion.div>
		);
	}

	// --- PHASE 2: THE CEREMONY & UTILITY SELECTION ---
	const classDef = CLASS_REGISTRY[selectedClassId];
	if (!classDef) return null;

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-md"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				{/* Epic God-Rays Background */}
				<motion.div
					className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none"
					animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
					transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
				/>

				<motion.h2
					className="text-4xl font-black text-amber-400 tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] mb-12"
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, type: "spring" }}
				>
					Class Promotion
				</motion.h2>

				<div className="flex items-center gap-12 z-10">
					{/* Old Class */}
					<motion.div className="flex flex-col items-center opacity-50 grayscale">
						<HeroPortrait classType={hero.heroClass} />
						<span className="mt-4 text-zinc-500 font-bold tracking-widest uppercase">
							{hero.heroClass}
						</span>
					</motion.div>

					{/* The Arrow / Energy Transfer */}
					<motion.div
						className="text-4xl text-amber-500"
						initial={{ scale: 0 }}
						animate={{ scale: 1, x: [-10, 10, -10] }}
						transition={{
							scale: { delay: 0.5 },
							x: { repeat: Infinity, duration: 1.5 },
						}}
					>
						➾
					</motion.div>

					{/* New Class (Explodes in) */}
					<motion.div
						className="flex flex-col items-center relative"
						initial={{ scale: 0, rotate: -15 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{ delay: 0.8, type: "spring", bounce: 0.6 }}
					>
						<motion.div
							className="absolute inset-0 bg-white rounded-full z-20 pointer-events-none"
							initial={{ opacity: 1, scale: 1 }}
							animate={{ opacity: 0, scale: 2 }}
							transition={{ delay: 0.8, duration: 0.5 }}
						/>
						<div className="ring-4 ring-amber-400 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.6)] scale-125">
							<HeroPortrait classType={selectedClassId} />
						</div>
						<span className="mt-8 text-amber-400 font-black text-xl tracking-widest uppercase drop-shadow-md">
							{selectedClassId}
						</span>
					</motion.div>
				</div>

				{/* Utility Card Choice UI */}
				{classDef.utilityCardChoices.length > 0 && (
					<motion.div
						className="flex flex-col items-center z-10 mt-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.2 }}
					>
						<h3 className="text-zinc-300 uppercase tracking-widest mb-6 font-bold">
							Choose your Class Art
						</h3>
						<div className="flex gap-8">
							{classDef.utilityCardChoices.map((cardId) => {
								const isSelected = selectedCardId === cardId;
								return (
									<button
										type="button"
										key={cardId}
										onClick={() => setSelectedCardId(cardId)}
										className={`relative transition-all duration-300 ${isSelected ? "scale-110 shadow-[0_0_30px_rgba(251,191,36,0.4)]" : "scale-100 hover:scale-105 opacity-70 hover:opacity-100 grayscale hover:grayscale-0"}`}
									>
										<BattleCard cardId={cardId} isPlayable={false} />
										{isSelected && (
											<motion.div
												layoutId="card-selection-ring"
												className="absolute -inset-2 border-2 border-amber-400 rounded-xl pointer-events-none"
											/>
										)}
									</button>
								);
							})}
						</div>
					</motion.div>
				)}

				{selectedCardId && (
					<motion.button
						className={`mt-12 px-8 py-3 font-bold tracking-widest uppercase rounded shadow-lg transition-all z-10 bg-amber-600 hover:bg-amber-500 text-zinc-950 cursor-pointer`}
						onClick={() => {
							resolvePromotion(
								currentPromotion.heroId,
								selectedClassId,
								selectedCardId,
							);
							setSelectedClassId(null);
							setSelectedCardId(null);
						}}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						Accept Destiny
					</motion.button>
				)}
			</motion.div>
		</AnimatePresence>
	);
}
