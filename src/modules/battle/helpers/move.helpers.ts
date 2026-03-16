import {
	type BattleUnit,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import { sleep } from "@/modules/shared/helpers/sleep";
import type { GridPosition } from "../domain/grid.type";
import type { StoreGet, StoreSet } from "../store/battle.store";
import { applySurfaceEffect } from "./effects/effect.helpers";
import {
	getCellId,
	getManhattanDistance,
	isTileEmpty,
	isTileInBounds,
} from "./grid.helpers";
import { updateBattleUnitState } from "./state.helpers";

export function moveBattleUnit(get: StoreGet, set: StoreSet) {
	return async <T extends BattleUnit>({
		movingUnit,
		path,
		stepDelayMs = 200,
	}: {
		movingUnit: T;
		path: GridPosition[];
		stepDelayMs?: number;
	}): Promise<T> => {
		let currentUnit = { ...movingUnit, stance: UnitStance.MOVING };
		updateBattleUnitState(set)(currentUnit);

		for (const step of path) {
			currentUnit = { ...currentUnit, gridPosition: step };

			updateBattleUnitState(set)(currentUnit);
			await sleep(stepDelayMs);

			const { surfaces: draftSurfaces } = get();
			const stepCellId = getCellId(step);
			const steppedOnSurface = draftSurfaces[stepCellId];

			if (steppedOnSurface) {
				const { surface: newSurface, unit: surfaceUpdatedUnit } =
					applySurfaceEffect({
						unit: currentUnit,
						surface: steppedOnSurface,
					});

				currentUnit = surfaceUpdatedUnit;
				set((prev) => {
					const nextSurfaces = { ...prev.surfaces };
					if (newSurface.charges === 0) {
						delete nextSurfaces[stepCellId];
					} else {
						nextSurfaces[stepCellId] = newSurface;
					}
					return { ...prev, surfaces: nextSurfaces };
				});

				updateBattleUnitState(set)(currentUnit);

				if (
					currentUnit.currentHp <= 0 ||
					newSurface.status?.type === "rooted"
				) {
					break;
				}
			}
		}

		currentUnit = { ...currentUnit, stance: UnitStance.IDLE };
		updateBattleUnitState(set)(currentUnit);
		return currentUnit;
	};
}

export const calculateExactPath = <T extends BattleUnit>(
	startPos: GridPosition,
	targetPos: GridPosition,
	figures: T[],
	minRange = 0,
	maxRange = 0,
): GridPosition[] => {
	const initialDist = getManhattanDistance(startPos, targetPos);
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

		const distToTarget = getManhattanDistance(currentPos, targetPos);
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
			if (!isTileInBounds(next)) continue;

			const isOccupied = !isTileEmpty(figures)(next);
			const isTargetTile =
				next.row === targetPos.row && next.col === targetPos.col;

			if (isOccupied && !(isTargetTile && minRange === 0)) {
				continue;
			}

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
