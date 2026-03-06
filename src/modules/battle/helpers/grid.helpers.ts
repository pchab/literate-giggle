import type {
	Figure,
	Hero,
	Monster,
	Summon,
} from "../../figures/domain/figures.type";
import type { GridPosition } from "../domain/grid.type";

export const GRID_BOUNDS = {
	rows: 5,
	cols: 5,
};

export function getCellId(pos: GridPosition): string {
	return `${pos.row}-${pos.col}`;
}

export const isTileOccupied = <T extends Figure>(
	pos: GridPosition,
	figures: T[],
) => {
	return figures.some(
		({ gridPosition, currentHp }) =>
			gridPosition.row === pos.row &&
			gridPosition.col === pos.col &&
			currentHp > 0,
	);
};

export const getManhattanDistance = (
	pos1: GridPosition,
	pos2: GridPosition,
) => {
	return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
};

export const isTileInBounds = (pos: GridPosition) => {
	return (
		pos.row >= 0 &&
		pos.row < GRID_BOUNDS.rows &&
		pos.col >= 0 &&
		pos.col < GRID_BOUNDS.cols
	);
};

export const calculateReachableCells = (
	startPos: GridPosition,
	moveValue: number,
	figures: (Hero | Monster | Summon)[],
	canTargetSelf: boolean = false,
): GridPosition[] => {
	if (moveValue <= 0) return [];

	const queue: { pos: GridPosition; dist: number }[] = [
		{ pos: startPos, dist: 0 },
	];
	const visited = new Set<string>();
	const startKey = `${startPos.row},${startPos.col}`;
	visited.add(startKey);

	const reachable: GridPosition[] = canTargetSelf ? [startPos] : [];

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) break;

		if (current.dist > 0) {
			reachable.push(current.pos);
		}

		if (current.dist < moveValue) {
			const neighbors = [
				{ row: current.pos.row - 1, col: current.pos.col },
				{ row: current.pos.row + 1, col: current.pos.col },
				{ row: current.pos.row, col: current.pos.col - 1 },
				{ row: current.pos.row, col: current.pos.col + 1 },
			].filter(isTileInBounds);

			for (const next of neighbors) {
				const key = `${next.row},${next.col}`;
				if (!visited.has(key)) {
					visited.add(key);
					// Typically you can't step ONTO occupied tile, but let's say movement range calculation shouldn't include occupied tiles.
					// We'll mark it visited but only add to queue if it's NOT occupied.
					if (!isTileOccupied(next, figures)) {
						queue.push({ pos: next, dist: current.dist + 1 });
					}
				}
			}
		}
	}

	return reachable;
};

export const calculateAttackableCells = (
	startPos: GridPosition,
	rangeValue: number,
	canTargetSelf: boolean = false,
): GridPosition[] => {
	const attackable: GridPosition[] = [];
	for (let row = 0; row < GRID_BOUNDS.rows; row++) {
		for (let col = 0; col < GRID_BOUNDS.cols; col++) {
			const pos = { row, col };
			if (
				getManhattanDistance(startPos, pos) <= rangeValue &&
				(canTargetSelf || getManhattanDistance(startPos, pos) > 0)
			) {
				attackable.push(pos);
			}
		}
	}
	return attackable;
};

export function getLineOfSightPath(
	start: GridPosition,
	end: GridPosition,
): GridPosition[] {
	const path: GridPosition[] = [];
	let x0 = start.col;
	let y0 = start.row;
	const x1 = end.col;
	const y1 = end.row;

	const dx = Math.abs(x1 - x0);
	const dy = Math.abs(y1 - y0);
	const sx = x0 < x1 ? 1 : -1;
	const sy = y0 < y1 ? 1 : -1;
	let err = dx - dy;

	while (true) {
		path.push({ col: x0, row: y0 });
		if (x0 === x1 && y0 === y1) break;

		const e2 = 2 * err;
		if (e2 > -dy) {
			err -= dy;
			x0 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y0 += sy;
		}
	}

	return path;
}
