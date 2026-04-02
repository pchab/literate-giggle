import {
	type BattleUnit,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import { sleep } from "@/modules/shared/helpers/sleep";
import type {
	GridPosition,
	SurfaceData,
	SurfaceType,
} from "../domain/grid.type";
import type { StoreGet, StoreSet } from "../store/battle.store";
import {
	canUnitFit,
	doBoundingBoxesIntersect,
	getCellId,
	getDistanceToBoundingBox,
	isTileSafe,
} from "./grid.helpers";
import { applyCombatUpdate, findUnit, updateUnitState } from "./state.helpers";
import { statusRegistry } from "./status.helpers";

// ==========================================
// 1. STATE MUTATION: Execution of Movement
// ==========================================
export function moveBattleUnit(
	get: StoreGet,
	set: StoreSet,
	isSimulation = false,
) {
	return async <T extends BattleUnit>({
		movingUnit,
		path,
		forcedMove = false,
		stepDelayMs = isSimulation ? 0 : 200,
	}: {
		movingUnit: T;
		path: GridPosition[];
		forcedMove?: boolean;
		stepDelayMs?: number;
	}): Promise<T | undefined> => {
		let currentUnit = movingUnit;

		const refreshUnit = () => findUnit(get)<T>(currentUnit.id);

		if (!forcedMove) {
			await updateUnitState(
				get,
				set,
				isSimulation,
			)(currentUnit.id, {
				stance: UnitStance.MOVING,
			});
			currentUnit = refreshUnit() || currentUnit;
		}

		for (const step of path) {
			let canTakeStep = true;
			for (const status of currentUnit.statuses) {
				const hook = statusRegistry[status.type]?.onBeforeMove;
				if (hook) {
					const result = await hook(
						get,
						set,
						isSimulation,
					)({ unit: currentUnit, nextStep: step });
					if (!result.canMove) {
						canTakeStep = false;
					}
				}
			}
			if (!canTakeStep) break;

			await updateUnitState(
				get,
				set,
				isSimulation,
			)(currentUnit.id, {
				gridPosition: step,
			});
			currentUnit = refreshUnit() || currentUnit;

			if (!isSimulation && stepDelayMs > 0) {
				await sleep(stepDelayMs);
			}

			const { surfaces: draftSurfaces } = get();
			const processedSurfaceTypes = new Set<SurfaceType>();
			let surfacesChanged = false;
			const nextSurfaces = { ...draftSurfaces };

			for (const surface of Object.values(draftSurfaces)) {
				if (!doBoundingBoxesIntersect(currentUnit, surface)) continue;
				if (currentUnit.surfaceImmunities?.includes(surface.type)) continue;

				if (processedSurfaceTypes.has(surface.type)) continue;
				processedSurfaceTypes.add(surface.type);

				if (surface.damage || surface.status) {
					await applyCombatUpdate(
						get,
						set,
						isSimulation,
					)(currentUnit.id, {
						damageTaken: surface.damage,
						newStatuses: surface.status ? [surface.status] : undefined,
					});
				}

				const targetSurface = nextSurfaces[surface.id];
				if (targetSurface && targetSurface.charges !== undefined) {
					targetSurface.charges -= 1;
					surfacesChanged = true;
					if (targetSurface.charges <= 0) {
						delete nextSurfaces[surface.id];
					}
				}
			}

			if (surfacesChanged) {
				set((prev) => ({ ...prev, surfaces: nextSurfaces }));
			}

			const freshUnit = refreshUnit();
			if (!freshUnit || freshUnit.currentHp <= 0) {
				return freshUnit;
			}

			currentUnit = freshUnit;

			if (currentUnit.statuses.some((s) => s.type === "rooted")) {
				break;
			}
		}

		if (!forcedMove && currentUnit) {
			await updateUnitState(
				get,
				set,
				isSimulation,
			)(currentUnit.id, {
				stance: UnitStance.IDLE,
			});
			currentUnit = refreshUnit() || currentUnit;
		}

		return currentUnit;
	};
}

// ==========================================
// 2. PATHFINDING ALGORITHMS
// ==========================================
export const calculateExactPath = <C extends BattleUnit, T extends BattleUnit>({
	movingUnit,
	targetPos,
	units,
	minRange = 0,
	maxRange = 0,
	gridSize,
	surfaces,
}: {
	movingUnit: C;
	targetPos: GridPosition;
	units: T[];
	minRange?: number;
	maxRange?: number;
	gridSize: { rows: number; cols: number };
	surfaces?: Record<string, SurfaceData>;
}): GridPosition[] => {
	const startPos = movingUnit.gridPosition;
	const target = { gridPosition: targetPos };

	const initialDist = getDistanceToBoundingBox({ caster: movingUnit, target });
	if (initialDist >= minRange && initialDist <= maxRange) {
		return [];
	}

	const queue: GridPosition[] = [startPos];
	const cameFrom = new Map<string, GridPosition | null>();
	cameFrom.set(getCellId(startPos), null);

	let validDestination: GridPosition | null = null;

	while (queue.length > 0) {
		// biome-ignore lint/style/noNonNullAssertion: <We just checked the length>
		const currentPos = queue.shift()!;

		const distToTarget = getDistanceToBoundingBox({
			caster: { ...movingUnit, gridPosition: currentPos },
			target,
		});

		if (distToTarget >= minRange && distToTarget <= maxRange) {
			validDestination = currentPos;
			break;
		}

		const neighbors = [
			{ row: currentPos.row - 1, col: currentPos.col },
			{ row: currentPos.row + 1, col: currentPos.col },
			{ row: currentPos.row, col: currentPos.col - 1 },
			{ row: currentPos.row, col: currentPos.col + 1 },
		];

		for (const next of neighbors) {
			if (!isTileSafe(next, movingUnit, surfaces)) {
				continue;
			}

			const fits = canUnitFit({
				unit: { ...movingUnit, gridPosition: next },
				units,
				gridSize,
			});

			if (!fits) continue;

			const key = getCellId(next);
			if (!cameFrom.has(key)) {
				cameFrom.set(key, currentPos);
				queue.push(next);
			}
		}
	}

	if (!validDestination) return [];

	const path: GridPosition[] = [];
	let current: GridPosition | null = validDestination;

	while (current && getCellId(current) !== getCellId(startPos)) {
		path.push(current);
		current = cameFrom.get(getCellId(current)) || null;
	}

	return path.reverse();
};

export const calculateReachableCells = <T extends BattleUnit>({
	movingUnit,
	blockingFigures: units,
	canTargetSelf = false,
	gridSize,
	surfaces,
}: {
	movingUnit: BattleUnit;
	blockingFigures: T[];
	canTargetSelf: boolean;
	gridSize: { cols: number; rows: number };
	surfaces?: Record<string, SurfaceData>;
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
			];

			for (const next of neighbors) {
				const key = `${next.row},${next.col}`;
				if (!visited.has(key)) {
					visited.add(key);

					if (!isTileSafe(next, movingUnit, surfaces)) {
						continue;
					}

					if (
						canUnitFit({
							unit: { ...movingUnit, gridPosition: next },
							units,
							gridSize,
						})
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
	gridSize,
}: {
	attacker: BattleUnit;
	rangeValue: number;
	canTargetSelf?: boolean;
	gridSize: { cols: number; rows: number };
}): GridPosition[] => {
	const attackable: GridPosition[] = [];

	for (let row = 0; row < gridSize.rows; row++) {
		for (let col = 0; col < gridSize.cols; col++) {
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
