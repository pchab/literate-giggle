import type {
	AnchorTarget,
	ApplyStatusEffect,
	DamageEffect,
	EffectTarget,
	HealEffect,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { isHeroId, isSummon } from "@/modules/figures/helpers/figures.helpers";
import type { SurfaceData, SurfaceType } from "../../domain/grid.type";
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
			const hitIds = patternCells.reduce(
				(targets, cell) =>
					targets.concat(
						aliveFigures.filter(isUnitInTile(cell)).map(({ id }) => id),
					),
				[] as BattleUnit["id"][],
			);
			return Array.from(new Set(hitIds)); //
		}
		return [caster.id];
	}

	if (targetType === "anchor" && anchorTarget) {
		if (patternCells && patternCells.length > 0) {
			const hitIds = patternCells.reduce(
				(targets, cell) =>
					targets.concat(
						aliveFigures.filter(isUnitInTile(cell)).map(({ id }) => id),
					),
				[] as BattleUnit["id"][],
			);
			return Array.from(new Set(hitIds));
		}

		return aliveFigures
			.filter(isUnitInTile(anchorTarget.gridPosition))
			.map((f) => f.id);
	}

	if (targetType === "all_enemies") {
		return aliveFigures.filter(areEnemies(caster)).map((f) => f.id);
	}

	if (targetType === "all_allies") {
		return aliveFigures.filter((f) => !areEnemies(caster)(f)).map((f) => f.id);
	}

	if (targetType === "path" && anchorTarget) {
		const targetPos = anchorTarget.gridPosition;
		const tilePath = getLineOfSightPath(caster.gridPosition, targetPos).slice(
			1,
		);

		const hitIds = tilePath.reduce(
			(targets, cell) =>
				targets.concat(
					aliveFigures.filter(isUnitInTile(cell)).map(({ id }) => id),
				),
			[] as BattleUnit["id"][],
		);

		return Array.from(new Set(hitIds));
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

export const tickStatusesAndSurfaces =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
		async <T extends BattleUnit>(figures: T[]): Promise<void> => {
			const { surfaces } = get();
			const nextSurfaces = { ...surfaces };

			// ==========================================
			// 1. TICK FIGURES & APPLY SURFACES
			// ==========================================
			for (const figure of figures) {
				if (figure.currentHp <= 0) continue;

				let updatedFigure = { ...figure };

				// --- A. Evaluate EXISTING Statuses First ---
				const poison =
					updatedFigure.statuses.find(({ type }) => type === "poison")?.amount ?? 0;
				const regen =
					updatedFigure.statuses.find(({ type }) => type === "regen")?.amount ?? 0;

				const totalTickHarm = poison;

				updatedFigure.currentHp = Math.min(
					updatedFigure.maxHp,
					Math.max(0, updatedFigure.currentHp - poison + regen),
				);

				updatedFigure.statuses = updatedFigure.statuses
					.map((status) => ({
						...status,
						duration: status.duration === -1 ? -1 : status.duration - 1,
					}))
					.filter((status) => status.duration > 0 || status.duration === -1);

				if (updatedFigure.currentHp <= 0) {
					await updateBattleUnitState(get, set, isSimulation)(updatedFigure);
					continue;
				}

				// --- B. Evaluate Surfaces Under the Unit ---
				const size = updatedFigure.size ?? 1;
				const processedSurfaceTypes = new Set<SurfaceType>();

				for (let r = 0; r < size; r++) {
					for (let c = 0; c < size; c++) {
						const cellId = getCellId({
							col: updatedFigure.gridPosition.col + c,
							row: updatedFigure.gridPosition.row + r,
						});

						const surface = nextSurfaces[cellId];
						if (!surface) continue;

						if (processedSurfaceTypes.has(surface.type)) continue;
						processedSurfaceTypes.add(surface.type);

						// 1. Apply Surface Damage via Helper
						if (surface.damage) {
							updatedFigure = applyEffectToEntity({
								entity: updatedFigure,
								effect: { type: "damage", amount: surface.damage, target: "anchor" },
							});
						}

						// 2. Apply Surface Status via Helper (handles immunities/stacking!)
						if (surface.status) {
							updatedFigure = applyEffectToEntity({
								entity: updatedFigure,
								effect: { type: "apply_status", status: surface.status, target: "anchor" },
							});
						}

						// 3. Handle Trap Charges
						if (surface.charges !== undefined) {
							surface.charges -= 1;
							if (surface.charges <= 0) {
								surface.duration = 0;
							}
						}
					}
				}

				// --- C. Save State & Trigger VFX ---
				const anchorCellId = getCellId(updatedFigure.gridPosition);

				await updateBattleUnitState(
					get,
					set,
					isSimulation,
				)(updatedFigure);

				if (!isSimulation) {
					set(({ currentVfx }) => ({
						currentVfx: {
							...currentVfx,
							...(totalTickHarm > 0 ? { [anchorCellId]: { type: "POISON" } } : {}),
							...(regen > 0 ? { [anchorCellId]: { type: "HEAL" } } : {}),
						},
					}));
				}
			}

			// ==========================================
			// 2. TICK SURFACES DURATION & CLEANUP
			// ==========================================
			for (const cellId in nextSurfaces) {
				const surface = nextSurfaces[cellId];
				if (surface.duration !== -1) {
					surface.duration -= 1;
				}
				if (surface.duration <= 0) {
					delete nextSurfaces[cellId];
				}
			}

			if (!isSimulation) {
				set(() => ({ surfaces: nextSurfaces }));
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
