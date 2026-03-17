import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import type { GridPosition } from "../domain/grid.type";
import type { BattleState, StoreSet } from "../store/battle.store";
import { isUnitInTile } from "./grid.helpers";

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

export const calculateStateDiff = (
	shadowFigures: BattleUnit[],
	realFigures: BattleUnit[],
) => {
	const projectedMoves: Record<BattleUnit["id"], GridPosition> = {};
	const projectedCasualties: BattleUnit["id"][] = [];

	shadowFigures.forEach((shadowUnit) => {
		const realUnit = realFigures.find((f) => f.id === shadowUnit.id);
		if (!realUnit) return;

		if (!isUnitInTile(realUnit.gridPosition)(shadowUnit)) {
			projectedMoves[shadowUnit.id] = shadowUnit.gridPosition;
		}
		if (realUnit.currentHp > 0 && shadowUnit.currentHp <= 0) {
			projectedCasualties.push(shadowUnit.id);
		}
	});
	return { projectedMoves, projectedCasualties };
};
