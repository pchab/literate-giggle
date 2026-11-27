"use client";

import { useShallow } from "zustand/shallow";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import { getCellId } from "../helpers/grid.helpers";
import { useBattleStore } from "../store/battle.store";

/**
 * Drawn above the cells (z-31 > cells' z-30) but translucent, so units stay visible.
 * Tiles a boss has telegraphed (locked intents): marked all turn, not just on hover.
 * They are exactly what the move will hit.
 */
export function TelegraphOverlay() {
	const { aiIntents, gridSize } = useBattleStore(
		useShallow((state) => ({
			aiIntents: state.aiIntents,
			gridSize: state.gridSize,
		})),
	);
	const getCard = useRegistryStore((state) => state.getCard);

	const marked = new Map<string, { col: number; row: number; label: string }>();
	for (const intent of Object.values(aiIntents)) {
		if (!intent.lockedZone?.length) continue;
		const label = getCard(intent.cardId)?.name ?? "";
		for (const cell of intent.lockedZone) {
			const id = getCellId(cell);
			const existing = marked.get(id);
			marked.set(id, {
				...cell,
				label: existing ? `${existing.label} + ${label}` : label,
			});
		}
	}
	if (!marked.size) return null;

	return (
		<div
			className="absolute inset-0 grid gap-1 p-1 pointer-events-none z-31"
			style={{
				gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
				gridTemplateRows: `repeat(${gridSize.rows}, minmax(0, 1fr))`,
			}}
		>
			{[...marked.entries()].map(([id, { col, row, label }]) => (
				<div
					key={id}
					data-telegraph={id}
					title={label}
					className="relative rounded-md border-2 border-red-500/90 shadow-[inset_0_0_12px_rgba(220,38,38,0.45)]"
					style={{
						gridColumn: `${col + 1} / span 1`,
						gridRow: `${row + 1} / span 1`,
						backgroundImage:
							"repeating-linear-gradient(45deg, rgba(220,38,38,0.22) 0 6px, transparent 6px 14px)",
					}}
				>
					<span className="absolute top-0.5 right-1 text-[10px] font-bold text-red-300 drop-shadow">
						⚠
					</span>
				</div>
			))}
		</div>
	);
}
