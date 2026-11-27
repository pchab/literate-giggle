import {
	type BattleUnit,
	type Monster,
	UnitStance,
} from "@/modules/units/domain/units.type";
import {
	getVariantFromBlueprint,
	monsterId,
} from "@/modules/units/helpers/units.helpers";
import type { BattleSet } from "../store/battle.store";

/**
 * Countdown for a unit spawned during an enemy turn. That turn's own tick takes one
 * off, so the player sees `afterRounds` and gets that many turns to react.
 */
export function transformCountdown(unit: Pick<BattleUnit, "transformsInto">) {
	return unit.transformsInto
		? { transformIn: unit.transformsInto.afterRounds + 1 }
		: {};
}

/**
 * End of the enemy turn: every unit with a countdown ticks down, and those that
 * reach zero become their `transformsInto` blueprint, as a monster, in place. The
 * new unit keeps the same share of its HP (a cracked boulder wakes weakened).
 */
export const tickTransformations = (set: BattleSet) => {
	set(({ units }) => ({
		units: units.map((unit) => {
			if (unit.transformIn === undefined || !unit.transformsInto) return unit;
			if (unit.currentHp <= 0) return unit;
			const left = unit.transformIn - 1;
			if (left > 0) return { ...unit, transformIn: left };

			const { blueprint } = unit.transformsInto;
			const hp = Math.max(
				1,
				Math.round((blueprint.maxHp * unit.currentHp) / unit.maxHp),
			);
			const woken: Monster = {
				...blueprint,
				id: monsterId(`${blueprint.id}-${crypto.randomUUID()}`),
				variant: getVariantFromBlueprint(blueprint),
				currentHp: hp,
				statuses: [],
				stance: UnitStance.IDLE,
				gridPosition: unit.gridPosition,
			};
			return woken;
		}),
	}));
};
