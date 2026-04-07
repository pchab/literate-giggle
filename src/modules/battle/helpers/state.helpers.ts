import { useRegistryStore } from "@/modules/shared/store/registry.store";
import type { Status } from "@/modules/units/domain/status.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import type { GridPosition } from "../domain/grid.type";
import type { ShadowStateDiff } from "../domain/intent.type";
import type { BattleGet, BattleSet } from "../store/battle.store";
import { handleAICardIntent } from "./ai.actions.helpers";
import { isUnitInTile } from "./grid.helpers";
import { statusRegistry } from "./status.helpers";

export const findUnit =
	(get: BattleGet) =>
	<T extends BattleUnit>(unitId: T["id"]): T | undefined => {
		return get().units.find((u) => u.id === unitId) as T | undefined;
	};

export function updateUnitState<T extends BattleUnit>(
	_: BattleGet,
	set: BattleSet,
	__ = false,
) {
	return async (
		unitId: T["id"],
		newState: Partial<Omit<T, "currentHp" | "statuses">> = {},
	): Promise<void> => {
		set(({ units }) => ({
			units: units.map((u) => (u.id === unitId ? { ...u, ...newState } : u)),
		}));
	};
}

export const calculateStateDiff = (
	shadowUnits: BattleUnit[],
	realUnits: BattleUnit[],
): ShadowStateDiff => {
	const projectedMoves: Record<BattleUnit["id"], GridPosition> = {};
	const projectedCasualties: BattleUnit["id"][] = [];
	const projectedDamage: Record<BattleUnit["id"], number> = {};
	const projectedHealing: Record<BattleUnit["id"], number> = {};

	realUnits.forEach((realUnit) => {
		const shadowUnit = shadowUnits.find((f) => f.id === realUnit.id);

		if (!shadowUnit) {
			projectedCasualties.push(realUnit.id);
			projectedDamage[realUnit.id] = realUnit.currentHp;
			return;
		}

		if (!isUnitInTile(realUnit.gridPosition)(shadowUnit)) {
			projectedMoves[shadowUnit.id] = shadowUnit.gridPosition;
		}

		const hpDiff = realUnit.currentHp - Math.max(0, shadowUnit.currentHp);

		if (hpDiff > 0) {
			projectedDamage[realUnit.id] = hpDiff;
		} else if (hpDiff < 0) {
			projectedHealing[realUnit.id] = Math.abs(hpDiff);
		}

		if (realUnit.currentHp > 0 && shadowUnit.currentHp <= 0) {
			projectedCasualties.push(shadowUnit.id);
		}
	});

	return {
		projectedMoves,
		projectedCasualties,
		projectedDamage,
		projectedHealing,
	};
};

export type CombatUpdate = {
	damageTaken?: number;
	isTrueDamage?: boolean;
	healingReceived?: number;
	newStatuses?: Status[];
	replaceStatuses?: Status[];
};

export const applyCombatUpdate =
	(get: BattleGet, set: BattleSet, isSimulation = false) =>
	async <T extends BattleUnit>(
		initialUnitId: T["id"],
		update: CombatUpdate,
	): Promise<void> => {
		const maybeUnit = findUnit(get)(initialUnitId);
		if (!maybeUnit) return;

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
						isTrueDamage: update.isTrueDamage, // <--- Let hooks know!
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

		if (pendingDamage > 0) {
			const finalDamage = update.isTrueDamage
				? pendingDamage
				: Math.max(pendingDamage - currentUnit.baseDef, 0);

			currentUnit.currentHp = Math.max(0, currentUnit.currentHp - finalDamage);
		}

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
				const onDeathCard = useRegistryStore
					.getState()
					.getCard(currentUnit.onDeath);
				onDeathCard &&
					(await handleAICardIntent(
						get,
						set,
						isSimulation,
					)({
						attackerId: currentUnit.id,
						card: onDeathCard,
					}));
			}
		}

		// ==========================================
		// 3. ONE-LINER STORE COMMIT
		// ==========================================
		set(({ units }) => ({
			units: toRemove
				? units.filter((u) => u.id !== currentUnit.id)
				: units.map((u) => (u.id === currentUnit.id ? currentUnit : u)),
		}));
	};
