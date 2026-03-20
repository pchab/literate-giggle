import type {
	AnchorTarget,
	ApplyStatusEffect,
	DamageEffect,
	EffectTarget,
	HealEffect,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { isHeroId, isSummon } from "@/modules/figures/helpers/figures.helpers";
import type { SurfaceData } from "../../domain/grid.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { getCellId, getLineOfSightPath, isUnitInTile } from "../grid.helpers";
import { updateBattleUnitState } from "../state.helpers";

export const areEnemies = (u1: BattleUnit) => (u2: BattleUnit) => {
	const u1IsPlayer =
		isHeroId(u1.id) || (isSummon(u1) && u1.allegiance === "PLAYER");
	const u2IsPlayer =
		isHeroId(u2.id) || (isSummon(u2) && u2.allegiance === "PLAYER");
	return u1IsPlayer !== u2IsPlayer;
};

export function resolveTargets<T extends BattleUnit>(
	targetType: EffectTarget,
	anchorTarget: AnchorTarget,
	caster: BattleUnit,
	currentFigures: T[],
	patternCells?: { col: number; row: number }[],
): T["id"][] {
	const aliveFigures = currentFigures.filter((f) => f.currentHp > 0);
	if (targetType === "self") {
		if (patternCells && patternCells.length > 0) {
			return patternCells.reduce(
				(targets, cell) =>
					targets.concat(
						aliveFigures.filter(isUnitInTile(cell)).map(({ id }) => id),
					),
				[] as BattleUnit["id"][],
			);
		}
		return [caster.id];
	}

	if (targetType === "anchor" && anchorTarget) {
		if (patternCells && patternCells.length > 0) {
			return patternCells.reduce(
				(targets, cell) =>
					targets.concat(
						aliveFigures.filter(isUnitInTile(cell)).map(({ id }) => id),
					),
				[] as BattleUnit["id"][],
			);
		}

		return aliveFigures.filter(isUnitInTile(anchorTarget)).map((f) => f.id);
	}

	if (targetType === "all_enemies") {
		return aliveFigures.filter(areEnemies(caster)).map((f) => f.id);
	}

	if (targetType === "all_allies") {
		return aliveFigures.filter((f) => !areEnemies(caster)(f)).map((f) => f.id);
	}

	if (targetType === "path" && anchorTarget) {
		const targetPos = anchorTarget as { col: number; row: number };
		const tilePath = getLineOfSightPath(caster.gridPosition, targetPos).slice(
			1,
		);
		const pathCellIds = tilePath.map(getCellId);

		return aliveFigures
			.filter((f) => pathCellIds.includes(getCellId(f.gridPosition)))
			.map((f) => f.id);
	}

	return [];
}

export function applyDamageToEntity<T extends BattleUnit>(
	entity: T,
	baseDamage: number,
): T {
	const vulnerableBonusDamage =
		entity.statuses.find((s) => s.type === "vulnerable")?.amount ?? 0;

	let effectiveDmg = Math.max(
		0,
		baseDamage + vulnerableBonusDamage - entity.baseDef,
	);

	if (effectiveDmg === 0) return entity;

	const updatedStatuses = entity.statuses.map((s) => ({ ...s }));

	const drainShield = (shieldType: string) => {
		if (effectiveDmg <= 0) return;

		const shieldIndex = updatedStatuses.findIndex((s) => s.type === shieldType);
		if (shieldIndex === -1) return;

		const shield = updatedStatuses[shieldIndex];
		if (shield.amount >= effectiveDmg) {
			shield.amount -= effectiveDmg;
			effectiveDmg = 0;
		} else {
			effectiveDmg -= shield.amount;
			shield.amount = 0;
		}
	};

	drainShield("temp_block");
	drainShield("perma_shield");

	const finalStatuses = updatedStatuses.filter((s) => {
		return !(
			(s.type === "temp_block" || s.type === "perma_shield") &&
			s.amount <= 0
		);
	});

	return {
		...entity,
		currentHp: Math.max(0, entity.currentHp - effectiveDmg),
		statuses: finalStatuses,
	};
}

export function applyEffectToEntity<T extends BattleUnit>({
	entity,
	effect,
}: {
	entity: T;
	effect: HealEffect | ApplyStatusEffect | DamageEffect;
}): T {
	if (effect.type === "heal" && entity.currentHp > 0) {
		return {
			...entity,
			currentHp: Math.min(entity.maxHp, entity.currentHp + effect.amount),
		};
	}

	if (effect.type === "damage") {
		return applyDamageToEntity(entity, effect.amount);
	}

	if (
		effect.type === "apply_status" &&
		!entity.immunities?.includes(effect.status.type)
	) {
		const newStatuses = [...entity.statuses];
		const existingStatusIndex = newStatuses.findIndex(
			(s) => s.type === effect.status.type,
		);

		if (existingStatusIndex !== -1) {
			const current = newStatuses[existingStatusIndex];
			newStatuses[existingStatusIndex] = {
				...current,
				amount: current.amount + effect.status.amount,
				duration:
					current.duration === -1 || effect.status.duration === -1
						? -1
						: Math.max(current.duration, effect.status.duration),
			};
		} else {
			newStatuses.push(effect.status);
		}

		return { ...entity, statuses: newStatuses };
	}

	return entity;
}

export const tickStatuses =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
		async <T extends BattleUnit>(figures: T[]): Promise<void> => {
			for (const figure of figures) {
				if (figure.currentHp <= 0) return;

				const poison =
					figure.statuses.find(({ type }) => type === "poison")?.amount ?? 0;
				const regen =
					figure.statuses.find(({ type }) => type === "regen")?.amount ?? 0;

				const newHp = Math.min(
					figure.maxHp,
					Math.max(0, figure.currentHp - poison + regen),
				);

				const newStatuses = figure.statuses
					.map((status) => ({
						...status,
						duration: status.duration === -1 ? -1 : status.duration - 1,
					}))
					.filter((status) => status.duration > 0 || status.duration === -1);

				const cellId = getCellId(figure.gridPosition);
				await updateBattleUnitState(
					get,
					set,
					isSimulation,
				)({
					...figure,
					currentHp: newHp,
					statuses: newStatuses,
				});
				set(({ currentVfx }) => ({
					currentVfx: {
						...currentVfx,
						...(poison > 0 ? { [cellId]: { type: "POISON" } } : {}),
						...(regen > 0 ? { [cellId]: { type: "HEAL" } } : {}),
					},
				}));
			}
		};

// --- 4. FIXED SURFACE HELPER ---
export function applySurfaceEffect<T extends BattleUnit>({
	unit,
	surface,
}: {
	unit: T;
	surface: SurfaceData;
}) {
	let nextUnit = { ...unit };
	const nextSurface = { ...surface };

	if (nextSurface.damage) {
		nextUnit = applyDamageToEntity(nextUnit, nextSurface.damage);
	}

	if (nextSurface.status) {
		nextUnit = applyEffectToEntity({
			entity: nextUnit,
			effect: {
				type: "apply_status",
				status: nextSurface.status,
				target: "self",
			},
		});
	}

	if (nextSurface.charges && nextSurface.charges > 0) {
		nextSurface.charges -= 1;
	}

	return { unit: nextUnit, surface: nextSurface };
}
