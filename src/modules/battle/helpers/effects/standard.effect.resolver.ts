import type {
	ApplyStatusEffect,
	DamageEffect,
	HealEffect,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "../../domain/grid.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { getVfxForEffect } from "../vfx.helper";
import { applyEffectToEntity, resolveTargets } from "./effect.helpers";
import type { EffectResolverParams } from "./effect.resolvers";

export const resolveStandardEffect =
	(get: StoreGet, set: StoreSet) =>
	(effect: DamageEffect | HealEffect | ApplyStatusEffect) =>
	<C extends BattleUnit>({
		anchorTarget,
		caster,
		patternCells,
	}: EffectResolverParams<C>): void => {
		const { heroes, monsters, summons } = get();
		const figures = [...heroes, ...monsters, ...summons];
		const targets = resolveTargets<BattleUnit>(
			effect.target,
			anchorTarget,
			caster,
			figures,
			patternCells,
		);
		const targetSet = new Set(targets);
		const targetPositions: GridPosition[] = [];

		set((prev) => {
			const updateList = <T extends BattleUnit>(list: T[]) =>
				list
					.map((figure) => {
						if (targetSet.has(figure.id)) {
							const updatedEntity = applyEffectToEntity(figure, effect);
							targetPositions.push(updatedEntity.gridPosition);
							return updatedEntity;
						}
						return figure;
					})
					.filter(({ currentHp }) => currentHp > 0);

			const updatedHeroes = updateList(prev.heroes);
			const updatedMonsters = updateList(prev.monsters);
			const updatedSummons = updateList(prev.summons);

			const newVfx = getVfxForEffect(effect, targetPositions);

			return {
				...prev,
				heroes: updatedHeroes,
				monsters: updatedMonsters,
				summons: updatedSummons,
				currentVfx: { ...prev.currentVfx, ...newVfx },
			};
		});
	};
