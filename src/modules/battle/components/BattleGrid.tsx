"use client";

import { useShallow } from "zustand/shallow";
import {
	GRID_BOUNDS,
	getCellId,
	isUnitInTile,
} from "@/modules/battle/helpers/grid.helpers";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { isHero, isHeroId } from "@/modules/figures/helpers/figures.helpers";
import type { GridPosition } from "../domain/grid.type";
import {
	type CellHighlight,
	useCellHighlight,
} from "../hooks/useCellHighlight";
import { useBattleStore } from "../store/battle.store";
import { GridCell, type Highlight } from "./GridCell";

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

const getHighlightForCell =
	(cellHighlight: CellHighlight) =>
	(cell: GridPosition, unitInCellId?: BattleUnit["id"]): Highlight => {
		if (cellHighlight.activeUnit && unitInCellId === cellHighlight.activeUnit)
			return "active";
		const cellId = getCellId(cell);
		if (cellHighlight.enemyTargets?.map(getCellId).includes(cellId))
			return "target_enemy";
		if (cellHighlight.allyTargets?.map(getCellId).includes(cellId))
			return "target_ally";
		if (cellHighlight.cellTargets?.map(getCellId).includes(cellId))
			return "target_cell";
		if (cellHighlight.moveCells?.map(getCellId).includes(cellId)) return "move";
		return cellHighlight.activeUnit ? "invalid" : "default";
	};

export function BattleGrid() {
	const cellHighlight = useCellHighlight();
	const {
		heroes,
		monsters,
		summons,
		activeHeroCard,
		activeMoveHeroId,
		usedMovesThisTurn,
		moveHero,
		setActiveMoveHeroId,
		resolveCard,
	} = useBattleStore(
		useShallow((state) => ({
			heroes: state.heroes,
			monsters: state.monsters,
			summons: state.summons,
			activeHeroCard: state.activeHeroCard,
			activeMoveHeroId: state.activeMoveHeroId,
			usedMovesThisTurn: state.usedMovesThisTurn,
			moveHero: state.moveHero,
			setActiveMoveHeroId: state.setActiveMoveHeroId,
			resolveCard: state.resolveCard,
		})),
	);

	const allUnits = [...heroes, ...monsters, ...summons];
	const processHighlight = getHighlightForCell(cellHighlight);
	const isMoving = !!activeMoveHeroId;
	const isActive = !!activeHeroCard;

	return (
		<div
			className={`grid ${tailwindGridCols[GRID_BOUNDS.cols]} gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800 relative`}
		>
			{cells.map((cell) => {
				const unitsInCell = allUnits.filter(isUnitInTile(cell));
				// --- CLICK ON CELL CHECKS ---
				const hasUnitInCell = unitsInCell.length > 0;
				// In theory multiple units in cell is transient state when moving.
				const unitInCell = unitsInCell[0];

				const highlight = processHighlight(cell, unitInCell?.id);
				const unitIsHero = unitInCell && isHero(unitInCell);

				const remainingMoves =
					unitsInCell.length > 0 && isHeroId(unitsInCell[0].id)
						? unitsInCell[0].baseMove -
							(usedMovesThisTurn[unitsInCell[0].id] ?? 0)
						: 0;

				const handleClick = () => {
					console.log({
						highlight,
						isMoving,
						hasUnitInCell,
						remainingMoves,
					});
					if (isMoving && highlight === "move" && !hasUnitInCell) {
						moveHero(cell);
						return;
					}

					if (isActive) {
						resolveCard(cell);
						return;
					}

					if (!isActive && unitIsHero && remainingMoves > 0) {
						if (activeMoveHeroId === unitInCell.id) {
							setActiveMoveHeroId(null);
						} else {
							setActiveMoveHeroId(unitInCell.id);
						}
					}
				};

				return (
					<GridCell
						key={cell.id}
						cell={cell}
						unitsInCell={unitsInCell}
						highlight={highlight}
						onClick={handleClick}
					/>
				);
			})}
		</div>
	);
}
