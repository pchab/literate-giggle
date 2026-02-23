import type { Hero, Monster } from "../figures/domain/figures.type";
import type { GridPosition } from "./grid.type";

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
