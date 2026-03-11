import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import type { BattleState, StoreSet } from "../store/battle.store";

export function updateBattleUnitState<T extends BattleUnit>(set: StoreSet) {
	return (unit: T, newState: Partial<BattleState> = {}) => {
		if (isSummon(unit)) {
			set(({ summons, ...state }) => ({
				...state,
				summons: summons.map((m) => (m.id === unit.id ? unit : m)),
				...newState,
			}));
		}
		if (isMonster(unit)) {
			set(({ monsters, ...state }) => ({
				...state,
				monsters: monsters.map((m) => (m.id === unit.id ? unit : m)),
				...newState,
			}));
		}
		if (isHero(unit)) {
			set(({ heroes, ...state }) => ({
				...state,
				heroes: heroes.map((h) => (h.id === unit.id ? unit : h)),
				...newState,
			}));
		}
	};
}
