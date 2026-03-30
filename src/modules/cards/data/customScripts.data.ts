import type { EffectResolverParams } from "@/modules/battle/helpers/effects/effect.resolvers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { alchemicalFrenzy } from "./custom-scripts/alchemicalFrenzy.script";
import { recklessExperiment } from "./custom-scripts/recklessExperiment.script";
import { swallow } from "./custom-scripts/swallow.script";
import { trapdoorSpawn } from "./custom-scripts/trapDoorSpawn.script";
import { volatileTransmutation } from "./custom-scripts/volatileTransmutation.script";

type CustomScriptEffectResolver<T extends BattleUnit, P> = (
	get: StoreGet,
	set: StoreSet,
	isSimulation: boolean,
) => (params: EffectResolverParams<T>, payload: P) => Promise<void>;

export const customScriptRegistry: Record<
	string,
	CustomScriptEffectResolver<BattleUnit, unknown>
> = {
	trapdoor_spawn: trapdoorSpawn as CustomScriptEffectResolver<
		BattleUnit,
		unknown
	>,
	reckless_experiment: recklessExperiment as CustomScriptEffectResolver<
		BattleUnit,
		unknown
	>,
	volatile_transmutation: volatileTransmutation as CustomScriptEffectResolver<
		BattleUnit,
		unknown
	>,
	alchemical_frenzy: alchemicalFrenzy as CustomScriptEffectResolver<
		BattleUnit,
		unknown
	>,
	swallow: swallow as CustomScriptEffectResolver<BattleUnit, unknown>,
};
