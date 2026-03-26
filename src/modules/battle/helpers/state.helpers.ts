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
		const isDead = unit.currentHp < 1;

		const toRemove = isDead && !unit.isDeathRattle;

		if (toRemove) {
			if (isHeroId(unit.id)) {
				set(({ heroes }) => ({
					heroes: heroes.map((h) =>
						h.id === unit.id ? { ...h, isDeathRattle: true } : h,
					),
				}));
			}

			if (isMonsterId(unit.id)) {
				set(({ monsters }) => ({
					monsters: monsters.map((m) =>
						m.id === unit.id ? { ...m, isDeathRattle: true } : m,
					),
				}));
			}

			if (isSummonId(unit.id)) {
				set(({ summons }) => ({
					summons: summons.map((s) =>
						s.id === unit.id ? { ...s, isDeathRattle: true } : s,
					),
				}));
			}

			await processUnitDeath(get, set, isSimulation)(unit);
		}

		if (isSummon(unit)) {
			set(({ summons, ...state }) => ({
				...state,

				summons: toRemove
					? summons.filter((s) => s.id !== unit.id)
					: summons.map((s) => (s.id === unit.id ? unit : s)),

				...newState,
			}));
		}

		if (isMonster(unit)) {
			set(({ monsters, ...state }) => ({
				...state,

				monsters: toRemove
					? monsters.filter((m) => m.id !== unit.id)
					: monsters.map((m) => (m.id === unit.id ? unit : m)),

				...newState,
			}));
		}

		if (isHero(unit)) {
			set(({ heroes, ...state }) => ({
				...state,

				heroes: toRemove
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
			projectedCasualties.push(shadowUnit.id);
		}
	});
	return { projectedMoves, projectedCasualties };
};
