import type { MoveEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { updateBattleUnitState } from "../state.helpers";
import type { EffectResolverParams } from "./effect.resolvers";

export const resolveMoveEffect =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	(effect: MoveEffect) =>
	async <T extends BattleUnit>({
		anchorTarget,
		caster,
	}: EffectResolverParams<T>): Promise<void> => {
		if (anchorTarget && effect.target === "self") {
			await updateBattleUnitState(
				get,
				set,
				isSimulation,
			)({ ...caster, gridPosition: anchorTarget });
		}
	};
