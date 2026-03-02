"use client";

import { domAnimation, LazyMotion, m } from "motion/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { BattleCard } from "@/components/cards/BattleCard";
import { RetroButton } from "@/components/ui/RetroButton";
import { RetroPanel } from "@/components/ui/RetroPanel";
import { cardLibrary } from "@/modules/cards/domain/cards.data";
import { CLASS_REGISTRY } from "@/modules/heroClass/domain/heroClass.data";
import { useBattleStore } from "@/store/battle.store";
import { useWorldStore } from "@/store/world.store";

export default function RewardScreen() {
	const { roster, claimRewards, phase, setPhase } = useWorldStore(
		useShallow((state) => ({
			roster: state.roster,
			claimRewards: state.claimRewards,
			phase: state.phase,
			setPhase: state.setPhase,
		})),
	);

	// Grab the XP we just earned from the Battle Store
	const { xpEarned, resetXpEarned } = useBattleStore(
		useShallow((state) => ({
			xpEarned: state.xpEarned,
			resetXpEarned: state.resetXpEarned,
		})),
	);

	// Snapshot the roster so animations don't break when state updates
	const [initialRoster] = useState(roster);

	if (phase !== "REWARD") {
		redirect("/");
	}
	// If there's no XP and no roster, something went wrong (or we refreshed), send back to map
	if (xpEarned === 0 || initialRoster.length === 0) {
		setPhase("MAP");
	}

	return (
		<LazyMotion features={domAnimation}>
			<div className="min-h-screen w-screen bg-zinc-950 text-slate-300 p-8 flex flex-col items-center justify-center overflow-hidden">
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
						Party Experience Gained
					</p>
				</m.div>

				{/* Container for Heroes */}
				<div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 justify-center">
					{initialRoster.map((hero, index) => {
						const classDef = CLASS_REGISTRY[hero.heroClass];

						// Safely get the XP required for the NEXT level
						const targetMaxXp = classDef.xpThresholds[hero.currentLevel] || 999;

						const startPercent = Math.min(
							(hero.currentXp / targetMaxXp) * 100,
							100,
						);
						const endPercent = Math.min(
							((hero.currentXp + xpEarned) / targetMaxXp) * 100,
							100,
						);
						const isLevelUp = hero.currentXp + xpEarned >= targetMaxXp;

						const primaryWeapon = cardLibrary[hero.deck[0]];

						return (
							<m.div
								key={hero.id}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className="flex-1 min-w-[300px]"
							>
								<RetroPanel
									title={hero.id}
									className="h-full relative overflow-hidden"
								>
									<div className="flex flex-col gap-6 pt-4">
										<div className="flex items-center gap-6">
											{/* Show their primary weapon or Hero Sprite here */}
											{primaryWeapon && (
												<div className="w-20 shrink-0 transform hover:scale-105 transition-transform">
													<BattleCard
														cardId={primaryWeapon.id}
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

												{/* The XP Bar */}
												<div className="h-4 w-full bg-slate-950 rounded border border-slate-700 relative overflow-hidden shadow-inner">
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
															duration: 1.2,
															delay: index * 0.2 + 0.5,
															ease: "easeOut",
														}}
													/>
												</div>

												{/* Text readout below the bar */}
												<div className="flex justify-between items-center text-xs font-mono h-6">
													<span className="text-slate-500">
														{Math.min(hero.currentXp + xpEarned, targetMaxXp)} /{" "}
														{targetMaxXp}
													</span>

													{/* Level Up Celebration Text */}
													{isLevelUp && (
														<m.span
															initial={{ opacity: 0, scale: 0.5, y: 10 }}
															animate={{ opacity: 1, scale: 1, y: 0 }}
															transition={{ delay: 1.8, type: "spring" }}
															className="text-yellow-400 font-black uppercase tracking-widest drop-shadow-[0_0_5px_rgba(250,204,21,0.8)] animate-pulse"
														>
															Level Up!
														</m.span>
													)}
												</div>
											</div>
										</div>
									</div>
								</RetroPanel>
							</m.div>
						);
					})}
				</div>

				<m.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.5 }}
					className="mt-12"
				>
					<RetroButton
						onClick={() => {
							claimRewards(xpEarned);
							resetXpEarned();
						}}
						variant="primary"
					>
						CLAIM & RETURN
					</RetroButton>
				</m.div>
			</div>
		</LazyMotion>
	);
}
