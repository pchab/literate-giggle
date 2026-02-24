import type { Hero, Monster } from "../figures/domain/figures.type";
import type { GridPosition } from "./grid.type";

export const GRID_BOUNDS = {
	rows: 5,
	cols: 5,
};

export const isTileOccupied = (
	pos: GridPosition,
	figures: (Hero | Monster)[],
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
	figures: (Hero | Monster)[],
): GridPosition[] => {
	if (moveValue <= 0) return [];

	const queue: { pos: GridPosition; dist: number }[] = [
		{ pos: startPos, dist: 0 },
	];
	const visited = new Set<string>();
	const startKey = `${startPos.row},${startPos.col}`;
	visited.add(startKey);

	const reachable: GridPosition[] = [];

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
): GridPosition[] => {
	const attackable: GridPosition[] = [];
	for (let row = 0; row < GRID_BOUNDS.rows; row++) {
		for (let col = 0; col < GRID_BOUNDS.cols; col++) {
			const pos = { row, col };
			if (
				getManhattanDistance(startPos, pos) <= rangeValue &&
				getManhattanDistance(startPos, pos) > 0
			) {
				attackable.push(pos);
			}
		}
	}
	return attackable;
};
