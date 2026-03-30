import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "../../figures/domain/figures.type";
import type { BoundingBox, GridPosition } from "../domain/grid.type";

export const GRID_BOUNDS = {
	rows: 7,
	cols: 7,
};

export function getCellId(pos: GridPosition): string {
	return `${pos.row}-${pos.col}`;
}

// --- 1. BOUNDING BOX LOGIC ---
export function isUnitInTile<T extends BattleUnit>(tile: GridPosition) {
	return (figure: T) => {
		const size = figure.size ?? 1;
		return (
			tile.col >= figure.gridPosition.col &&
			tile.col < figure.gridPosition.col + size &&
			tile.row >= figure.gridPosition.row &&
			tile.row < figure.gridPosition.row + size
		);
	};
}

export const isTileOccupied =
	<T extends BattleUnit>(figures: T[]) =>
	(tile: GridPosition) =>
		figures.some(
			(figure) => figure.currentHp > 0 && isUnitInTile(tile)(figure),
		);

export const isTileEmpty =
	<T extends BattleUnit>(figures: T[]) =>
	(tile: GridPosition) =>
		!isTileOccupied(figures)(tile);

// --- 2. CLEARANCE LOGIC (For Giant Pathfinding) ---
export const canUnitFit = <C extends BattleUnit, T extends BattleUnit>({
	unit: { id: ignoreUnitId, size = 1, gridPosition },
	figures,
}: {
	unit: C;
	figures: T[];
}): boolean => {
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			const checkPos = { row: gridPosition.row + r, col: gridPosition.col + c };
			if (!isTileInBounds(checkPos)) return false;

			const occupant = figures.find(
				(f) => f.currentHp > 0 && isUnitInTile(checkPos)(f),
			);
			if (occupant && occupant.id !== ignoreUnitId) return false;
		}
	}
	return true;
};

// --- 3. DISTANCE CALCULATIONS ---
const getManhattanDistance = (pos1: GridPosition, pos2: GridPosition) => {
	return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
};

export const getDistanceToBoundingBox = <
	C extends BoundingBox,
	T extends BoundingBox,
>({
	caster,
	target,
}: {
	caster: C;
	target: T;
}): number => {
	const sizeC = caster.size ?? 1;
	const sizeT = target.size ?? 1;

	const dCol = Math.max(
		0,
		Math.max(
			caster.gridPosition.col - (target.gridPosition.col + sizeT - 1),
			target.gridPosition.col - (caster.gridPosition.col + sizeC - 1),
		),
	);

	const dRow = Math.max(
		0,
		Math.max(
			caster.gridPosition.row - (target.gridPosition.row + sizeT - 1),
			target.gridPosition.row - (caster.gridPosition.row + sizeC - 1),
		),
	);

	return dCol + dRow;
};

export const isTileInBounds = (pos: GridPosition) => {
	return (
		pos.row >= 0 &&
		pos.row < GRID_BOUNDS.rows &&
		pos.col >= 0 &&
		pos.col < GRID_BOUNDS.cols
	);
};

// --- 4. PATHFINDING ---
export const calculateReachableCells = <T extends BattleUnit>({
	movingUnit,
	blockingFigures: figures,
	canTargetSelf = false,
}: {
	movingUnit: BattleUnit;
	blockingFigures: T[];
	canTargetSelf: boolean;
}): GridPosition[] => {
	const { baseMove: moveValue, gridPosition: startPos } = movingUnit;
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
			]; // bounds check is now handled inside canUnitFit

			for (const next of neighbors) {
				const key = `${next.row},${next.col}`;
				if (!visited.has(key)) {
					visited.add(key);
					// Check if the entire bounding box fits at the next position
					if (
						canUnitFit({ unit: { ...movingUnit, gridPosition: next }, figures })
					) {
						queue.push({ pos: next, dist: current.dist + 1 });
					}
				}
			}
		}
	}

	return reachable;
};

export const calculateAttackableCells = ({
	attacker,
	rangeValue,
	canTargetSelf = false,
}: {
	attacker: BattleUnit;
	rangeValue: number;
	canTargetSelf?: boolean;
}): GridPosition[] => {
	const attackable: GridPosition[] = [];

	for (let row = 0; row < GRID_BOUNDS.rows; row++) {
		for (let col = 0; col < GRID_BOUNDS.cols; col++) {
			const target = { gridPosition: { row, col } };

			const distance = getDistanceToBoundingBox({ caster: attacker, target });

			if (distance <= rangeValue && (canTargetSelf || distance > 0)) {
				attackable.push(target.gridPosition);
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

function rotatePattern({
	pattern,
	originPos,
	targetPos,
}: {
	pattern: GridPosition[];
	originPos: GridPosition;
	targetPos: GridPosition;
}): GridPosition[] {
	const dx = targetPos.col - originPos.col;
	const dy = targetPos.row - originPos.row;

	if (Math.abs(dx) > Math.abs(dy)) {
		if (dx > 0) {
			return pattern.map((p) => ({ col: -p.row, row: p.col }));
		} else {
			return pattern.map((p) => ({ col: p.row, row: -p.col }));
		}
	} else {
		if (dy > 0) {
			return pattern.map((p) => ({ col: -p.col, row: -p.row }));
		} else {
			return pattern;
		}
	}
}

export function filterGridByAttackPattern({
	card,
	targetPos,
	originPos,
}: {
	card: Card;
	targetPos: AnchorTarget;
	originPos: GridPosition;
}): GridPosition[] {
	const pattern = card.aoePattern || [{ col: 0, row: 0 }];
	if (!targetPos) return pattern;

	const rotatedPattern = rotatePattern({
		pattern,
		originPos,
		targetPos: targetPos.gridPosition,
	});

	const size = targetPos.size ?? 1;
	const expandedPattern: GridPosition[] = [];

	for (const p of rotatedPattern) {
		const colStart = p.col < 0 ? p.col : p.col > 0 ? p.col + size - 1 : 0;
		const colEnd = p.col === 0 ? size - 1 : colStart;

		const rowStart = p.row < 0 ? p.row : p.row > 0 ? p.row + size - 1 : 0;
		const rowEnd = p.row === 0 ? size - 1 : rowStart;

		for (let c = colStart; c <= colEnd; c++) {
			for (let r = rowStart; r <= rowEnd; r++) {
				expandedPattern.push({
					col: targetPos.gridPosition.col + c,
					row: targetPos.gridPosition.row + r,
				});
			}
		}
	}

	return expandedPattern;
}

export const getClosestOriginTile = ({
	caster,
	anchorTarget,
}: {
	caster: BattleUnit;
	anchorTarget: AnchorTarget;
}): GridPosition => {
	const { gridPosition, size = 1 } = caster;
	if (size === 1 || !anchorTarget) return gridPosition;

	let closestTile = gridPosition;
	let minDistance = Infinity;

	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			const currentTile = {
				row: gridPosition.row + r,
				col: gridPosition.col + c,
			};
			const distance = getManhattanDistance(
				currentTile,
				anchorTarget.gridPosition,
			);

			if (distance < minDistance) {
				minDistance = distance;
				closestTile = currentTile;
			}
		}
	}

	return closestTile;
};
