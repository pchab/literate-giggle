import type { BattleUnit } from "@/modules/figures/domain/figures.type";
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
		let currentUnit = { ...movingUnit };

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
				if (newSurface.charges === 0) {
					delete draftSurfaces[stepCellId];
				} else {
					draftSurfaces[stepCellId] = newSurface;
				}

				updateBattleUnitState(set)(currentUnit);
				set(() => ({ surfaces: draftSurfaces }));

				if (
					currentUnit.currentHp <= 0 ||
					newSurface.status?.type === "rooted"
				) {
					break;
				}
			}
		}

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
	const queue: GridPosition[][] = [[startPos]];
	const visited = new Set<string>();
	visited.add(getCellId(startPos));

	while (queue.length > 0) {
		const currentPath = queue.shift();
		if (!currentPath) return [];
		const currentPos = currentPath[currentPath.length - 1];

		const distToTarget = getManhattanDistance(currentPos, targetPos);
		if (distToTarget >= minRange && distToTarget <= maxRange) {
			return currentPath.slice(1);
		}

		[
			{ row: currentPos.row - 1, col: currentPos.col },
			{ row: currentPos.row + 1, col: currentPos.col },
			{ row: currentPos.row, col: currentPos.col - 1 },
			{ row: currentPos.row, col: currentPos.col + 1 },
		]
			.filter(isTileInBounds)
			.filter(isTileEmpty(figures))
			.forEach((next) => {
				const key = getCellId(next);
				if (visited.has(key)) return;

				visited.add(key);
				queue.push([...currentPath, next]);
			});
	}
	return [];
};
