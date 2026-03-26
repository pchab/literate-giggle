import type { GridPosition } from "@/modules/battle/domain/grid.type";

export const singleTargetPattern: GridPosition[] = [{ col: 0, row: 0 }];

export const cleavePattern: GridPosition[] = [
	{ col: 0, row: 0 },
	{ col: -1, row: 0 },
	{ col: 1, row: 0 },
];

export const adjacentPattern: GridPosition[] = [
	{ col: 0, row: -1 },
	{ col: -1, row: 0 },
	{ col: 1, row: 0 },
	{ col: 0, row: 1 },
];

export const crossPattern: GridPosition[] = [
	{ col: 0, row: -1 },
	{ col: -1, row: 0 },
	{ col: 0, row: 0 },
	{ col: 1, row: 0 },
	{ col: 0, row: 1 },
];

export const squarePattern: GridPosition[] = [
	{ col: -1, row: -1 },
	{ col: 0, row: -1 },
	{ col: 1, row: -1 },
	{ col: -1, row: 0 },
	{ col: 0, row: 0 },
	{ col: 1, row: 0 },
	{ col: -1, row: 1 },
	{ col: 0, row: 1 },
	{ col: 1, row: 1 },
];

export const linePattern: GridPosition[] = [
	{ col: -2, row: 0 },
	{ col: -1, row: 0 },
	{ col: 0, row: 0 },
	{ col: 1, row: 0 },
	{ col: 2, row: 0 },
];

export const conePattern: GridPosition[] = [
	{ row: 0, col: 0 },
	{ row: -1, col: -1 },
	{ row: -1, col: 0 },
	{ row: -1, col: 1 },
	{ row: -2, col: -2 },
	{ row: -2, col: -1 },
	{ row: -2, col: 0 },
	{ row: -2, col: 1 },
	{ row: -2, col: 2 },
];
