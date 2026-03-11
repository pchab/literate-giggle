import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import type { StoreSet } from "../store/battle.store";

export function updateBattleUnitState<T extends BattleUnit>(set: StoreSet) {
	return (unit: T) => {
		if (isSummon(unit)) {
			set(({ summons }) => ({
				summons: summons.map((m) => (m.id === unit.id ? unit : m)),
			}));
		}
		if (isMonster(unit)) {
			set(({ monsters }) => ({
				monsters: monsters.map((m) => (m.id === unit.id ? unit : m)),
			}));
		}
		if (isHero(unit)) {
			set(({ heroes }) => ({
				heroes: heroes.map((h) => (h.id === unit.id ? unit : h)),
			}));
		}
	};
}
