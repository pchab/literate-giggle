import type { EffectResolver } from "@/modules/battle/helpers/effects/effect.resolvers";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { CustomScriptEffect } from "../domain/cards.type";
import { alchemicalFrenzy } from "./custom-scripts/alchemicalFrenzy.script";
import { recklessExperiment } from "./custom-scripts/recklessExperiment.script";
import { swallow } from "./custom-scripts/swallow.script";
import { trapdoorSpawn } from "./custom-scripts/trapDoorSpawn.script";
import { volatileTransmutation } from "./custom-scripts/volatileTransmutation.script";

export const customScriptRegistry: Record<
	string,
	// biome-ignore lint/suspicious/noExplicitAny: generic payload for custom scripts, can be typed more strictly in script files
	EffectResolver<BattleUnit, CustomScriptEffect<any>>
> = {
	trapdoor_spawn: trapdoorSpawn,
	reckless_experiment: recklessExperiment,
	volatile_transmutation: volatileTransmutation,
	alchemical_frenzy: alchemicalFrenzy,
	swallow: swallow,
};
