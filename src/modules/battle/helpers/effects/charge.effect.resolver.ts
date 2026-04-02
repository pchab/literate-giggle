import type { ChargeEffect } from "@/modules/cards/domain/cards.type";
import { type BattleUnit, UnitStance } from "@/modules/units/domain/units.type";
import { isTileInBounds, isUnitInTile } from "../grid.helpers";
import { getLineOfSightPath, moveBattleUnit } from "../move.helpers";
import { applyCombatUpdate, updateUnitState } from "../state.helpers";
import type { EffectResolver } from "./effect.resolvers";
import { resolvePushEffect } from "./push.effect.resolver";

export const resolveChargeEffect: EffectResolver<BattleUnit, ChargeEffect> =
	(get, set, isSimulation = false) =>
	(effect) =>
	async ({ anchorTarget, caster }) => {
		if (!anchorTarget) {
			return;
		}
		const { gridSize } = get();
		const fullPath = getLineOfSightPath(
			caster.gridPosition,
			anchorTarget.gridPosition,
		).filter(isTileInBounds(gridSize));

		let currentCaster = caster;

		if (!isSimulation) {
			await updateUnitState(
				get,
				set,
				isSimulation,
			)(currentCaster.id, {
				stance: UnitStance.ATTACKING,
			});
		}
		for (const tile of fullPath) {
			// 1. Are we dead? (Died to a trap/spikes in the previous tile)
			if (currentCaster.currentHp <= 0) {
				break;
			}

			// 2. Is there a victim in the tile we WANT to enter?
			const victimId = get().units.find(
				(u) =>
					u.currentHp > 0 && isUnitInTile(tile)(u) && u.id !== currentCaster.id,
			)?.id;

			if (victimId) {
				// --- IMPACT ---
				await applyCombatUpdate(
					get,
					set,
					isSimulation,
				)(victimId, {
					damageTaken: effect.collisionDamage,
				});

				// --- ATTEMPT 1: SIDEWAYS PUSH ---
				await resolvePushEffect(
					get,
					set,
					isSimulation,
				)({
					...effect,
					type: "push",
					pushDirection: "sideways",
				})({
					caster: currentCaster,
					anchorTarget: { gridPosition: tile },
					targetIds: [victimId],
					patternCells: [tile],
				});

				let postPushVictim = get().units.find((u) => u.id === victimId);

				// Did the Sideways push fail?
				if (postPushVictim && isUnitInTile(tile)(postPushVictim)) {
					// --- ATTEMPT 2: BACKWARD PUSH ---
					await resolvePushEffect(
						get,
						set,
						isSimulation,
					)({
						...effect,
						type: "push",
						pushDirection: "away",
					})({
						caster: currentCaster,
						anchorTarget: { gridPosition: tile },
						targetIds: [victimId],
						patternCells: [tile],
					});

					postPushVictim = get().units.find((u) => u.id === victimId);

					// Did the Backward push fail too?
					if (postPushVictim && isUnitInTile(tile)(postPushVictim)) {
						// --- CRUSH! ---
						await applyCombatUpdate(
							get,
							set,
							isSimulation,
						)(victimId, {
							damageTaken: 2 * effect.collisionDamage,
						});
						break;
					}
				}
			}

			// 3. The tile is now empty. Step into it.
			const movedCaster = await moveBattleUnit(
				get,
				set,
				isSimulation,
			)({
				movingUnit: currentCaster,
				path: [tile],
				forcedMove: true,
				stepDelayMs: 100,
			});

			// Trust the engine! Did a status or trap cancel our move?
			if (
				!movedCaster ||
				movedCaster.gridPosition.col !== tile.col ||
				movedCaster.gridPosition.row !== tile.row
			) {
				break;
			}

			currentCaster = movedCaster;
		}
		if (!isSimulation) {
			await updateUnitState(
				get,
				set,
				isSimulation,
			)(currentCaster.id, {
				stance: UnitStance.IDLE,
			});
		}
	};
