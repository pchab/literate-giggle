"use client";

import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { GridPosition } from "../domain/grid.type";
import { isUnitInTile } from "../helpers/grid.helpers";

// ==========================================
// STABLE REFERENCES
// ==========================================
const EMPTY_MOVES = {};
const EMPTY_PATH: GridPosition[] = [];

export default function MovePrediction() {
	// ==========================================
	// SMART DUAL-INTENT SUBSCRIPTION
	// ==========================================
	const {
		gridSize,
		units,
		playerIntent,
		aiIntents,
		hoveredCell,
		aiStateDiff,
		playerStateDiff,
	} = useBattleStore(
		useShallow(
			({
				gridSize,
				units,
				playerIntent,
				aiIntents,
				hoveredCell,
				aiStateDiff,
				playerStateDiff,
			}) => ({
				gridSize,
				units,
				playerIntent,
				aiIntents,
				hoveredCell,
				aiStateDiff,
				playerStateDiff,
			}),
		),
	);

	let activeUnitId = null;
	let projectedMoves = aiStateDiff.projectedMoves ?? EMPTY_MOVES;
	let activeUnitPath = EMPTY_PATH;

	if (playerIntent) {
		// 1. Player Intent
		const { unitId, intendedMove = EMPTY_PATH } = playerIntent;
		activeUnitId = unitId;
		activeUnitPath = intendedMove;
		projectedMoves = {
			...projectedMoves,
			...playerStateDiff.projectedMoves,
		};
	}

	if (hoveredCell) {
		// 2. AI Intent
		const hoveredUnit = units.find(isUnitInTile(hoveredCell));

		if (hoveredUnit && aiIntents[hoveredUnit.id]) {
			const { unitId, intendedMove = EMPTY_PATH } = aiIntents[hoveredUnit.id];
			activeUnitId = unitId;
			activeUnitPath = intendedMove;
		}
	}

	const moveEntries: [string, GridPosition][] = Object.entries(
		projectedMoves ?? EMPTY_MOVES,
	);

	// If no one is moving, render nothing!
	if (moveEntries.length === 0) return null;

	return (
		<svg
			className="absolute inset-0 w-full h-full pointer-events-none z-20"
			style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}
		>
			<title>Move Prediction</title>
			<defs>
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

			{moveEntries.map(([unitId, targetPos]) => {
				const unit = units.find((u) => u.id === unitId);
				if (!unit) return null;

				const isActiveUnit = unit.id === activeUnitId;

				// If it's the active unit and they walked before doing this action, start the arrow from where they walked to
				const start =
					isActiveUnit && activeUnitPath.length > 0
						? activeUnitPath[activeUnitPath.length - 1]
						: unit.gridPosition;

				const end = targetPos;

				// Don't draw an arrow if they aren't actually moving
				if (start.col === end.col && start.row === end.row) return null;

				// FIXED AXIS MATH: Cols = X axis, Rows = Y axis
				const startX = `${((start.col + 0.5) / gridSize.cols) * 100}%`;
				const startY = `${((start.row + 0.5) / gridSize.rows) * 100}%`;
				const endX = `${((end.col + 0.5) / gridSize.cols) * 100}%`;
				const endY = `${((end.row + 0.5) / gridSize.rows) * 100}%`;

				const strokeColor = isActiveUnit ? "#ef4444" : "#3b82f6";
				const markerEnd = isActiveUnit
					? "url(#arrowhead-red)"
					: "url(#arrowhead-blue)";

				return (
					<line
						key={unitId}
						y1={startY}
						x1={startX}
						y2={endY}
						x2={endX}
						stroke={strokeColor}
						strokeWidth="3"
						strokeDasharray="6 4"
						markerEnd={markerEnd}
						className="opacity-60 transition-all duration-300"
					/>
				);
			})}
		</svg>
	);
}
