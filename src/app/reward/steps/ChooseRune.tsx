import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { BattleCard } from "@/modules/cards/components/BattleCard";
import { CardTooltip } from "@/modules/cards/components/CardTooltip";
import type { Card, HeroCard } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { RuneDraftOption } from "@/modules/figures/domain/heroClass.types";
import {
	getExistingRuneCount,
	isCardCompatibleWithRune,
} from "../runeReward.helpers";

export default function ChooseRune({
	hero,
	deck,
	powerRuneQueue,
	index,
	handleChooseRune,
}: {
	hero: Hero;
	deck: Card[];
	powerRuneQueue: { choices: RuneDraftOption[] }[];
	index: number;
	handleChooseRune: (rune: RuneDraftOption) => void;
}) {
	const [hoveredCard, setHoveredCard] = useState<HeroCard["instanceId"] | null>(
		null,
	);
	const activeDraft = powerRuneQueue[index];

	if (!activeDraft) {
		return;
	}

	return (
		<m.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col gap-3 pt-2"
		>
			{/* --- NEW: Hero Loadout Preview --- */}
			<div className="flex flex-col gap-1 mb-1 bg-zinc-900/50 p-2 rounded border border-zinc-800">
				<span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
					Current Loadout
				</span>
				<div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-700 justify-center">
					{hero.deck.map((heroCard, idx) => {
						const runeCount = getExistingRuneCount(heroCard);
						return (
							<div
								key={heroCard.instanceId}
								className="w-16 shrink-0 flex flex-col items-center gap-1"
							>
								<AnimatePresence>
									{hoveredCard === heroCard.instanceId && (
										<m.div
											initial={{ opacity: 0, y: 10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, scale: 0.95 }}
											transition={{ duration: 0.15, ease: "easeOut" }}
											className="absolute bottom-[110%] left-1/2 -translate-x-1/2 pointer-events-none"
										>
											<CardTooltip card={deck[idx]} />
										</m.div>
									)}
								</AnimatePresence>
								<button
									type="button"
									onMouseEnter={() => setHoveredCard(heroCard.instanceId)}
									onMouseLeave={() => setHoveredCard(null)}
								>
									<BattleCard card={deck[idx]} isPlayable={false} />
								</button>
								{/* Indicator for existing upgrades */}
								<div className="h-4 flex items-center">
									{runeCount > 0 && (
										<span className="text-[9px] text-emerald-400 font-mono bg-emerald-950/80 px-1 rounded-sm border border-emerald-800">
											✨ {runeCount}
										</span>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="flex justify-between items-center">
				<span className="text-xs font-bold text-yellow-400 uppercase">
					Draft an Upgrade:
				</span>
				{powerRuneQueue.length > 1 && (
					<span className="text-[10px] text-zinc-500 uppercase">
						({index + 1}/{powerRuneQueue.length})
					</span>
				)}
			</div>

			<div className="flex flex-col gap-2">
				{activeDraft.choices.map((rune, i) => {
					// --- NEW: Compatibility Guard ---
					const hasValidTarget = deck.some((c) =>
						isCardCompatibleWithRune(c, rune),
					);

					return (
						<button
							type="button"
							key={i}
							disabled={!hasValidTarget}
							onClick={() => handleChooseRune(rune)}
							className={`border rounded p-2 text-sm text-left transition-colors flex justify-between items-center
                      ${
												hasValidTarget
													? "bg-zinc-800 hover:bg-zinc-700 border-zinc-600 cursor-pointer"
													: "bg-zinc-900 border-zinc-800 opacity-50 cursor-not-allowed"
											}`}
						>
							<span
								className={
									hasValidTarget
										? "text-slate-200"
										: "text-slate-500 line-through"
								}
							>
								{rune.label}
							</span>
							<div className="flex items-center gap-2">
								{!hasValidTarget && (
									<span className="text-[9px] text-red-400 uppercase font-bold tracking-wider">
										Incompatible
									</span>
								)}
								<span
									className={`font-mono text-xs ${hasValidTarget ? "text-emerald-400" : "text-slate-600"}`}
								>
									+{rune.amount}
								</span>
							</div>
						</button>
					);
				})}
			</div>
		</m.div>
	);
}
