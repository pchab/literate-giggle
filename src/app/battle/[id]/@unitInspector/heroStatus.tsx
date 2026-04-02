"use client";

import { motion } from "framer-motion";
import type { BattleHero } from "@/modules/units/domain/units.type";

export default function HeroStatusSidebar({ hero }: { hero: BattleHero }) {
	// ==========================================
	// STATUS AGGREGATION
	// ==========================================
	const aggregatedStatuses = hero.statuses?.reduce(
		(acc, status) => {
			if (!acc[status.type]) {
				acc[status.type] = { ...status };
			} else {
				acc[status.type].amount += status.amount;
			}
			return acc;
		},
		{} as Record<string, (typeof hero.statuses)[0]>,
	);

	const displayStatuses = Object.values(aggregatedStatuses || {});
	const totalBlock =
		displayStatuses.find((s) => s.type === "block")?.amount || 0;
	const otherStatuses = displayStatuses.filter((s) => s.type !== "block");

	return (
		<motion.div
			key={hero.id}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			transition={{ duration: 0.2 }}
			className="flex flex-col gap-3 p-4 bg-zinc-950/80 border border-blue-900/40 rounded-lg shadow-[0_0_20px_rgba(30,58,138,0.15)] relative overflow-hidden h-full"
		>
			<div className="absolute inset-0 bg-linear-to-b from-blue-950/20 to-transparent pointer-events-none" />

			{/* --- HEADER & HP --- */}
			<div className="relative z-10 flex flex-col gap-1.5">
				<div className="flex items-center justify-between mb-1">
					<h3 className="text-sm font-bold text-blue-300 uppercase tracking-widest drop-shadow-md">
						{hero.name}
					</h3>

					<div className="flex items-center gap-3">
						<span className="text-[11px] font-mono text-zinc-300">
							Move {hero.baseMove}
						</span>
						<span className="text-[11px] font-mono text-zinc-300">
							Def {hero.baseDef}
						</span>
						<span className="text-[11px] font-mono text-zinc-300">
							{hero.currentHp} / {hero.maxHp} HP
						</span>
					</div>
				</div>
				<div className="w-full h-1.5 bg-zinc-900 rounded-sm overflow-hidden border border-zinc-800 shadow-inner">
					<motion.div
						className="h-full bg-red-600 origin-left"
						initial={{
							width: `${(hero.currentHp / hero.maxHp) * 100}%`,
						}}
						animate={{
							width: `${Math.max(0, (hero.currentHp / hero.maxHp) * 100)}%`,
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
		</motion.div>
	);
}
