import type { SummonEffect } from "@/modules/cards/domain/cards.type";
import { summonLibrary } from "@/modules/figures/data/summons/summons.data";
import {
	type BattleUnit,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import {
	isHeroId,
	isMonsterId,
	isSummon,
	summonId,
} from "@/modules/figures/helpers/figures.helpers";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import type { EffectResolverParams } from "./effect.resolvers";

type CasterFaction = "HERO" | "MONSTER";

function getCasterFaction<T extends BattleUnit>(caster: T): CasterFaction {
	if (isHeroId(caster.id)) return "HERO";
	if (isMonsterId(caster.id)) return "MONSTER";
	if (isSummon(caster)) {
		return caster.allegiance === "PLAYER" ? "HERO" : "MONSTER";
	}

	return "HERO";
}

export const resolveSummonEffect =
	(_: StoreGet, set: StoreSet) =>
	(effect: SummonEffect) =>
	<T extends BattleUnit>({
		anchorTarget,
		caster,
	}: EffectResolverParams<T>): void => {
		const allegiance = getCasterFaction(caster) === "HERO" ? "PLAYER" : "ENEMY";

		if (anchorTarget) {
			const blueprint = summonLibrary[effect.blueprintId];
			set(({ summons }) => ({
				summons: [
					...summons,
					{
						id: summonId(Date.now()),
						...blueprint,
						stance: UnitStance.IDLE,
						currentHp: blueprint.maxHp,
						statuses: [],
						gridPosition: anchorTarget,
						allegiance,
					},
				],
			}));
		}
	};
