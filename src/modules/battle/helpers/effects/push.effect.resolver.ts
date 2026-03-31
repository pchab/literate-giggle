import type { PushEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import {
	getClosestOriginTile,
	isTileInBounds,
	isUnitInTile,
} from "../grid.helpers";
import { moveBattleUnit } from "../move.helpers";
import { applyCombatUpdate } from "../state.helpers";
import type { EffectResolver } from "./effect.resolvers";

export const resolvePushEffect: EffectResolver<BattleUnit, PushEffect> =
	(get, set, isSimulation = false) =>
	(effect) =>
	async ({ anchorTarget, caster, targetIds }) => {
		// --- 1. USE THE UNIFIED ARRAY ---
		let currentFigures = get().units;

		const { col: cX, row: cY } = getClosestOriginTile({
			caster,
			anchorTarget,
		});
		const anchorPos = anchorTarget?.gridPosition ?? caster.gridPosition;

		const chargeDx = Math.sign(anchorPos.col - cX);
		const chargeDy = Math.sign(anchorPos.row - cY);

		const processPush = async (entityId: BattleUnit["id"]) => {
			// --- 2. CLEAN RE-FETCH FOR SEQUENTIAL PUSHES ---
			currentFigures = get().units;
			let entity = currentFigures.find((f) => f.id === entityId);

			if (!entity || entity.currentHp <= 0) return;

			const { col: tX, row: tY } = entity.gridPosition;
			const { col: bodyX, row: bodyY } = getClosestOriginTile({
				caster,
				anchorTarget: entity,
			});
			let dx = 0;
			let dy = 0;

			let isCrushed = false;
			let crushObstacleA: BattleUnit | null = null;
			let crushObstacleB: BattleUnit | null = null;

			const getObstacleAt = (col: number, row: number) =>
				currentFigures.find(
					(f) =>
						isUnitInTile({ col, row })(f) &&
						f.id !== entityId &&
						f.currentHp > 0,
				);

			// ==========================================
			// 2. DETERMINE TRAJECTORY
			// ==========================================
			if (effect.pushDirection === "sideways") {
				const dirA = { dx: -chargeDy, dy: chargeDx };
				const dirB = { dx: chargeDy, dy: -chargeDx };

				const posA = { col: tX + dirA.dx, row: tY + dirA.dy };
				const posB = { col: tX + dirB.dx, row: tY + dirB.dy };

				crushObstacleA = getObstacleAt(posA.col, posA.row) || null;
				crushObstacleB = getObstacleAt(posB.col, posB.row) || null;

				const aBlocked = !isTileInBounds(posA) || !!crushObstacleA;
				const bBlocked = !isTileInBounds(posB) || !!crushObstacleB;

				if (aBlocked && bBlocked) {
					isCrushed = true;
				} else if (aBlocked && !bBlocked) {
					dx = dirB.dx;
					dy = dirB.dy;
				} else if (!aBlocked && bBlocked) {
					dx = dirA.dx;
					dy = dirA.dy;
				} else {
					dx = dirA.dx; // Tie-breaker: defaults to clockwise
					dy = dirA.dy;
				}
			} else if (effect.pushDirection === "towards") {
				dx = -Math.sign(tX - bodyX);
				dy = -Math.sign(tY - bodyY);
			} else {
				// "away"
				dx = Math.sign(tX - bodyX);
				dy = Math.sign(tY - bodyY);
			}

			// ==========================================
			// 3. EXECUTE CRUSH (Early Exit)
			// ==========================================
			if (isCrushed) {
				if (effect.collisionDamage > 0) {
					// Send the combat intents directly to the pipeline!
					await applyCombatUpdate(
						get,
						set,
						isSimulation,
					)(entity.id, { damageTaken: effect.collisionDamage * 2 });

					if (crushObstacleA) {
						await applyCombatUpdate(
							get,
							set,
							isSimulation,
						)(crushObstacleA.id, { damageTaken: effect.collisionDamage });
					}
					if (crushObstacleB) {
						await applyCombatUpdate(
							get,
							set,
							isSimulation,
						)(crushObstacleB.id, { damageTaken: effect.collisionDamage });
					}
				}
				return;
			}

			if (dx === 0 && dy === 0) return;

			// ==========================================
			// 4. CALCULATE MOVEMENT PATH
			// ==========================================
			let currentX = tX;
			let currentY = tY;
			let collidedWith: BattleUnit | null = null;
			const pushPath: { col: number; row: number }[] = [];

			for (let i = 0; i < effect.distance; i++) {
				const nextPos = { col: currentX + dx, row: currentY + dy };
				const obstacle = getObstacleAt(nextPos.col, nextPos.row);

				if (!isTileInBounds(nextPos) || obstacle) {
					collidedWith = obstacle || null;
					break;
				}

				currentX = nextPos.col;
				currentY = nextPos.row;
				pushPath.push({ col: currentX, row: currentY });
			}

			if (pushPath.length === 0 && !collidedWith) return;

			// ==========================================
			// 5. ANIMATE MOVEMENT
			// ==========================================
			if (pushPath.length > 0) {
				const movedEntity = await moveBattleUnit(
					get,
					set,
					isSimulation,
				)({
					movingUnit: entity,
					path: pushPath,
					stepDelayMs: isSimulation ? 0 : 100,
					forcedMove: true,
				});

				// Guard: If they died to a surface during the push, stop processing!
				if (!movedEntity || movedEntity.currentHp <= 0) return;
				entity = movedEntity;
			}

			// ==========================================
			// 6. RESOLVE STANDARD COLLISION
			// ==========================================
			const stoppedShort = pushPath.length < effect.distance;
			if (stoppedShort || collidedWith) {
				if (effect.collisionDamage > 0 && entity.currentHp > 0) {
					// Damage the pushed unit
					await applyCombatUpdate(
						get,
						set,
						isSimulation,
					)(entity.id, { damageTaken: effect.collisionDamage });

					// Damage the obstacle it hit
					if (collidedWith) {
						await applyCombatUpdate(
							get,
							set,
							isSimulation,
						)(collidedWith.id, { damageTaken: effect.collisionDamage });
					}
				}
			}
		};

		// Execute sequentially to prevent concurrent grid state clobbering
		for (const targetId of targetIds) {
			await processPush(targetId);
		}
	};
