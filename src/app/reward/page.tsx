"use client";

import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { redirect } from "next/navigation";
import { useState } from "react";
import { CardComponent } from "@/components/cards/Card";
import { formatCardEffect } from "@/modules/cards/cards.helper";
import { cardLibrary } from "@/modules/cards/domain/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useWorldStore } from "@/store/world.store";

export default function RewardScreen() {
	const { roster, pendingBattleLog, claimRewardsAndReturnToMap, evolveCard } =
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
			<div className="min-h-screen bg-[#0a0c10] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0c10] to-black text-slate-300 p-8 flex flex-col items-center">
				{/* Header */}
				<m.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl md:text-5xl font-serif text-cyan-400 tracking-widest uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
						Victory
					</h1>
					<p className="text-slate-500 mt-2 tracking-widest text-sm uppercase">
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
								className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 shadow-2xl relative overflow-hidden flex-1"
							>
								<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900 to-transparent opacity-50" />

								<h2 className="text-xl text-slate-400 font-serif mb-6 capitalize border-b border-slate-700/50 pb-2">
									{heroId}
								</h2>

								<div className="flex flex-col gap-6">
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
													<CardComponent {...card} />
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
															<m.button
																initial={{ opacity: 0 }}
																animate={{ opacity: 1 }}
																transition={{ delay: 1.5 }}
																onClick={() =>
																	setEvolutionModal({ heroId, cardId: card.id })
																}
																className="text-yellow-400 font-bold uppercase bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded cursor-pointer animate-pulse hover:animate-none hover:bg-yellow-400/20 transition-colors"
															>
																Evolve Now
															</m.button>
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
							</m.div>
						);
					})}
				</div>

				<m.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1 }}
					type="button"
					onClick={claimRewardsAndReturnToMap}
					className="mt-12 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest rounded transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
				>
					RETURN TO MAP
				</m.button>
			</div>

			{/* Evolution Modal Overlay */}
			<AnimatePresence>
				{evolutionModal && (
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
					>
						<m.div
							initial={{ scale: 0.9, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.9, y: 20 }}
							className="bg-slate-900 border-2 border-slate-700 rounded-xl max-w-2xl w-full p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative"
						>
							<button
								type="button"
								onClick={() => setEvolutionModal(null)}
								className="absolute top-4 right-4 text-slate-500 hover:text-white font-bold text-xl"
							>
								✕
							</button>

							<div className="text-center mb-8">
								<h2 className="text-3xl font-serif text-yellow-500 mb-2">
									Choose Evolution
								</h2>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								{cardLibrary[evolutionModal.cardId]?.evolutions.map((evoId) => {
									const evoData = cardLibrary[evoId];
									if (!evoData) return null;

									return (
										<button
											type="button"
											key={evoId}
											onClick={() =>
												handleEvolveChoice(
													evolutionModal.heroId,
													evolutionModal.cardId,
													evoId,
												)
											}
											className="group cursor-pointer bg-slate-800 border border-slate-600 rounded-lg p-6 hover:border-yellow-400 hover:bg-slate-700 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(250,204,21,0.2)] flex flex-col gap-3 text-left relative overflow-hidden"
										>
											{/* Visual indicator for Class Promotions */}
											{evoData.promotesToClass && (
												<div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black uppercase px-2 py-1 rounded-bl-lg">
													Class Promotion!
												</div>
											)}

											<div className="flex justify-between items-start mt-2">
												<h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
													{evoData.name}
												</h3>
											</div>

											{/* Visual indicator for Passives */}
											{evoData.grantsPassive && (
												<div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
													<span>✨ Unlocks Passive:</span>
													<span className="uppercase">
														{evoData.grantsPassive.replace("passive-", "")}
													</span>
												</div>
											)}

											{evoData.effects.map((effect, index) => (
												<div
													key={index}
													className="flex gap-2 text-xs font-mono text-cyan-400 pt-3 border-t border-slate-700"
												>
													{formatCardEffect(effect)}
												</div>
											))}
										</button>
									);
								})}
							</div>
						</m.div>
					</m.div>
				)}
			</AnimatePresence>
		</LazyMotion>
	);
}
