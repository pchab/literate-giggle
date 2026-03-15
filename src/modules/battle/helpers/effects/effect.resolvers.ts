import type {
	AnchorTarget,
	CardEffect,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { resolveMoveEffect } from "./move.effect.resolver";
import { resolvePushEffect } from "./push.effect.resolver";
import { resolveStandardEffect } from "./standard.effect.resolver";
import { resolveSummonEffect } from "./summon.effect.resolver";
import { resolveSurfaceEffect } from "./surface.effect.resolver";

export interface EffectResolverParams<C extends BattleUnit> {
	anchorTarget: AnchorTarget;
	caster: C;
	patternCells?: { col: number; row: number }[];
}

export type EffectResolver = <C extends BattleUnit, E extends CardEffect>(
	get: StoreGet,
	set: StoreSet,
) => (effect: E) => (params: EffectResolverParams<C>) => Promise<void>;

export const resolvers =
	(effect: CardEffect) => (get: StoreGet, set: StoreSet) => {
		switch (effect.type) {
			case "move":
				return resolveMoveEffect(get, set)(effect);
			case "damage":
				return resolveStandardEffect(get, set)(effect);
			case "heal":
				return resolveStandardEffect(get, set)(effect);
			case "apply_status":
				return resolveStandardEffect(get, set)(effect);
			case "create_surface":
				return resolveSurfaceEffect(get, set)(effect);
			case "summon":
				return resolveSummonEffect(get, set)(effect);
			case "push":
				return resolvePushEffect(get, set)(effect);
			default:
				return resolveStandardEffect(get, set)(effect);
		}
	};
