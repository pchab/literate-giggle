import type { BattleUnit } from "../../figures/domain/figures.type";
import type {
	BoundingBox,
	GridPosition,
	SurfaceData,
} from "../domain/grid.type";

export function getCellId(pos: GridPosition): string {
	return `${pos.row}-${pos.col}`;
}

// --- 1. SURVIVAL INSTINCT ---
export const isTileSafe = (
	cell: GridPosition,
	unit: BattleUnit,
	surfaces?: Record<string, SurfaceData>,
): boolean => {
	if (!surfaces) return true;
	const surface = surfaces[getCellId(cell)];
	if (!surface) return true;

	if (surface.status) {
		const isImmune = unit.immunities?.includes(surface.status.type);
		if (isImmune) {
			return true;
		}
	}

	// aiUnits will avoid hazards, but walk through the other types of surfaces without issue
	return ["TRAP", "TERRAIN", "SPECIAL"].includes(surface.type);
};

// --- 2. BOUNDING BOX LOGIC ---
export function isUnitInTile<T extends BoundingBox>(tile: GridPosition) {
	return (entity: T) => {
		const size = entity.size ?? { cols: 1, rows: 1 };
		return (
			tile.col >= entity.gridPosition.col &&
			tile.col < entity.gridPosition.col + size.cols &&
			tile.row >= entity.gridPosition.row &&
			tile.row < entity.gridPosition.row + size.rows
		);
	};
}

export const doBoundingBoxesIntersect = (
	box1: BoundingBox,
	box2: BoundingBox,
): boolean => {
	const s1 = box1.size ?? { cols: 1, rows: 1 };
	const s2 = box2.size ?? { cols: 1, rows: 1 };

	const b1Right = box1.gridPosition.col + s1.cols - 1;
	const b1Bottom = box1.gridPosition.row + s1.rows - 1;

	const b2Right = box2.gridPosition.col + s2.cols - 1;
	const b2Bottom = box2.gridPosition.row + s2.rows - 1;

	return !(
		box2.gridPosition.col > b1Right ||
		b2Right < box1.gridPosition.col ||
		box2.gridPosition.row > b1Bottom ||
		b2Bottom < box1.gridPosition.row
	);
};

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

// --- 3. CLEARANCE LOGIC (For Giant Pathfinding) ---
export const canUnitFit = <C extends BattleUnit, T extends BattleUnit>({
	unit: { id: ignoreUnitId, size = { cols: 1, rows: 1 }, gridPosition },
	units,
	gridSize,
}: {
	unit: C;
	units: T[];
	gridSize: { cols: number; rows: number };
}): boolean => {
	for (let r = 0; r < size.rows; r++) {
		for (let c = 0; c < size.cols; c++) {
			const checkPos = { row: gridPosition.row + r, col: gridPosition.col + c };
			if (!isTileInBounds(gridSize)(checkPos)) return false;

			const occupant = units.find(
				(f) => f.currentHp > 0 && isUnitInTile(checkPos)(f),
			);
			if (occupant && occupant.id !== ignoreUnitId) return false;
		}
	}
	return true;
};

// --- 4. DISTANCE CALCULATIONS ---
export const getManhattanDistance = (
	pos1: GridPosition,
	pos2: GridPosition,
) => {
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
	const sizeC = caster.size ?? { cols: 1, rows: 1 };
	const sizeT = target.size ?? { cols: 1, rows: 1 };

	const dCol = Math.max(
		0,
		Math.max(
			caster.gridPosition.col - (target.gridPosition.col + sizeT.cols - 1),
			target.gridPosition.col - (caster.gridPosition.col + sizeC.cols - 1),
		),
	);

	const dRow = Math.max(
		0,
		Math.max(
			caster.gridPosition.row - (target.gridPosition.row + sizeT.rows - 1),
			target.gridPosition.row - (caster.gridPosition.row + sizeC.rows - 1),
		),
	);

	return dCol + dRow;
};

export const isTileInBounds =
	(gridSize: { rows: number; cols: number }) => (pos: GridPosition) => {
		return (
			pos.row >= 0 &&
			pos.row < gridSize.rows &&
			pos.col >= 0 &&
			pos.col < gridSize.cols
		);
	};

// --- 5. PATTERN & GEOMETRY MANIPULATION ---
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
	pattern,
	targetPos,
	originPos,
	gridSize,
}: {
	pattern: GridPosition[];
	targetPos: BoundingBox | null;
	originPos: GridPosition;
	gridSize: { cols: number; rows: number };
}): GridPosition[] {
	if (!targetPos || pattern.length === 0) return pattern;

	const size = targetPos.size ?? { cols: 1, rows: 1 };

	// 1. Calculate the true center of the target's bounding box
	const targetCenter = {
		col: targetPos.gridPosition.col + (size.cols - 1) / 2,
		row: targetPos.gridPosition.row + (size.rows - 1) / 2,
	};

	// 2. Rotate the pattern using the center of mass
	const rotatedPattern = rotatePattern({
		pattern,
		originPos,
		targetPos: targetCenter as GridPosition,
	});

	const expandedPattern: GridPosition[] = [];

	// 3. Dynamic Bounding-Box Expansion
	for (const p of rotatedPattern) {
		const colStart = p.col < 0 ? p.col : p.col > 0 ? p.col + size.cols - 1 : 0;
		const colEnd = p.col === 0 ? size.cols - 1 : colStart;

		const rowStart = p.row < 0 ? p.row : p.row > 0 ? p.row + size.rows - 1 : 0;
		const rowEnd = p.row === 0 ? size.rows - 1 : rowStart;

		for (let c = colStart; c <= colEnd; c++) {
			for (let r = rowStart; r <= rowEnd; r++) {
				expandedPattern.push({
					col: targetPos.gridPosition.col + c,
					row: targetPos.gridPosition.row + r,
				});
			}
		}
	}

	return expandedPattern.filter(isTileInBounds(gridSize));
}

export const getClosestOriginTile = ({
	caster,
	anchorTarget,
}: {
	caster: BattleUnit;
	anchorTarget: BoundingBox | null;
}): GridPosition => {
	const size = caster.size ?? { cols: 1, rows: 1 };
	const { gridPosition } = caster;

	if ((size.cols === 1 && size.rows === 1) || !anchorTarget)
		return gridPosition;

	let closestTile = gridPosition;
	let minDistance = Infinity;

	for (let r = 0; r < size.rows; r++) {
		for (let c = 0; c < size.cols; c++) {
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
