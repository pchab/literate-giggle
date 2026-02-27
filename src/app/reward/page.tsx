"use client";

import { AnimatePresence, domAnimation, LazyMotion, m } from "motion/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { BattleCard } from "@/components/cards/BattleCard";
import { RetroButton } from "@/components/ui/RetroButton";
import { RetroPanel } from "@/components/ui/RetroPanel";
import { cardLibrary } from "@/modules/cards/domain/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useWorldStore } from "@/store/world.store";
import EvolutionModal from "./EvolutionModal";

export default function RewardScreen() {
	const { roster, pendingBattleLog, claimRewardsAndReturnToMap, evolveCard, setPhase } =
		useWorldStore();

	const [initialRoster] = useState(roster);
	const [evolvedCards, setEvolvedCards] = useState<Record<string, Card["id"]>>(
		{},
	);
	const [evolutionModal, setEvolutionModal] = useState<{
		heroId: Hero["id"];
		cardId: Card["id"];
	} | null>(null);

	if (Object.keys(pendingBattleLog).length === 0) {
		setPhase("MAP");
		redirect("/");
	}

	const handleEvolveChoice = (
		heroId: Hero["id"],
		oldCardId: Card["id"],
		newCardId: Card["id"],
	) => {
		evolveCard(heroId, oldCardId, newCardId);
		setEvolvedCards((prev) => ({
			...prev,
			[`${heroId}-${oldCardId}`]: newCardId,
		}));
		setEvolutionModal(null);
	};

	return (
		<LazyMotion features={domAnimation}>
			<div className="min-h-screen w-screen bg-zinc-950 text-slate-300 p-8 flex flex-col items-center justify-center">
				{/* Header */}
				<m.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<h1 className="text-5xl md:text-7xl font-pixel text-yellow-400 tracking-widest uppercase text-shadow-pixel">
						Victory
					</h1>
					<p className="text-slate-400 mt-2 tracking-widest text-sm uppercase font-bold">
						Combat Experience Gained
					</p>
				</m.div>

				{/* Container for Heroes */}
				<div className="w-full flex gap-8">
					{initialRoster.map(({ id: heroId, deck }) => {
						const cardIdUsed = pendingBattleLog[heroId] || {};
						const cardsUsed = deck.filter((card) => !!cardIdUsed[card.id]);

						if (cardsUsed.length === 0) return null;

						return (
							<m.div
								key={heroId}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.4 }}
								className="flex-1"
							>
								<RetroPanel title={heroId} className="h-full">
									<div className="flex flex-col gap-6 pt-4">
										{cardsUsed.map((card, index) => {
											const xpGained = pendingBattleLog[heroId][card.id];
											// Use dynamic maxXp!
											const targetMaxXp = card.maxXp || 1;

											const startPercent = Math.min(
												(card.xp / targetMaxXp) * 100,
												100,
											);
											const endPercent = Math.min(
												((card.xp + xpGained) / targetMaxXp) * 100,
												100,
											);
											const isMaxed = card.xp + xpGained >= targetMaxXp;
											const hasEvolved = !!evolvedCards[`${heroId}-${card.id}`];

											return (
												<div key={card.id} className="flex items-center gap-6">
													<div className="w-20 shrink-0 transform hover:scale-105 transition-transform">
														<BattleCard {...card} />
													</div>

													<div className="flex-1 flex flex-col gap-2">
														<div className="flex justify-between items-end">
															<span className="font-bold text-slate-200">
																{card.name || card.id}
															</span>
															<span className="text-cyan-400 font-mono text-sm">
																+{xpGained} XP
															</span>
														</div>

														<div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800 relative overflow-hidden shadow-inner">
															<div
																className="absolute top-0 left-0 h-full bg-cyan-950"
																style={{ width: `${startPercent}%` }}
															/>
															<m.div
																className="absolute top-0 h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
																style={{ left: `${startPercent}%` }}
																initial={{ width: "0%" }}
																animate={{
																	width: `${endPercent - startPercent}%`,
																}}
																transition={{
																	duration: 1,
																	delay: index * 0.2 + 0.3,
																	ease: "easeOut",
																}}
															/>
														</div>

														<div className="flex justify-between items-center text-xs font-mono text-slate-500 h-6">
															<span>
																{isMaxed ? targetMaxXp : card.xp + xpGained} /{" "}
																{targetMaxXp}
															</span>

															{isMaxed && !hasEvolved && (
																<m.div
																	initial={{ opacity: 0 }}
																	animate={{ opacity: 1 }}
																	transition={{ delay: 1.5 }}
																>
																	<RetroButton
																		onClick={() =>
																			setEvolutionModal({
																				heroId,
																				cardId: card.id,
																			})
																		}
																		variant="warning"
																		className="animate-pulse hover:animate-none scale-75 transform origin-right"
																	>
																		Evolve
																	</RetroButton>
																</m.div>
															)}

															{hasEvolved && (
																<m.span
																	initial={{ opacity: 0, scale: 0.8 }}
																	animate={{ opacity: 1, scale: 1 }}
																	className="text-cyan-400 font-bold uppercase"
																>
																	Evolved:{" "}
																	{
																		cardLibrary[
																			evolvedCards[`${heroId}-${card.id}`]
																		]?.name
																	}
																</m.span>
															)}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</RetroPanel>
							</m.div>
						);
					})}
				</div>

				<m.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1 }}
					className="mt-12"
				>
					<RetroButton onClick={claimRewardsAndReturnToMap} variant="primary">
						RETURN TO MAP
					</RetroButton>
				</m.div>
			</div>

			{/* Evolution Modal Overlay */}
			<AnimatePresence>
				{evolutionModal && (
					<EvolutionModal
						handleEvolveChoice={handleEvolveChoice}
						evolutionModal={evolutionModal}
						setEvolutionModal={setEvolutionModal}
					/>
				)}
			</AnimatePresence>
		</LazyMotion>
	);
}
