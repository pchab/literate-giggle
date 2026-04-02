import type { MoveEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import { getLineOfSightPath, moveBattleUnit } from "../move.helpers";
import type { EffectResolver } from "./effect.resolvers";

export const resolveMoveEffect: EffectResolver<BattleUnit, MoveEffect> =
	(get, set, isSimulation = false) =>
	(effect) =>
	async ({ anchorTarget, caster }) => {
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
