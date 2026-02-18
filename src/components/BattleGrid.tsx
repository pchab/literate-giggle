"use client";

import type { Hero } from "@/modules/figures/figures.type";
import { UnitSprite } from "./UnitSprite";
import { useBattleStore } from "@/store/battle.store";
import { useShallow } from "zustand/shallow";
import { filterGridByAttackPattern } from "@/modules/figures/attacks";
import type { GridPosition } from "@/modules/grid/grid.type";

interface BattleGridProps {
	units?: Pick<Hero, "id" | "heroClass" | "gridPosition">[];
}

// 3 columns x 5 rows = 15 cells total
// Coordinates: (col, row) where col: 0..2, row: 0..4
const cells = Array.from({ length: 15 }, (_, i) => {
	const col = i % 3;
	const row = Math.floor(i / 3);
	return { id: `${col}-${row}`, col, row };
});

export function BattleGrid({ units = [] }: BattleGridProps) {
	const { currentMove, currentAttack, moveHero, monsters, heroes } =
		useBattleStore(
			useShallow((state) => ({
				currentMove: state.currentMove,
				currentAttack: state.currentAttack,
				moveHero: state.moveHero,
				monsters: state.monsters,
				heroes: state.heroes,
			})),
		);

	const targetedCells = monsters.reduce((acc, monster) => {
		acc.push(...filterGridByAttackPattern(monster.intent, heroes));
		return acc;
	}, [] as GridPosition[]);

	return (
		<div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800 relative">
			{cells.map((cell) => {
				const unitInCell = units.find(
					({ gridPosition }) =>
						gridPosition.col === cell.col && gridPosition.row === cell.row,
				);
				const isUnitMoving = currentMove && unitInCell?.id === currentMove[0];
				const isUnitAttacking =
					currentAttack && unitInCell?.id === currentAttack[0];
				const isTargeted = targetedCells.some(
					({ col, row }) => col === cell.col && row === cell.row,
				);
				const borderColor = isUnitMoving
					? "ring-2 ring-blue-500"
					: isTargeted
						? "ring-2 ring-red-500"
						: "";

				const stance = isUnitAttacking ? 2 : isUnitMoving ? 1 : 0;

				return (
					<button
						type="button"
						key={cell.id}
						className={`w-24 h-24 border border-zinc-700/50 bg-zinc-900/30 hover:bg-zinc-800 transition-colors relative flex items-center justify-center ${borderColor}`}
						title={`Cell [${cell.col}, ${cell.row}]`}
						onClick={() => moveHero(cell)}
					>
						{/* Debug/Coordinate overlay - helpful for dev */}
						<span className="text-xs text-zinc-800 select-none absolute top-1 left-1">
							{cell.col},{cell.row}
						</span>

						{/* Render Unit if present */}
						{unitInCell && (
							<div className="absolute inset-0 z-10">
								<UnitSprite type={unitInCell.heroClass} stance={stance} />
							</div>
						)}
					</button>
				);
			})}
		</div>
	);
}
