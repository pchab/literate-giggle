import type {
	ApplyStatusEffect,
	DamageEffect,
	HealEffect,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
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
		const { heroes, monsters, summons, currentVfx } = get();
		const figures = [...heroes, ...monsters, ...summons];
		const targets = resolveTargets<BattleUnit>(
			effect.target,
			anchorTarget,
			caster,
			figures,
			patternCells,
		);

		const updatedFigures = figures.map((figure) =>
			targets.includes(figure.id)
				? applyEffectToEntity(figure, effect)
				: figure,
		);
		const newVfx = getVfxForEffect(
			effect,
			updatedFigures
				.filter((f) => targets.includes(f.id))
				.map((f) => f.gridPosition),
		);
		Object.assign(currentVfx, newVfx);

		set(() => ({
			heroes: updatedFigures.filter((f) => isHero(f)),
			monsters: updatedFigures.filter((f) => isMonster(f)),
			summons: updatedFigures.filter((f) => isSummon(f)),
			currentVfx,
		}));
	};
