"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { type Bark, useBattleStore } from "../store/battle.store";

const BARK_MS = 6000;

/** Speech bubbles above units (a boss announcing a new phase). */
export function BarkOverlay() {
	const { barks, units, gridSize } = useBattleStore(
		useShallow((state) => ({
			barks: state.barks,
			units: state.units,
			gridSize: state.gridSize,
		})),
	);

	// Only the newest bark per unit is shown.
	const latest = new Map<string, Bark>();
	for (const bark of barks) latest.set(bark.unitId, bark);

	return (
		<div
			className="absolute inset-0 grid gap-1 p-1 pointer-events-none z-40"
			style={{
				gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
				gridTemplateRows: `repeat(${gridSize.rows}, minmax(0, 1fr))`,
			}}
		>
			<AnimatePresence>
				{[...latest.values()].map((bark) => {
					const unit = units.find((u) => u.id === bark.unitId);
					if (!unit) return null;
					return (
						<BarkBubble
							key={bark.id}
							bark={bark}
							col={unit.gridPosition.col}
							row={unit.gridPosition.row}
							span={unit.size?.cols ?? 1}
						/>
					);
				})}
			</AnimatePresence>
		</div>
	);
}

function BarkBubble({
	bark,
	col,
	row,
	span,
}: {
	bark: Bark;
	col: number;
	row: number;
	span: number;
}) {
	useEffect(() => {
		const t = setTimeout(() => {
			useBattleStore.setState((s) => ({
				barks: s.barks.filter((b) => b.id !== bark.id),
			}));
		}, BARK_MS);
		return () => clearTimeout(t);
	}, [bark.id]);

	return (
		<div
			className="relative"
			style={{ gridColumn: `${col + 1} / span ${span}`, gridRow: `${row + 1}` }}
		>
			<motion.div
				role="status"
				data-bark={bark.unitId}
				style={{ x: "-50%" }}
				initial={{ opacity: 0, y: 6, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: -6 }}
				className="absolute bottom-full left-1/2 mb-1 w-max max-w-56 bg-zinc-100 text-zinc-900 text-[11px] font-bold leading-tight px-2 py-1 rounded shadow-lg"
			>
				{bark.text}
				<span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-100" />
			</motion.div>
		</div>
	);
}
