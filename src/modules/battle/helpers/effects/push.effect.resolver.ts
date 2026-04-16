import type { PushEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import type { GridPosition } from "../../domain/grid.type";
import {
	getClosestOriginTile,
	isTileInBounds,
	isUnitInTile,
} from "../grid.helpers";
import { getLineOfSightPath, moveBattleUnit } from "../move.helpers";
import { applyCombatUpdate } from "../state.helpers";
import type { EffectResolver } from "./effect.resolvers";

type PushPathResult = {
	path: GridPosition[];
	collidedWith: BattleUnit | null;
	isCrushed: boolean;
	crushObstacles: BattleUnit[];
};

const getPushPath = (
	entity: BattleUnit,
	{
		pushDirection = "away",
		distance,
		referenceX,
		referenceY,
		chargeDx,
		chargeDy,
		gridSize,
		removedCells = [],
		getObstacleAt,
	}: {
		pushDirection?: PushEffect["pushDirection"];
		distance: number;
		referenceX: number;
		referenceY: number;
		chargeDx: number;
		chargeDy: number;
		gridSize: { cols: number; rows: number };
		removedCells?: GridPosition[];
		getObstacleAt: (col: number, row: number) => BattleUnit | undefined;
	},
): PushPathResult => {
	const { col: tX, row: tY } = entity.gridPosition;
	const result: PushPathResult = {
		path: [],
		collidedWith: null,
		isCrushed: false,
		crushObstacles: [],
	};

	let staticDx = 0;
	let staticDy = 0;

	// 1. Handle Sideways (Crush Logic)
	if (pushDirection === "sideways") {
		const dirA = { dx: -chargeDy, dy: chargeDx };
		const dirB = { dx: chargeDy, dy: -chargeDx };

		const posA = { col: tX + dirA.dx, row: tY + dirA.dy };
		const posB = { col: tX + dirB.dx, row: tY + dirB.dy };

		const obsA = getObstacleAt(posA.col, posA.row);
		const obsB = getObstacleAt(posB.col, posB.row);

		const aBlocked = !isTileInBounds(gridSize, removedCells)(posA) || !!obsA;
		const bBlocked = !isTileInBounds(gridSize, removedCells)(posB) || !!obsB;

		if (aBlocked && bBlocked) {
			result.isCrushed = true;
			if (obsA) result.crushObstacles.push(obsA);
			if (obsB) result.crushObstacles.push(obsB);
			return result; // Early exit on crush
		}

		if (aBlocked && !bBlocked) {
			staticDx = dirB.dx;
			staticDy = dirB.dy;
		} else if (!aBlocked && bBlocked) {
			staticDx = dirA.dx;
			staticDy = dirA.dy;
		} else {
			staticDx = dirA.dx; // Tie-breaker
			staticDy = dirA.dy;
		}
	}
	// 2. Set static cardinal vectors
	else {
		switch (pushDirection) {
			case "north":
				staticDy = -1;
				break;
			case "south":
				staticDy = 1;
				break;
			case "east":
				staticDx = 1;
				break;
			case "west":
				staticDx = -1;
				break;
		}
	}

	let currentX = tX;
	let currentY = tY;

	for (let i = 0; i < distance; i++) {
		let stepDx = staticDx;
		let stepDy = staticDy;

		// ==========================================
		// TRUE VECTOR CALCULATION (BRESENHAM)
		// ==========================================
		if (pushDirection === "towards" || pushDirection === "away") {
			const targetPoint =
				pushDirection === "towards"
					? { col: referenceX, row: referenceY }
					: {
							// For "away", project a point far in the opposite direction
							col: currentX + (currentX - referenceX) * 10,
							row: currentY + (currentY - referenceY) * 10,
						};

			const idealPath = getLineOfSightPath(
				{ col: currentX, row: currentY },
				targetPoint,
			);

			// idealPath[0] is the current position. idealPath[1] is the true next step.
			if (idealPath.length > 1) {
				stepDx = idealPath[1].col - currentX;
				stepDy = idealPath[1].row - currentY;
			} else {
				break; // We have exactly reached the focal point
			}
		}

		if (stepDx === 0 && stepDy === 0) break;

		let nextPos = { col: currentX + stepDx, row: currentY + stepDy };
		let obstacle = getObstacleAt(nextPos.col, nextPos.row);

		// ==========================================
		// FLUID SLIDE MECHANIC
		// ==========================================
		const isBlocked =
			obstacle || !isTileInBounds(gridSize, removedCells)(nextPos);

		// If moving diagonally and the direct path is blocked, try to "slide"
		if (isBlocked && stepDx !== 0 && stepDy !== 0) {
			const slideHoriz = { col: currentX + stepDx, row: currentY };
			const obsHoriz = getObstacleAt(slideHoriz.col, slideHoriz.row);
			const horizValid =
				isTileInBounds(gridSize, removedCells)(slideHoriz) && !obsHoriz;

			const slideVert = { col: currentX, row: currentY + stepDy };
			const obsVert = getObstacleAt(slideVert.col, slideVert.row);
			const vertValid =
				isTileInBounds(gridSize, removedCells)(slideVert) && !obsVert;

			// Pick the valid slide direction that gets us closer to the target
			const distHoriz =
				Math.abs(slideHoriz.col - referenceX) +
				Math.abs(slideHoriz.row - referenceY);
			const distVert =
				Math.abs(slideVert.col - referenceX) +
				Math.abs(slideVert.row - referenceY);

			if (horizValid && (!vertValid || distHoriz <= distVert)) {
				nextPos = slideHoriz;
				obstacle = undefined;
			} else if (vertValid) {
				nextPos = slideVert;
				obstacle = undefined;
			}
		}

		// ==========================================
		// TERMINAL COLLISION
		// ==========================================
		if (!isTileInBounds(gridSize, removedCells)(nextPos) || obstacle) {
			result.collidedWith = obstacle || null;
			break;
		}

		currentX = nextPos.col;
		currentY = nextPos.row;
		result.path.push({ col: currentX, row: currentY });
	}

	return result;
};

export const resolvePushEffect: EffectResolver<BattleUnit, PushEffect> =
	(get, set, isSimulation = false) =>
	({ pushDirection, distance, collisionDamage, focalPoint }) =>
	async ({ anchorTarget, caster, targetIds }) => {
		const { gridSize, removedCells = [] } = get();
		let currentUnits = get().units;

		const { col: cX, row: cY } = getClosestOriginTile({
			caster,
			anchorTarget,
		});
		const anchorPos = anchorTarget?.gridPosition ?? caster.gridPosition;

		const chargeDx = Math.sign(anchorPos.col - cX);
		const chargeDy = Math.sign(anchorPos.row - cY);

		const processPush = async (entityId: BattleUnit["id"]) => {
			currentUnits = get().units; // Clean re-fetch
			let entity = currentUnits.find((f) => f.id === entityId);

			if (!entity || entity.currentHp <= 0) return;

			const { col: bodyX, row: bodyY } = getClosestOriginTile({
				caster: focalPoint ? { gridPosition: focalPoint } : caster,
				anchorTarget: entity,
			});

			const getObstacleAt = (col: number, row: number) =>
				currentUnits.find(
					(f) =>
						isUnitInTile({ col, row })(f) &&
						f.id !== entityId &&
						f.currentHp > 0,
				);

			// --- 1. DELEGATE TO HELPER ---
			const { path, collidedWith, isCrushed, crushObstacles } = getPushPath(
				entity,
				{
					pushDirection,
					distance,
					referenceX: focalPoint ? focalPoint.col : bodyX,
					referenceY: focalPoint ? focalPoint.row : bodyY,
					chargeDx,
					chargeDy,
					gridSize,
					removedCells,
					getObstacleAt,
				},
			);

			// --- 2. EXECUTE CRUSH ---
			if (isCrushed) {
				if (collisionDamage > 0) {
					await applyCombatUpdate(
						get,
						set,
						isSimulation,
					)(entity.id, { damageTaken: collisionDamage * 2 });
					for (const obs of crushObstacles) {
						await applyCombatUpdate(
							get,
							set,
							isSimulation,
						)(obs.id, { damageTaken: collisionDamage });
					}
				}
				return;
			}

			// --- 3. ANIMATE MOVEMENT ---
			if (path.length > 0) {
				const movedEntity = await moveBattleUnit(
					get,
					set,
					isSimulation,
				)({
					movingUnit: entity,
					path,
					stepDelayMs: isSimulation ? 0 : 100,
					forcedMove: true,
				});

				if (!movedEntity || movedEntity.currentHp <= 0) return;
				entity = movedEntity;
			}

			// --- 4. RESOLVE STANDARD COLLISION ---
			const stoppedShort = path.length < distance;
			if (stoppedShort || collidedWith) {
				if (collisionDamage > 0 && entity.currentHp > 0) {
					await applyCombatUpdate(
						get,
						set,
						isSimulation,
					)(entity.id, { damageTaken: collisionDamage });
					if (collidedWith) {
						await applyCombatUpdate(
							get,
							set,
							isSimulation,
						)(collidedWith.id, { damageTaken: collisionDamage });
					}
				}
			}
		};

		for (const targetId of targetIds) {
			await processPush(targetId);
		}
	};
