import type { MoveEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { updateBattleUnitState } from "../state.helpers";
import type { EffectResolverParams } from "./effect.resolvers";

export const resolveMoveEffect =
	(_: StoreGet, set: StoreSet) =>
	(effect: MoveEffect) =>
	<T extends BattleUnit>({
		anchorTarget,
		caster,
	}: EffectResolverParams<T>): void => {
		if (anchorTarget && effect.target === "self") {
			updateBattleUnitState(set)({ ...caster, gridPosition: anchorTarget });
		}
	};
