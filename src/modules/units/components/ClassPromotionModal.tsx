"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { PASSIVE_REGISTRY } from "@/modules/battle/data/passives.data";
import { BattleCard } from "@/modules/cards/components/BattleCard";
import { HeroCardView } from "@/modules/cards/components/HeroCardView";
import type { Card, HeroCard } from "@/modules/cards/domain/cards.type";
import { RetroPanel } from "@/modules/shared/components/RetroPanel";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import type { PassiveId } from "@/modules/units/data/passiveIds.data";
import type { HeroClass } from "@/modules/units/domain/heroClass.types";
import { useWorldStore } from "@/modules/world/store/world.store";
import { HeroPortrait } from "./HeroPortrait";
import { HeroSummary } from "./HeroSummary";

export function ClassPromotionModal() {
	const { getCard } = useRegistryStore(
		useShallow((state) => ({
			getCard: state.getCard,
		})),
	);
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
					className="max-w-5xl w-full max-h-full overflow-y-auto"
				>
					<RetroPanel
						title={`Promote ${hero.name}${pendingPromotions.length > 1 ? ` (1 of ${pendingPromotions.length})` : ""}`}
					>
						<div className="flex flex-col gap-2 mt-2">
							<span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
								Who is being promoted · upgrades and passives are kept
							</span>
							<HeroSummary hero={hero} />
						</div>
						<div className="flex flex-col md:flex-row justify-center items-stretch gap-8 mt-6">
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
									? getCard(showcaseCardId)
									: null;

								// The hero's own copy of the replaced weapon keeps its runes.
								const upgradedWeapon: HeroCard | null =
									primaryWeaponTrigger?.type === "cardUpgrade"
										? (() => {
												const owned = hero.deck.find(
													(c) =>
														c.baseCardId === primaryWeaponTrigger.oldCardId,
												);
												return owned
													? {
															...owned,
															baseCardId: primaryWeaponTrigger.newCardId,
														}
													: null;
											})()
										: null;
								const oldWeaponName =
									primaryWeaponTrigger?.type === "cardUpgrade"
										? getCard(primaryWeaponTrigger.oldCardId)?.name
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

										{upgradedWeapon ? (
											<div className="mt-6 flex flex-col items-center gap-1 pointer-events-none">
												<span className="text-[10px] text-zinc-400 uppercase tracking-wider">
													{oldWeaponName} → {showcaseCard?.name}
												</span>
												<HeroCardView
													heroCard={upgradedWeapon}
													tooltip={false}
												/>
											</div>
										) : (
											showcaseCard && (
												<div className="mt-6 pointer-events-none transform transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
													<BattleCard
														card={showcaseCard}
														isPlayable={false}
														isStatic
													/>
												</div>
											)
										)}

										<div className="flex flex-col items-center w-full mt-2 gap-2">
											<h3 className="text-xl font-pixel text-zinc-200 group-hover:text-amber-400 transition-colors text-shadow-pixel">
												{classDef.name}
											</h3>
											<div className="w-12 h-px bg-zinc-700 my-1 group-hover:bg-amber-500/50 transition-colors" />

											<div className="flex flex-col gap-1 items-center">
												{immediateBonuses.map((trigger) => {
													if (trigger.type === "statsIncrease") {
														return (
															<span
																key={crypto.randomUUID()}
																className="text-xs font-mono text-cyan-400 font-bold tracking-wide"
															>
																+{trigger.amount} {trigger.stat.toUpperCase()}
															</span>
														);
													}
													if (trigger.type === "passiveUnlock") {
														const passive =
															PASSIVE_REGISTRY[trigger.passiveId as PassiveId];
														return (
															<div
																key={crypto.randomUUID()}
																className="mt-2 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded text-[10px] font-bold text-emerald-400 flex flex-col items-center gap-0.5 shadow-inner max-w-48"
															>
																<span className="flex items-center gap-1.5">
																	<span className="text-emerald-300">
																		{passive?.icon ?? "✨"} Passive:
																	</span>
																	<span className="uppercase tracking-wider">
																		{passive?.name ?? trigger.passiveId}
																	</span>
																</span>
																{passive && (
																	<span className="font-normal text-emerald-200/80 text-center leading-snug">
																		{passive.description}
																	</span>
																)}
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

	const isOwned = (cardId: Card["id"]) =>
		hero.deck.some((c) => c.baseCardId === cardId);
	const allSkillsOwned = classDef.utilityCardChoices.every(isOwned);
	const canAccept = !!selectedCardId || allSkillsOwned;

	const handleAcceptPromotion = () => {
		if (!canAccept) return;
		resolvePromotion(
			currentPromotion.heroId,
			selectedClassId,
			selectedCardId ?? ("" as Card["id"]),
		);
		setSelectedClassId(null);
		setSelectedCardId(null);
	};

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

				<button
					type="button"
					onClick={() => {
						setSelectedClassId(null);
						setSelectedCardId(null);
					}}
					className="absolute top-6 left-6 z-20 text-xs uppercase tracking-widest text-zinc-400 hover:text-amber-400 border border-zinc-700 hover:border-amber-500 px-3 py-1.5 rounded transition-colors"
				>
					← Choose another path
				</button>

				<motion.h2
					className="text-4xl font-black text-amber-400 tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] mb-2 text-center"
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, type: "spring" }}
				>
					{hero.name} becomes a {classDef.name}
				</motion.h2>
				<span className="text-xs text-zinc-500 uppercase tracking-widest mb-10">
					Level {hero.currentLevel} {CLASS_REGISTRY[hero.heroClass]?.name}
					{pendingPromotions.length > 1 &&
						` · promotion 1 of ${pendingPromotions.length}`}
				</span>

				<div className="flex items-center gap-12 z-10">
					{/* Old Class */}
					<motion.div className="flex flex-col items-center opacity-50 grayscale">
						<HeroPortrait classType={hero.heroClass} variant={hero.variant} />
						<span className="mt-4 text-zinc-500 font-bold tracking-widest uppercase">
							{CLASS_REGISTRY[hero.heroClass]?.name ?? hero.heroClass}
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
							<HeroPortrait
								classType={selectedClassId}
								variant={hero.variant}
							/>
						</div>
						<span className="mt-8 text-amber-400 font-black text-xl tracking-widest uppercase drop-shadow-md">
							{classDef.name}
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
							Choose your Class Skill
						</h3>
						<div className="flex gap-8">
							{classDef.utilityCardChoices.map((cardId) => {
								const isSelected = selectedCardId === cardId;
								const card = getCard(cardId);
								if (!card) {
									console.warn(`Card with ID ${cardId} not found in registry.`);
									return null;
								}
								return (
									<button
										type="button"
										key={cardId}
										disabled={isOwned(cardId)}
										onClick={() => setSelectedCardId(cardId)}
										className={`relative transition-all duration-300 ${isSelected ? "scale-110 shadow-[0_0_30px_rgba(251,191,36,0.4)]" : "scale-100 hover:scale-105 opacity-70 hover:opacity-100 grayscale hover:grayscale-0"}`}
									>
										<BattleCard card={card} isPlayable={false} isStatic />
										{isOwned(cardId) && (
											<span className="absolute -top-2 left-1/2 -translate-x-1/2 z-50 text-[8px] font-bold uppercase bg-zinc-700 text-zinc-200 px-1.5 rounded-sm">
												Already owned
											</span>
										)}
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

				{allSkillsOwned && (
					<span className="mt-6 text-xs text-zinc-400 z-10">
						{hero.name} already knows every {classDef.name} skill.
					</span>
				)}

				{canAccept && (
					<motion.button
						className={`mt-12 px-8 py-3 font-bold tracking-widest uppercase rounded shadow-lg transition-all z-10 bg-amber-600 hover:bg-amber-500 text-zinc-950 cursor-pointer`}
						onClick={handleAcceptPromotion}
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
