import { isUnitInTile } from "../helpers/grid.helpers";
import { useBattleStore } from "../store/battle.store";

const checkMoves =
	(cellId: string) => (moves: Record<string, { col: number; row: number }>) =>
		Object.values(moves).some((pos) => `${pos.col},${pos.row}` === cellId);

export function ProjectedLandingIndicator({ cellId }: { cellId: string }) {
	const isLanding = useBattleStore(
		({
			units,
			hoveredCell,
			aiStateDiff: { projectedMoves: aiProjectedMoves },
			playerStateDiff: { projectedMoves: playerProjectedMoves },
		}) => {
			const CheckMovesInCell = checkMoves(cellId);
			const projectedMoves = { ...aiProjectedMoves, ...playerProjectedMoves };
			if (CheckMovesInCell(projectedMoves)) return true;

			if (hoveredCell) {
				const hoveredUnit = units.find(isUnitInTile(hoveredCell));
				if (hoveredUnit && CheckMovesInCell(projectedMoves)) {
					return true;
				}
			}
			return false;
		},
	);

	if (!isLanding) return null;

	return (
		<div className="absolute inset-0 border-2 border-dashed border-yellow-400 bg-yellow-400/20 z-20 pointer-events-none" />
	);
}
