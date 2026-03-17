import type { EffectResolverParams } from "@/modules/battle/helpers/effects/effect.resolvers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";

type CustomScriptEffectResolver<T extends BattleUnit, P> = (
	get: StoreGet,
	set: StoreSet,
) => (params: EffectResolverParams<T>, payload: P) => void;

export const customScriptRegistry: Record<
	string,
	CustomScriptEffectResolver<BattleUnit, unknown>
> = {};
