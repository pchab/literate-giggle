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
import type { EffectResolver } from "./effect.resolvers";

type CasterFaction = "HERO" | "MONSTER";

function getCasterFaction<T extends BattleUnit>(caster: T): CasterFaction {
	if (isHeroId(caster.id)) return "HERO";
	if (isMonsterId(caster.id)) return "MONSTER";
	if (isSummon(caster)) {
		return caster.allegiance === "PLAYER" ? "HERO" : "MONSTER";
	}

	return "HERO";
}

export const resolveSummonEffect: EffectResolver<BattleUnit, SummonEffect> =
	(_, set) =>
	(effect) =>
	async ({ anchorTarget, caster }) => {
		const allegiance = getCasterFaction(caster) === "HERO" ? "PLAYER" : "ENEMY";
		if (anchorTarget) {
			const blueprint = summonLibrary[effect.blueprintId];
			set(({ units }) => ({
				units: [
					...units,
					{
						id: summonId(Date.now()),
						...blueprint,
						stance: UnitStance.IDLE,
						currentHp: blueprint.maxHp,
						statuses: [],
						gridPosition: anchorTarget.gridPosition,
						allegiance,
					},
				],
			}));
		}
	};
