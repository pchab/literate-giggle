"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useShallow } from "zustand/shallow";
import { isUnitInTile } from "@/modules/battle/helpers/grid.helpers";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { BattleCard } from "@/modules/cards/components/BattleCard";
import { CardTooltip } from "@/modules/cards/components/CardTooltip";
import { cardLibrary } from "@/modules/cards/data/cards.data";
import { isHero } from "@/modules/figures/helpers/figures.helpers";

export default function EnemyIntentSidebar() {
	const { units, hoveredCell, aiIntents } = useBattleStore(
		useShallow((state) => ({
			units: state.units, // <-- Unified array!
			hoveredCell: state.hoveredCell,
			aiIntents: state.aiIntents,
		})),
	);

	const aiUnit =
		hoveredCell &&
		units.find((u) => !isHero(u) && isUnitInTile(hoveredCell)(u));

	if (!hoveredCell || !aiUnit) {
		return (
			<div className="h-64 relative">
				<AnimatePresence mode="wait">
					<motion.div
						key="empty"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex items-center justify-center h-full border border-dashed border-zinc-800/50 rounded-lg text-zinc-600 text-xs uppercase tracking-widest font-bold"
					>
						Hover a target
					</motion.div>
				</AnimatePresence>
			</div>
		);
	}

	// ==========================================
	// STATUS AGGREGATION (Darkest Dungeon style UI)
	// ==========================================
	const aggregatedStatuses = aiUnit.statuses?.reduce(
		(acc, status) => {
			if (!acc[status.type]) {
				acc[status.type] = { ...status };
			} else {
				acc[status.type].amount += status.amount;
			}
			return acc;
		},
		{} as Record<string, (typeof aiUnit.statuses)[0]>,
	);

	const displayStatuses = Object.values(aggregatedStatuses || {});
	const totalBlock =
		displayStatuses.find((s) => s.type === "block")?.amount || 0;
	const otherStatuses = displayStatuses.filter((s) => s.type !== "block");

	return (
		<div className="h-64 relative">
			<AnimatePresence mode="wait">
				<motion.div
					key={aiUnit.id}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 10 }}
					transition={{ duration: 0.2 }}
					className="flex flex-col gap-3 p-4 bg-zinc-950/80 border border-red-900/40 rounded-lg shadow-[0_0_20px_rgba(153,27,27,0.15)] relative overflow-hidden h-full"
				>
					<div className="absolute inset-0 bg-linear-to-b from-red-950/20 to-transparent pointer-events-none" />

					{/* --- HEADER & HP --- */}
					<div className="relative z-10 flex flex-col gap-1.5">
						<div className="flex items-center justify-between mb-1">
							<h3 className="text-sm font-bold text-red-300 uppercase tracking-widest drop-shadow-md">
								{aiUnit.name}
							</h3>

							<div className="flex items-center gap-3">
								<span className="text-[11px] font-mono text-zinc-300">
									Move {aiUnit.baseMove}
								</span>
								<span className="text-[11px] font-mono text-zinc-300">
									Def {aiUnit.baseDef}
								</span>
								<span className="text-[11px] font-mono text-zinc-300">
									{aiUnit.currentHp} / {aiUnit.maxHp} HP
								</span>
							</div>
						</div>
						<div className="w-full h-1.5 bg-zinc-900 rounded-sm overflow-hidden border border-zinc-800 shadow-inner">
							<motion.div
								className="h-full bg-red-600 origin-left"
								initial={{
									width: `${(aiUnit.currentHp / aiUnit.maxHp) * 100}%`,
								}}
								animate={{
									width: `${Math.max(0, (aiUnit.currentHp / aiUnit.maxHp) * 100)}%`,
								}}
								transition={{ type: "spring", bounce: 0, duration: 0.5 }}
							/>
						</div>
					</div>

					{/* --- STATUS TRACKERS --- */}
					{displayStatuses.length > 0 && (
						<div className="relative z-10 flex flex-wrap gap-2 mt-1">
							{totalBlock > 0 && (
								<span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded border border-blue-800/50">
									🛡️ {totalBlock}
								</span>
							)}
							{otherStatuses.map((status, idx) => (
								<span
									key={idx}
									className="text-xs bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700 capitalize flex items-center gap-1"
								>
									{status.type === "poison"
										? "☠️"
										: status.type === "vulnerable"
											? "⚡"
											: "✨"}
									{status.type} {status.amount > 0 && status.amount}
								</span>
							))}
						</div>
					)}

					{/* --- INTENT/NEXT ACTION --- */}
					{aiIntents[aiUnit.id] &&
						(() => {
							const intentCard = cardLibrary[aiIntents[aiUnit.id].cardId];
							if (!intentCard) return null;

							return (
								<div className="flex flex-row z-10 mt-auto pt-3 border-t border-red-900/30 gap-2">
									<div>
										<h4 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-semibold">
											Next action
										</h4>
										<BattleCard card={intentCard} />
									</div>
									<CardTooltip card={intentCard} />
								</div>
							);
						})()}

					{/* --- INTENT/ON DEATH ACTION --- */}
					{aiUnit.onDeath &&
						(() => {
							const onDeathCard = cardLibrary[aiUnit.onDeath];
							if (!onDeathCard) return null;

							return (
								<div className="flex flex-row z-10 mt-auto pt-3 border-t border-red-900/30 gap-2">
									<div>
										<h4 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-semibold">
											On death
										</h4>
										<BattleCard card={onDeathCard} />
									</div>
									<CardTooltip card={onDeathCard} />
								</div>
							);
						})()}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
