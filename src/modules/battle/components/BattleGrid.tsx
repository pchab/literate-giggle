"use client";

import { useShallow } from "zustand/shallow";
import {
	GRID_BOUNDS,
	getCellId,
	isUnitInTile,
} from "@/modules/battle/helpers/grid.helpers";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { isHero, isHeroId } from "@/modules/figures/helpers/figures.helpers";
import { useBattleTurns } from "../hooks/useBattleTurns";
import { useCellHighlight } from "../hooks/useCellHighlight";
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

export function BattleGrid({ encounterId }: { encounterId: Encounter["id"] }) {
	useBattleTurns(encounterId);
	const cellHighlight = useCellHighlight();
	const {
		heroes,
		monsters,
		summons,
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
			heroes: state.heroes,
			monsters: state.monsters,
			summons: state.summons,
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

	const allUnits = [...heroes, ...monsters, ...summons];
	const isMoving = !!activeMoveHeroId;
	const isActive = !!activeHeroCard;

	const enemyTargetIds = new Set(cellHighlight.enemyTargets?.map(getCellId));
	const allyTargetIds = new Set(cellHighlight.allyTargets?.map(getCellId));
	const cellTargetIds = new Set(cellHighlight.cellTargets?.map(getCellId));
	const moveCellIds = new Set(cellHighlight.moveCells?.map(getCellId));

	const projectedLandingIds = new Set(
		Object.values(cellHighlight.projectedMoves ?? {}).map((cell) =>
			getCellId(cell),
		),
	);
	const projectedCasualtyIds = new Set(cellHighlight.projectedCasualties || []);

	const getHighlightForCell = (
		cellId: string,
		unitInCellId?: BattleUnit["id"],
	): Highlight => {
		if (cellHighlight.activeUnit && unitInCellId === cellHighlight.activeUnit)
			return "active";
		if (enemyTargetIds.has(cellId)) return "target_enemy";
		if (allyTargetIds.has(cellId)) return "target_ally";
		if (cellTargetIds.has(cellId)) return "target_cell";
		if (moveCellIds.has(cellId)) return "move";
		return cellHighlight.activeUnit ? "invalid" : "default";
	};

	return (
		<div
			className={`grid ${tailwindGridCols[GRID_BOUNDS.cols]} gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800 relative`}
			onMouseLeave={() => setHoveredCell(null)}
			role="toolbar"
		>
			{cells.map((cell) => {
				const unitsInCell = allUnits.filter(isUnitInTile(cell));
				const hasUnitInCell = unitsInCell.length > 0;
				const unitInCell = unitsInCell[0];

				const highlight = getHighlightForCell(cell.id, unitInCell?.id);
				const unitIsHero = unitInCell && isHero(unitInCell);
				const isProjectedLanding = projectedLandingIds.has(cell.id);

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
							resolveCard(cell, activeHeroCard);
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
						isProjectedLanding={isProjectedLanding}
						projectedCasualtyIds={projectedCasualtyIds}
						onClick={handleClick}
					/>
				);
			})}

			{/* --- SVG OVERLAY FOR PROJECTED MOVES --- */}
			{Object.keys(cellHighlight.projectedMoves ?? {}).length > 0 && (
				<svg
					className="absolute inset-0 w-full h-full pointer-events-none z-20"
					style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}
				>
					<title>move prediction</title>
					<defs>
						{/* Red arrow for general danger/enemy movement */}
						<marker
							id="arrowhead-red"
							markerWidth="8"
							markerHeight="8"
							refX="6"
							refY="4"
							orient="auto"
						>
							<polygon points="0 0, 8 4, 0 8" fill="#ef4444" />
						</marker>
						{/* Blue arrow for hero movement (optional distinction) */}
						<marker
							id="arrowhead-blue"
							markerWidth="8"
							markerHeight="8"
							refX="6"
							refY="4"
							orient="auto"
						>
							<polygon points="0 0, 8 4, 0 8" fill="#3b82f6" />
						</marker>
					</defs>
					{Object.entries(cellHighlight.projectedMoves ?? {}).map(
						([unitId, targetPos]) => {
							const unit = allUnits.find((u) => u.id === unitId);
							if (!unit) return null;
							const isActiveUnit = unit.id === cellHighlight.activeUnit;

							const start =
								isActiveUnit && cellHighlight.moveCells.length > 0
									? cellHighlight.moveCells[cellHighlight.moveCells.length - 1]
									: unit.gridPosition;
							const end = targetPos;

							// Don't draw an arrow if they aren't actually moving
							if (start.col === end.col && start.row === end.row) return null;

							// Calculate the percentage position of the center of each cell
							const startX = `${((start.row + 0.5) / GRID_BOUNDS.rows) * 100}%`;
							const startY = `${((start.col + 0.5) / GRID_BOUNDS.cols) * 100}%`;
							const endX = `${((end.row + 0.5) / GRID_BOUNDS.rows) * 100}%`;
							const endY = `${((end.col + 0.5) / GRID_BOUNDS.cols) * 100}%`;

							const strokeColor = isActiveUnit ? "#ef4444" : "#3b82f6";
							const markerEnd = isActiveUnit
								? "url(#arrowhead-red)"
								: "url(#arrowhead-blue)";

							return (
								<line
									key={unitId}
									x1={startX}
									y1={startY}
									x2={endX}
									y2={endY}
									stroke={strokeColor}
									strokeWidth="3"
									strokeDasharray="6 4" // Makes it a dashed line
									markerEnd={markerEnd}
									className="opacity-60 transition-all duration-300"
								/>
							);
						},
					)}
				</svg>
			)}
		</div>
	);
}
