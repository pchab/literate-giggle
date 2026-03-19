import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import {
	isHero,
	isHeroId,
	isMonster,
	isMonsterId,
	isSummon,
	isSummonId,
} from "@/modules/figures/helpers/figures.helpers";
import type { GridPosition } from "../domain/grid.type";
import type { BattleState, StoreGet, StoreSet } from "../store/battle.store";
import { processUnitDeath } from "./death.helper";
import { isUnitInTile } from "./grid.helpers";

export const findUnit = (get: StoreGet) => (unitId: BattleUnit["id"]) => {
	if (isHeroId(unitId)) {
		return get().heroes.find((h) => h.id === unitId);
	}
	if (isMonsterId(unitId)) {
		return get().monsters.find((m) => m.id === unitId);
	}
	if (isSummonId(unitId)) {
		return get().summons.find((s) => s.id === unitId);
	}
};

export function updateBattleUnitState<T extends BattleUnit>(
	get: StoreGet,
	set: StoreSet,
	isSimulation = false,
) {
	return async (unit: T, newState: Partial<BattleState> = {}) => {
		const currentStoreUnit = findUnit(get)(unit.id);
		if (currentStoreUnit?.isDeathRattle) return;

		const isDead = unit.currentHp < 1;

		const nextUnit = { ...unit };
		if (isDead) nextUnit.isDeathRattle = true;

		if (isSummon(nextUnit)) {
			set(({ summons, ...state }) => ({ ...state, summons: summons.map((s) => (s.id === unit.id ? nextUnit : s)), ...newState }));
		} else if (isMonster(nextUnit)) {
			set(({ monsters, ...state }) => ({ ...state, monsters: monsters.map((m) => (m.id === unit.id ? nextUnit : m)), ...newState }));
		} else if (isHero(nextUnit)) {
			set(({ heroes, ...state }) => ({ ...state, heroes: heroes.map((h) => (h.id === unit.id ? nextUnit : h)), ...newState }));
		}

		if (isDead) {
			await processUnitDeath(get, set, isSimulation)(nextUnit);

			if (isSummon(unit)) {
				set(({ summons }) => ({ summons: summons.filter((s) => s.id !== unit.id) }));
			} else if (isMonster(unit)) {
				set(({ monsters }) => ({ monsters: monsters.filter((m) => m.id !== unit.id) }));
			} else if (isHero(unit)) {
				set(({ heroes }) => ({ heroes: heroes.filter((h) => h.id !== unit.id) }));
			}
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
