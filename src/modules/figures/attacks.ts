import type { GridPosition } from '../grid/grid.type';

export const crossPattern: GridPosition[] = [
  { col: 0, row: -1 },
  { col: -1, row: 0 },
  { col: 0, row: 0 },
  { col: 1, row: 0 },
  { col: 0, row: 1 },
];

export const linePattern: GridPosition[] = [
  { col: -2, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: 0 },
  { col: 1, row: 0 },
  { col: 2, row: 0 },
];

export const conePattern: GridPosition[] = [
  { col: 0, row: -1 },
  { col: -1, row: -1 },
  { col: 1, row: -1 },
  { col: -2, row: -2 },
  { col: -1, row: -2 },
  { col: 0, row: -2 },
  { col: 1, row: -2 },
  { col: 2, row: -2 },
];

export const singleTargetPattern: GridPosition[] = [
  { col: 0, row: 0 },
];