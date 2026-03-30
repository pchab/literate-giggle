import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { GRID_BOUNDS } from "../helpers/grid.helpers";
import type { CellHighlight } from "../hooks/useCellHighlight";

export default function MovePrediction({
	cellHighlight,
	units,
}: {
	cellHighlight: CellHighlight;
	units: BattleUnit[];
}) {
	return (
		Object.keys(cellHighlight.projectedMoves ?? {}).length > 0 && (
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
						const unit = units.find((u) => u.id === unitId);
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
		)
	);
}
