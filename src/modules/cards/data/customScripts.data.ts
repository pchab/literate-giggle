import type { EffectResolverParams } from "@/modules/battle/helpers/effects/effect.resolvers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { trapdoorSpawn } from "./custom-scripts/trapDoorSpawn.script";

type CustomScriptEffectResolver<T extends BattleUnit, P> = (
	get: StoreGet,
	set: StoreSet,
) => (params: EffectResolverParams<T>, payload: P) => Promise<void>;

export const customScriptRegistry: Record<
	string,
	CustomScriptEffectResolver<BattleUnit, unknown>
> = {
	trapdoor_spawn: trapdoorSpawn as CustomScriptEffectResolver<
		BattleUnit,
		unknown
	>,
};
