"use client";

import { motion } from "motion/react";
import type { SurfaceData } from "@/modules/battle/domain/grid.type";
import { BattleCard } from "@/modules/cards/components/BattleCard";
import { CardTooltip } from "@/modules/cards/components/CardTooltip";

export default function SurfaceInspectorSidebar({
	surface,
}: {
	surface: SurfaceData;
}) {
	const card = surface.onStep;

	return (
		<motion.div
			key={`surface-${surface.id}`}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			transition={{ duration: 0.2 }}
			className="flex flex-col gap-3 p-4 bg-zinc-950/80 border border-green-900/40 rounded-lg shadow-[0_0_20px_rgba(20,83,45,0.15)] relative overflow-hidden shrink-0"
		>
			<div className="absolute inset-0 bg-linear-to-b from-green-950/20 to-transparent pointer-events-none" />

			{/* --- HEADER --- */}
			<div className="relative z-10 flex items-center justify-between mb-1">
				<h3 className="text-sm font-bold text-green-300 uppercase tracking-widest drop-shadow-md">
					{surface.type.replace("_", " ")}
				</h3>
				<div className="flex items-center gap-3">
					{surface.charges !== undefined && (
						<span className="text-[11px] font-mono text-zinc-300">
							Charges: {surface.charges}
						</span>
					)}
					{surface.duration > 0 && (
						<span className="text-[11px] font-mono text-zinc-300">
							Turns: {surface.duration}
						</span>
					)}
				</div>
			</div>

			{/* --- TRIGGER/CARD --- */}
			{card && (
				<div className="flex flex-row z-10 mt-auto pt-3 border-t border-green-900/30 gap-2">
					<div>
						<h4 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-semibold">
							On Step
						</h4>
						<BattleCard card={card} />
					</div>
					<CardTooltip card={card} />
				</div>
			)}
		</motion.div>
	);
}
