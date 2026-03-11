"use client";

import { GRID_BOUNDS, getCellId } from "@/modules/battle/helpers/grid.helpers";
import { isHeroId } from "@/modules/figures/helpers/figures.helpers";
import { useBattleGrid } from "../hooks/useBattleGrid.hook";
import { GridCell } from "./GridCell";

const cells = Array.from({ length: GRID_BOUNDS.rows }, (_, col) => {
	return Array.from({ length: GRID_BOUNDS.cols }, (_, row) => {
		return { id: getCellId({ col, row }), col, row };
	});
}).flat();

const tailwindGridCols = [
	"grid-cols-0",
	"grid-cols-1",
	"grid-cols-2",
	"grid-cols-3",
	"grid-cols-4",
	"grid-cols-5",
];

export function BattleGrid() {
	const { store, allDangerTiles, validTargetCells, targeting } =
		useBattleGrid();

	return (
		<div
			className={`grid ${tailwindGridCols[GRID_BOUNDS.cols]} gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800 relative`}
		>
			{cells.map((cell) => {
				const unitsInCell = [
					...store.monsters,
					...store.heroes,
					...store.summons,
				].filter(
					(m) =>
						m.currentHp > 0 &&
						m.gridPosition.col === cell.col &&
						m.gridPosition.row === cell.row,
				);

				const isDanger = allDangerTiles.some(
					(t) => t.col === cell.col && t.row === cell.row,
				);
				const inRange = validTargetCells.some(
					(pos) => pos.row === cell.row && pos.col === cell.col,
				);

				const remainingMoves =
					unitsInCell.length > 0 && isHeroId(unitsInCell[0].id)
						? unitsInCell[0].baseMove -
							(store.usedMovesThisTurn[unitsInCell[0].id] ?? 0)
						: 0;

				return (
					<GridCell
						key={cell.id}
						cell={cell}
						unitsInCell={unitsInCell}
						isDanger={isDanger}
						inRange={inRange}
						targeting={targeting}
						hasActiveAction={!!store.activeCard}
						hoveredHeroId={store.hoveredCard?.heroId}
						onResolveCard={store.resolveCard}
						onMoveHero={store.moveHero}
						activeMoveHeroId={
							store.activeMoveUnitId && isHeroId(store.activeMoveUnitId)
								? store.activeMoveUnitId
								: null
						}
						onSelectForMove={store.setActiveMoveHeroId}
						remainingMoves={remainingMoves}
					/>
				);
			})}
		</div>
	);
}
