import {
	type BattleUnit,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import { sleep } from "@/modules/shared/helpers/sleep";
import type { GridPosition } from "../domain/grid.type";
import type { StoreGet, StoreSet } from "../store/battle.store";
import {
	canUnitFit,
	getCellId,
	getDistanceToBoundingBox,
} from "./grid.helpers";
import { applyCombatUpdate, findUnit, updateUnitState } from "./state.helpers";
import { statusRegistry } from "./status.helpers";

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
			// 1. Visual Update: Set moving animation
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
			// ==========================================
			// 1. ASK THE REGISTRY FOR PERMISSION TO MOVE
			// ==========================================
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

			// ==========================================
			// 2. VISUAL UPDATE: Move to next tile
			// ==========================================
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

			// 3. Combat Math: Did we step on something awful?
			const { surfaces: draftSurfaces } = get();
			const stepCellId = getCellId(step);
			const steppedOnSurface = draftSurfaces[stepCellId];

			if (steppedOnSurface) {
				if (steppedOnSurface.damage || steppedOnSurface.status) {
					await applyCombatUpdate(
						get,
						set,
						isSimulation,
					)(currentUnit.id, {
						damageTaken: steppedOnSurface.damage,
						newStatuses: steppedOnSurface.status
							? [steppedOnSurface.status]
							: undefined,
					});
				}

				set((prev) => {
					const nextSurfaces = { ...prev.surfaces };
					const targetSurface = nextSurfaces[stepCellId];
					if (targetSurface && targetSurface.charges !== undefined) {
						targetSurface.charges -= 1;
						if (targetSurface.charges <= 0) {
							delete nextSurfaces[stepCellId];
						}
					}
					return { ...prev, surfaces: nextSurfaces };
				});

				const freshUnit = refreshUnit();
				if (!freshUnit || freshUnit.currentHp <= 0) {
					return freshUnit;
				}

				currentUnit = freshUnit;

				if (currentUnit.statuses.some((s) => s.type === "rooted")) {
					break;
				}
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

export const calculateExactPath = <C extends BattleUnit, T extends BattleUnit>({
	movingUnit,
	targetPos,
	figures,
	minRange = 0,
	maxRange = 0,
}: {
	movingUnit: C;
	targetPos: GridPosition;
	figures: T[];
	minRange?: number;
	maxRange?: number;
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
			const isTargetTile =
				next.row === targetPos.row && next.col === targetPos.col;

			const fits = canUnitFit({
				unit: { ...movingUnit, gridPosition: next },
				figures,
			});

			if (!fits && !(isTargetTile && minRange === 0)) {
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
