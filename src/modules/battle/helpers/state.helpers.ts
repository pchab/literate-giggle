import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { Status } from "@/modules/figures/domain/status.type";
import {
	isHero,
	isHeroId,
	isMonster,
	isMonsterId,
	isSummon,
	isSummonId,
} from "@/modules/figures/helpers/figures.helpers";
import type { GridPosition } from "../domain/grid.type";
import type { StoreGet, StoreSet } from "../store/battle.store";
import { handleAICardIntent } from "./ai.actions.helpers";
import { isUnitInTile } from "./grid.helpers";
import { statusRegistry } from "./status.helpers";

export const findUnit =
	(get: StoreGet) =>
	<T extends BattleUnit>(unitId: T["id"]): T | undefined => {
		if (isHeroId(unitId)) {
			return get().heroes.find((h) => h.id === unitId) as unknown as T;
		}
		if (isMonsterId(unitId)) {
			return get().monsters.find((m) => m.id === unitId) as unknown as T;
		}
		if (isSummonId(unitId)) {
			return get().summons.find((s) => s.id === unitId) as unknown as T;
		}
	};

export function updateUnitState<T extends BattleUnit>(
	_: StoreGet,
	set: StoreSet,
	__ = false,
) {
	return async (
		unitId: T["id"],
		newState: Partial<Omit<T, "currentHp" | "statuses">> = {},
	): Promise<void> => {
		if (isHeroId(unitId))
			set(({ heroes }) => ({
				heroes: heroes.map((h) =>
					h.id === unitId ? { ...h, ...newState } : h,
				),
			}));
		if (isMonsterId(unitId))
			set(({ monsters }) => ({
				monsters: monsters.map((m) =>
					m.id === unitId ? { ...m, ...newState } : m,
				),
			}));
		if (isSummonId(unitId))
			set(({ summons }) => ({
				summons: summons.map((s) =>
					s.id === unitId ? { ...s, ...newState } : s,
				),
			}));
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

export type CombatUpdate = {
	damageTaken?: number;
	healingReceived?: number;
	newStatuses?: Status[];
	replaceStatuses?: Status[];
};

export const applyCombatUpdate =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	async <T extends BattleUnit>(
		initialUnitId: T["id"],
		update: CombatUpdate,
	): Promise<void> => {
		const maybeUnit = findUnit(get)(initialUnitId);
		if (!maybeUnit) {
			return;
		}
		let currentUnit = maybeUnit;
		let pendingDamage = update.damageTaken ?? 0;
		const baseStatuses = update.replaceStatuses
			? [...update.replaceStatuses]
			: [...currentUnit.statuses];
		currentUnit.statuses = baseStatuses;

		// ==========================================
		// PHASE 1: ON BEFORE DAMAGE (Modify the Math)
		// ==========================================
		if (pendingDamage > 0) {
			for (const status of currentUnit.statuses) {
				const hook = statusRegistry[status.type]?.onBeforeDamage;
				if (hook) {
					const { unit, damageTaken } = await hook(
						get,
						set,
						isSimulation,
					)({
						unit: currentUnit,
						damageTaken: pendingDamage,
					});
					currentUnit = unit;
					pendingDamage = damageTaken;
				}
			}
		}

		// ==========================================
		// PHASE 2: CORE MATH (HP & Status Stacking)
		// ==========================================
		const startingHp = currentUnit.currentHp;

		if (pendingDamage > 0)
			currentUnit.currentHp = Math.max(
				0,
				currentUnit.currentHp - pendingDamage,
			);
		if (update.healingReceived)
			currentUnit.currentHp = Math.min(
				currentUnit.maxHp,
				currentUnit.currentHp + update.healingReceived,
			);
		if (update.newStatuses)
			currentUnit.statuses = [...baseStatuses, ...update.newStatuses];

		const actualHpLost = startingHp - currentUnit.currentHp;

		// ==========================================
		// PHASE 3: ON AFTER DAMAGE (Reactions)
		// ==========================================
		if (actualHpLost > 0) {
			for (const status of currentUnit.statuses) {
				const hook = statusRegistry[status.type]?.onAfterDamage;
				if (hook) {
					const result = await hook(
						get,
						set,
						isSimulation,
					)({
						unit: currentUnit,
						hpLost: actualHpLost,
					});
					currentUnit = result.unit;
				}
			}
		}

		// ==========================================
		// PHASE 4: ON DEATH
		// ==========================================
		const isDead = currentUnit.currentHp <= 0;
		const toRemove = isDead && !currentUnit.isDeathRattle;

		if (toRemove) {
			updateUnitState(
				get,
				set,
				isSimulation,
			)(currentUnit.id, { isDeathRattle: true });
			for (const status of currentUnit.statuses) {
				const hook = statusRegistry[status.type]?.onDeath;
				if (hook) {
					const result = await hook(
						get,
						set,
						isSimulation,
					)({ unit: currentUnit });
					currentUnit = result.unit;
				}
			}
			if (currentUnit.onDeath) {
				const onDeathCard = cardLibrary[currentUnit.onDeath];
				await handleAICardIntent(
					get,
					set,
					isSimulation,
				)({
					attackerId: currentUnit.id,
					card: onDeathCard,
				});
			}
		}

		// ==========================================
		// PHASE 5: STORE COMMIT
		// ==========================================
		if (isHero(currentUnit)) {
			set(({ heroes }) => ({
				heroes: toRemove
					? heroes.filter((h) => h.id !== currentUnit.id)
					: heroes.map((h) => (h.id === currentUnit.id ? currentUnit : h)),
			}));
		}
		if (isMonster(currentUnit)) {
			set(({ monsters }) => ({
				monsters: toRemove
					? monsters.filter((m) => m.id !== currentUnit.id)
					: monsters.map((m) => (m.id === currentUnit.id ? currentUnit : m)),
			}));
		}
		if (isSummon(currentUnit)) {
			set(({ summons }) => ({
				summons: toRemove
					? summons.filter((s) => s.id !== currentUnit.id)
					: summons.map((s) => (s.id === currentUnit.id ? currentUnit : s)),
			}));
		}
	};
