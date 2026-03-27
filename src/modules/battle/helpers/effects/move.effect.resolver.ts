import type { MoveEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { getLineOfSightPath } from "../grid.helpers";
import { moveBattleUnit } from "../move.helpers";
import type { EffectResolverParams } from "./effect.resolvers";

export const resolveMoveEffect =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	(effect: MoveEffect) =>
	async <T extends BattleUnit>({
		anchorTarget,
		caster,
	}: EffectResolverParams<T>): Promise<void> => {
		if (anchorTarget && effect.target === "self") {
			const path = getLineOfSightPath(
				caster.gridPosition,
				anchorTarget.gridPosition,
			);
			await moveBattleUnit(
				get,
				set,
				isSimulation,
			)({
				movingUnit: caster,
				path,
				forcedMove: true,
				stepDelayMs: isSimulation ? 0 : 100,
			});
		}
	};
