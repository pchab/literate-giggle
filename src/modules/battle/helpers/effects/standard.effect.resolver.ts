/** biome-ignore-all lint/style/noNonNullAssertion: <effect.projectile guard not working> */
import type {
	ApplyStatusEffect,
	DamageEffect,
	HealEffect,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { sleep } from "@/modules/shared/helpers/sleep";
import type { GridPosition } from "../../domain/grid.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { getCellId } from "../grid.helpers";
import { findUnit, updateBattleUnitState } from "../state.helpers";
import { getVfxForEffect } from "../vfx.helper";
import { applyEffectToEntity, resolveTargets } from "./effect.helpers";
import type { EffectResolverParams } from "./effect.resolvers";

export const resolveStandardEffect =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
		(effect: DamageEffect | HealEffect | ApplyStatusEffect) =>
			async <C extends BattleUnit>({
				anchorTarget,
				caster,
				patternCells,
			}: EffectResolverParams<C>): Promise<void> => {
				const { heroes, monsters, summons } = get();
				const figures = [...heroes, ...monsters, ...summons];
				const targets = resolveTargets<BattleUnit>(
					effect.target,
					anchorTarget,
					caster,
					figures,
					patternCells,
				);
				const targetPositions: GridPosition[] = [];

				for (const targetId of targets) {
					const target = findUnit(get)(targetId);
					if (!target) continue;

					if (effect.projectile && !isSimulation) {
						const { currentVfx } = get();
						const projectileId = crypto.randomUUID();

						const dx = target.gridPosition.col - caster.gridPosition.col;
						const dy = target.gridPosition.row - caster.gridPosition.row;
						const angle = Math.atan2(dy, dx) * (180 / Math.PI);

						set(() => ({
							currentVfx: {
								...currentVfx,
								[getCellId(caster.gridPosition)]: {
									type: effect.projectile!,
									id: projectileId,
									angle,
								},
							},
						}));
						await sleep(100);
						set(() => ({
							currentVfx: {
								...currentVfx,
								[getCellId(target.gridPosition)]: {
									type: effect.projectile!,
									id: projectileId,
									angle,
								},
							},
						}));
						await sleep(300);
					}

					const updatedEntity = applyEffectToEntity({ entity: target, effect });
					targetPositions.push(updatedEntity.gridPosition);
					await updateBattleUnitState(get, set, isSimulation)(updatedEntity);
				}

				set((prev) => {
					const newVfx = getVfxForEffect(effect, targetPositions);

					return {
						...prev,
						currentVfx: { ...prev.currentVfx, ...newVfx },
					};
				});
			};
