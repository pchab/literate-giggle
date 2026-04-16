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

export default function ShadowPredictions() {
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
	let projectedCasualties = aiStateDiff.projectedCasualties ?? [];
	let projectedSpawns = aiStateDiff.projectedSpawns ?? [];

	if (playerIntent) {
		// 1. Player Intent
		const { unitId, intendedMove = EMPTY_PATH } = playerIntent;
		activeUnitId = unitId;
		activeUnitPath = intendedMove;
		projectedMoves = playerStateDiff.projectedMoves;
		projectedCasualties = playerStateDiff.projectedCasualties ?? [];
		projectedSpawns = playerStateDiff.projectedSpawns ?? [];
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

			{/* --- 1. RENDER MOVEMENT ARROWS --- */}
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

			{/* --- 2. RENDER CASUALTY MARKERS --- */}
			{projectedCasualties.map((unitId) => {
				const unit = units.find((u) => u.id === unitId);
				if (!unit) return null;

				const finalPos = projectedMoves[unitId] || unit.gridPosition;

				return (
					<svg
						key={`death-${unitId}`}
						x={`${(finalPos.col / gridSize.cols) * 100}%`}
						y={`${(finalPos.row / gridSize.rows) * 100}%`}
						width={`${(1 / gridSize.cols) * 100}%`}
						height={`${(1 / gridSize.rows) * 100}%`}
						viewBox="0 0 24 24"
						className="animate-pulse"
					>
						<title>Death Prediction</title>
						<path
							d="M 6 6 L 18 18 M 6 18 L 18 6"
							stroke="#ef4444"
							strokeWidth="4"
							strokeLinecap="round"
						/>
					</svg>
				);
			})}

			{/* --- 3. RENDER SPAWN MARKERS --- */}
			{projectedSpawns.map((spawn) => {
				return (
					<svg
						key={`spawn-${spawn.id}`}
						x={`${(spawn.gridPosition.col / gridSize.cols) * 100}%`}
						y={`${(spawn.gridPosition.row / gridSize.rows) * 100}%`}
						width={`${(1 / gridSize.cols) * 100}%`}
						height={`${(1 / gridSize.rows) * 100}%`}
						viewBox="0 0 24 24"
						className="animate-pulse"
					>
						<title>Summon Prediction</title>
						<path
							d="M 12 5 L 12 19 M 5 12 L 19 12"
							stroke="#10b981"
							strokeWidth="3"
							strokeLinecap="round"
							strokeDasharray="4 2"
							className="opacity-80"
						/>
						<circle
							cx="12"
							cy="12"
							r="9"
							stroke="#10b981"
							strokeWidth="1.5"
							strokeDasharray="3 3"
							fill="none"
							className="opacity-50"
						/>
					</svg>
				);
			})}
		</svg>
	);
}
