import type {
	AnchorTarget,
	CardEffect,
	EffectTarget,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { isHeroId, isSummon } from "@/modules/figures/helpers/figures.helpers";
import type { SurfaceData } from "../../domain/grid.type";
import { getCellId, getLineOfSightPath } from "../grid.helpers";

// --- 1. CLEAN FACTION HELPER ---
export function areEnemies(u1: BattleUnit, u2: BattleUnit): boolean {
	const u1IsPlayer =
		isHeroId(u1.id) || (isSummon(u1) && u1.allegiance === "PLAYER");
	const u2IsPlayer =
		isHeroId(u2.id) || (isSummon(u2) && u2.allegiance === "PLAYER");
	return u1IsPlayer !== u2IsPlayer;
}

// --- 2. STREAMLINED TARGETING ---
export function resolveTargets<T extends BattleUnit>(
	targetType: EffectTarget,
	anchorTarget: AnchorTarget,
	caster: T,
	currentFigures: T[],
	patternCells?: { col: number; row: number }[],
): T["id"][] {
	const aliveFigures = currentFigures.filter((f) => f.currentHp > 0);

	if (targetType === "self") return [caster.id];

	if (targetType === "anchor" && anchorTarget) {
		if (patternCells && patternCells.length > 0) {
			return aliveFigures
				.filter((f) =>
					patternCells.some(
						(p) => p.col === f.gridPosition.col && p.row === f.gridPosition.row,
					),
				)
				.map((f) => f.id);
		}

		return aliveFigures
			.filter(
				(f) =>
					f.gridPosition.col === anchorTarget.col &&
					f.gridPosition.row === anchorTarget.row,
			)
			.map((f) => f.id);
	}

	if (targetType === "all_enemies") {
		return aliveFigures.filter((f) => areEnemies(caster, f)).map((f) => f.id);
	}

	if (targetType === "all_allies") {
		return aliveFigures.filter((f) => !areEnemies(caster, f)).map((f) => f.id);
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

// --- 3. IMMUTABLE DAMAGE/EFFECT HELPERS ---
export function applyDamageToEntity<T extends BattleUnit>(
	entity: T,
	baseDamage: number,
): T {
	const vulnerableBonusDamage =
		entity.statuses.find((s) => s.type === "vulnerable")?.amount ?? 0;
	const incomingDamage = baseDamage + vulnerableBonusDamage;

	let effectiveDmg = Math.max(0, incomingDamage - entity.baseDef);

	const updatedStatuses = entity.statuses.map((status) => {
		if (status.type !== "temp_block" && status.type !== "perma_shield")
			return status;
		if (effectiveDmg <= 0) return status;

		if (status.amount >= effectiveDmg) {
			status.amount -= effectiveDmg;
			effectiveDmg = 0;
		} else {
			effectiveDmg -= status.amount;
			status.amount = 0;
		}
		return status;
	});

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

export function applyEffectToEntity<T extends BattleUnit>(
	entity: T,
	effect: CardEffect,
): T {
	if (effect.type === "heal") {
		return {
			...entity,
			currentHp: Math.min(entity.maxHp, entity.currentHp + effect.amount),
		};
	}

	if (effect.type === "damage") {
		return applyDamageToEntity(entity, effect.amount);
	}

	if (effect.type === "apply_status") {
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

export function tickStatuses<T extends BattleUnit>(figures: T[]): T[] {
	return figures.map((figure) => {
		if (figure.currentHp <= 0) return figure;

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

		return {
			...figure,
			currentHp: newHp,
			statuses: newStatuses,
		};
	});
}

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
		nextUnit = applyEffectToEntity(nextUnit, {
			type: "apply_status",
			status: nextSurface.status,
			target: "self",
		});
	}

	if (nextSurface.charges && nextSurface.charges > 0) {
		nextSurface.charges -= 1;
	}

	return { unit: nextUnit, surface: nextSurface };
}
