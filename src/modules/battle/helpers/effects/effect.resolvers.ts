import { customScriptRegistry } from "@/modules/cards/data/customScripts.data";
import type {
	AnchorTarget,
	CardEffect,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { resolveChargeEffect } from "./charge.effect.resolver";
import { resolveMoveEffect } from "./move.effect.resolver";
import { resolvePushEffect } from "./push.effect.resolver";
import { resolveStandardEffect } from "./standard.effect.resolver";
import { resolveSummonEffect } from "./summon.effect.resolver";
import { resolveSurfaceEffect } from "./surface.effect.resolver";

interface EffectResolverParams<C extends BattleUnit> {
	anchorTarget: AnchorTarget;
	caster: C;
	patternCells?: { col: number; row: number }[];
	targetIds: BattleUnit["id"][];
}

export type EffectResolver<C extends BattleUnit, E extends CardEffect> = (
	get: StoreGet,
	set: StoreSet,
	isSimulation: boolean,
) => (effect: E) => (params: EffectResolverParams<C>) => Promise<void>;

export const resolvers: EffectResolver<BattleUnit, CardEffect> =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	(effect: CardEffect) => {
		switch (effect.type) {
			case "move":
				return resolveMoveEffect(get, set, isSimulation)(effect);
			case "damage":
				return resolveStandardEffect(get, set, isSimulation)(effect);
			case "heal":
				return resolveStandardEffect(get, set, isSimulation)(effect);
			case "apply_status":
				return resolveStandardEffect(get, set, isSimulation)(effect);
			case "create_surface":
				return resolveSurfaceEffect(get, set, isSimulation)(effect);
			case "summon":
				return resolveSummonEffect(get, set, isSimulation)(effect);
			case "push":
				return resolvePushEffect(get, set, isSimulation)(effect);
			case "charge":
				return resolveChargeEffect(get, set, isSimulation)(effect);
			case "custom_script": {
				const script = customScriptRegistry[effect.scriptId];
				if (!script) {
					console.error(`[Engine] Missing custom script: ${effect.scriptId}`);
					throw new Error(`Missing custom script: ${effect.scriptId}`);
				}
				return script(get, set, isSimulation)(effect);
			}
			default:
				return resolveStandardEffect(get, set, isSimulation)(effect);
		}
	};
