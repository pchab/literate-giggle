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
		const isDead = unit.currentHp < 1;
		if (isSummon(unit)) {
			set(({ summons, ...state }) => ({
				...state,
				summons: isDead
					? summons.filter((s) => s.id !== unit.id)
					: summons.map((s) => (s.id === unit.id ? unit : s)),
				...newState,
			}));
		}
		if (isMonster(unit)) {
			set(({ monsters, ...state }) => ({
				...state,
				monsters: isDead
					? monsters.filter((m) => m.id !== unit.id)
					: monsters.map((m) => (m.id === unit.id ? unit : m)),
				...newState,
			}));
		}
		if (isHero(unit)) {
			set(({ heroes, ...state }) => ({
				...state,
				heroes: isDead
					? heroes.filter((h) => h.id !== unit.id)
					: heroes.map((h) => (h.id === unit.id ? unit : h)),
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

	realFigures.forEach((realUnit) => {
		const shadowUnit = shadowFigures.find((f) => f.id === realUnit.id);
		if (!shadowUnit) {
			projectedCasualties.push(realUnit.id);
			return;
		}

		if (!isUnitInTile(realUnit.gridPosition)(shadowUnit)) {
			projectedMoves[shadowUnit.id] = shadowUnit.gridPosition;
		}
		if (realUnit.currentHp > 0 && shadowUnit.currentHp <= 0) {
			console.warn(
				`shadow unit ${shadowUnit.id} is dead but has not been removed`,
			);
			projectedCasualties.push(shadowUnit.id);
		}
	});
	return { projectedMoves, projectedCasualties };
};
