import type {
	ApplyStatusEffect,
	DamageEffect,
	HealEffect,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "../../domain/grid.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
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
					const updatedEntity = applyEffectToEntity(target, effect);
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
