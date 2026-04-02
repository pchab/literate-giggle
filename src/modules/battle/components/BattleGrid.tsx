"use client";

import { useShallow } from "zustand/shallow";
import { getCellId, isUnitInTile } from "@/modules/battle/helpers/grid.helpers";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import { isHero, isHeroId } from "@/modules/units/helpers/units.helpers";
import { useBattleTurns } from "../hooks/useBattleTurns";
import { useCellHighlight } from "../hooks/useCellHighlight";
import { useBattleStore } from "../store/battle.store";
import { GridCell, type Highlight } from "./GridCell";
import MovePrediction from "./MovePrediction";
import { SurfacesOverlay } from "./SurfaceOverlay";

const getCells = (gridSize: { rows: number; cols: number }) =>
	Array.from({ length: gridSize.rows }, (_, row) => {
		return Array.from({ length: gridSize.cols }, (_, col) => {
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
	"grid-cols-6",
	"grid-cols-7",
	"grid-cols-8",
	"grid-cols-9",
	"grid-cols-10",
	"grid-cols-11",
	"grid-cols-12",
];

export function BattleGrid({ encounterId }: { encounterId: Encounter["id"] }) {
	useBattleTurns(encounterId);
	const cellHighlight = useCellHighlight();
	const {
		gridSize,
		units,
		activeHeroCard,
		activeMoveHeroId,
		usedMovesThisTurn,
		setHoveredCell,
		moveHero,
		setActiveMoveHeroId,
		resolveCard,
		cancelCard,
	} = useBattleStore(
		useShallow((state) => ({
			gridSize: state.gridSize,
			units: state.units,
			activeHeroCard: state.activeHeroCard,
			activeMoveHeroId: state.activeMoveHeroId,
			usedMovesThisTurn: state.usedMovesThisTurn,
			setHoveredCell: state.setHoveredCell,
			moveHero: state.moveHero,
			setActiveMoveHeroId: state.setActiveMoveHeroId,
			resolveCard: state.resolveCard,
			cancelCard: state.cancelCard,
		})),
	);

	const isMoving = !!activeMoveHeroId;
	const isActive = !!activeHeroCard;

	const enemyTargetIds = new Set(cellHighlight.enemyTargets?.map(getCellId));
	const allyTargetIds = new Set(cellHighlight.allyTargets?.map(getCellId));
	const cellTargetIds = new Set(cellHighlight.cellTargets?.map(getCellId));
	const moveCellIds = new Set(cellHighlight.moveCells?.map(getCellId));

	const getHighlightForCell = (
		cellId: string,
		unitInCell?: BattleUnit,
	): Highlight => {
		if (cellHighlight.activeUnit && unitInCell?.id === cellHighlight.activeUnit)
			return "active";
		if (enemyTargetIds.has(cellId)) return "target_enemy";
		if (allyTargetIds.has(cellId)) return "target_ally";
		if (cellTargetIds.has(cellId)) return "target_cell";
		if (moveCellIds.has(cellId)) return "move";

		if (unitInCell) {
			const isTargeted =
				cellHighlight.enemyTargets?.some((t) => isUnitInTile(t)(unitInCell)) ||
				cellHighlight.allyTargets?.some((t) => isUnitInTile(t)(unitInCell)) ||
				cellHighlight.cellTargets?.some((t) => isUnitInTile(t)(unitInCell));

			if (isTargeted) return "default";
		}

		return cellHighlight.activeUnit ? "invalid" : "default";
	};

	return (
		<div
			className={`grid ${tailwindGridCols[gridSize.cols]} bg-zinc-900/80 rounded-lg border border-zinc-800 relative`}
			onMouseLeave={() => setHoveredCell(null)}
			role="toolbar"
		>
			{getCells(gridSize).map((cell) => {
				const unitsInCell = units.filter(isUnitInTile(cell));
				const hasUnitInCell = unitsInCell.length > 0;
				const unitInCell = unitsInCell[0];

				const highlight = getHighlightForCell(cell.id, unitInCell);
				const unitIsHero = unitInCell && isHero(unitInCell);

				const remainingMoves =
					hasUnitInCell && isHeroId(unitsInCell[0].id)
						? unitsInCell[0].baseMove -
							(usedMovesThisTurn[unitsInCell[0].id] ?? 0)
						: 0;

				const handleClick = () => {
					if (isMoving && highlight === "move" && !hasUnitInCell) {
						moveHero(cell);
						return;
					}

					if (isActive) {
						if (
							["active", "target_enemy", "target_ally", "target_cell"].includes(
								highlight,
							)
						) {
							resolveCard({ gridPosition: cell }, activeHeroCard);
						} else {
							cancelCard();
						}
						return;
					}

					if (!isActive && unitIsHero && remainingMoves > 0) {
						setActiveMoveHeroId(
							activeMoveHeroId === unitInCell.id ? null : unitInCell.id,
						);
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
			<SurfacesOverlay />
			{/* --- SVG OVERLAY FOR PROJECTED MOVES --- */}
			<MovePrediction />
		</div>
	);
}
