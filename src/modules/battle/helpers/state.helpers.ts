import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import type { BattleState } from "../store/battle.store";

export function updateAiBattleUnitState<T extends BattleUnit>(
	unit: T,
	newState: Partial<BattleState> = {},
) {
	return (state: BattleState) => {
		let battleUnitState = {};
		if (isSummon(unit)) {
			battleUnitState = {
				summons: state.summons.map((m) => (m.id === unit.id ? unit : m)),
			};
		}
		if (isMonster(unit)) {
			battleUnitState = {
				monsters: state.monsters.map((m) => (m.id === unit.id ? unit : m)),
			};
		}
		if (isHero(unit)) {
			battleUnitState = {
				heroes: state.heroes.map((h) => (h.id === unit.id ? unit : h)),
			};
		}
		return {
			...state,
			...newState,
			...battleUnitState,
		};
	};
}
