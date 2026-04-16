import type {
	AnchorTarget,
	EffectTarget,
} from "@/modules/cards/domain/cards.type";
import type { Status } from "@/modules/units/domain/status.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import {
	isHeroId,
	isMonsterId,
	isSummon,
} from "@/modules/units/helpers/units.helpers";
import type { SurfaceType } from "../../domain/grid.type";
import type { VfxType } from "../../domain/vfx.type";
import type { BattleGet, BattleSet } from "../../store/battle.store";
import {
	doBoundingBoxesIntersect,
	getCellId,
	isUnitInTile,
} from "../grid.helpers";
import { getLineOfSightPath } from "../move.helpers";
import { applyCombatUpdate } from "../state.helpers";
import { statusRegistry } from "../status.helpers";

export const getAllegiance = (u: BattleUnit) => {
	if (isHeroId(u.id)) return "PLAYER";
	if (isMonsterId(u.id)) return "ENEMY";
	return (isSummon(u) && u.allegiance) || "NEUTRAL";
};

export const areEnemies = (u1: BattleUnit) => (u2: BattleUnit) => {
	return getAllegiance(u1) !== getAllegiance(u2);
};

const isNeutralSummon = (u: BattleUnit) =>
	isSummon(u) && u.allegiance === "NEUTRAL";

export function resolveTargets<T extends BattleUnit>(
	targetType: EffectTarget,
	anchorTarget: AnchorTarget,
	caster: BattleUnit,
	currentUnits: T[],
	patternCells?: { col: number; row: number }[],
): T["id"][] {
	const aliveUnits = currentUnits.filter((f) => f.currentHp > 0);
	if (targetType === "self") {
		return [caster.id];
	}

	if (targetType === "anchor" && anchorTarget) {
		if (patternCells && patternCells.length > 0) {
			const hitIds = patternCells.reduce(
				(targets, cell) =>
					targets.concat(
						aliveUnits.filter(isUnitInTile(cell)).map(({ id }) => id),
					),
				[] as BattleUnit["id"][],
			);
			return Array.from(new Set(hitIds));
		}

		return aliveUnits
			.filter(isUnitInTile(anchorTarget.gridPosition))
			.map((f) => f.id);
	}

	if (targetType === "all_enemies") {
		return aliveUnits
			.filter((f) => !isNeutralSummon(f))
			.filter(areEnemies(caster))
			.map((f) => f.id);
	}

	if (targetType === "all_allies") {
		return aliveUnits
			.filter((f) => !isNeutralSummon(f))
			.filter((f) => !areEnemies(caster)(f))
			.map((f) => f.id);
	}

	if (targetType === "path" && anchorTarget) {
		const targetPos = anchorTarget.gridPosition;
		const tilePath = getLineOfSightPath(caster.gridPosition, targetPos);

		const hitIds = tilePath
			.reduce(
				(targets, cell) =>
					targets.concat(
						aliveUnits.filter(isUnitInTile(cell)).map(({ id }) => id),
					),
				[] as BattleUnit["id"][],
			)
			.filter((id) => id !== caster.id);

		return Array.from(new Set(hitIds));
	}

	return [];
}

export const tickStatusesAndSurfaces =
	(get: BattleGet, set: BattleSet, isSimulation = false) =>
	async <T extends BattleUnit>(units: T[]): Promise<void> => {
		const { surfaces } = get();
		const nextSurfaces = Object.fromEntries(
			Object.entries(surfaces).map(([id, surface]) => [id, { ...surface }]),
		);

		// ==========================================
		// 1. TICK UNITS & APPLY SURFACES
		// ==========================================
		for (const unit of units) {
			if (unit.currentHp <= 0) continue;

			let totalDamage = 0;
			let totalHealing = 0;
			const newStatuses: Status[] = [];
			const tickVfxTypes: VfxType[] = [];

			// --- A. Evaluate EXISTING Statuses via Registry ---
			for (const status of unit.statuses) {
				const hook = statusRegistry[status.type]?.onTick;
				if (hook) {
					const result = await hook(get, set, isSimulation)({ unit, status });
					if (result) {
						if (result.damageTaken) totalDamage += result.damageTaken;
						if (result.healingReceived) totalHealing += result.healingReceived;
						if (result.newStatuses) newStatuses.push(...result.newStatuses);
						if (result.vfxType) tickVfxTypes.push(result.vfxType);
					}
				}
			}

			// Calculate age-down for durations
			const agedStatuses = unit.statuses
				.map((status) => ({
					...status,
					duration: status.duration === -1 ? -1 : status.duration - 1,
				}))
				.filter((status) => status.duration > 0 || status.duration === -1);

			// --- B. Evaluate Surfaces Under the Unit ---
			const processedSurfaceTypes = new Set<SurfaceType>();

			for (const surface of Object.values(nextSurfaces)) {
				if (!doBoundingBoxesIntersect(unit, surface)) continue;
				if (unit.surfaceImmunities?.includes(surface.type)) continue;
				if (processedSurfaceTypes.has(surface.type)) continue;

				processedSurfaceTypes.add(surface.type);

				if (surface.damage) totalDamage += surface.damage;
				if (surface.status) newStatuses.push(surface.status);

				if (surface.charges !== undefined) {
					surface.charges -= 1;
					if (surface.charges <= 0) {
						surface.duration = 0;
					}
				}
			}

			// --- C. Apply the Combined Combat update ---
			if (
				totalDamage > 0 ||
				totalHealing > 0 ||
				newStatuses.length > 0 ||
				unit.statuses.length > 0
			) {
				await applyCombatUpdate(
					get,
					set,
					isSimulation,
				)(unit.id, {
					damageTaken: totalDamage,
					isTrueDamage: true,
					healingReceived: totalHealing,
					newStatuses: newStatuses,
					replaceStatuses: agedStatuses,
				});
			}

			// --- D. Trigger VFX ---
			if (!isSimulation && tickVfxTypes.length > 0) {
				const anchorCellId = getCellId(unit.gridPosition);
				set(({ currentVfx }) => {
					const nextVfx = { ...currentVfx };
					nextVfx[anchorCellId] = { type: tickVfxTypes[0] };
					return { currentVfx: nextVfx };
				});
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
			if (surface.duration === 0) {
				delete nextSurfaces[cellId];
			}
		}

		if (!isSimulation) {
			set(() => ({ surfaces: nextSurfaces }));
		}
	};
