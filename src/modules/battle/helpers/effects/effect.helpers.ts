import type {
	AnchorTarget,
	EffectTarget,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { Status } from "@/modules/figures/domain/status.type";
import { isHeroId, isSummon } from "@/modules/figures/helpers/figures.helpers";
import type { SurfaceType } from "../../domain/grid.type";
import type { VfxType } from "../../domain/vfx.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { getCellId, getLineOfSightPath, isUnitInTile } from "../grid.helpers";
import { applyCombatUpdate } from "../state.helpers";
import { statusRegistry } from "../status.helpers";

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
		const tilePath = getLineOfSightPath(caster.gridPosition, targetPos);

		const hitIds = tilePath
			.reduce(
				(targets, cell) =>
					targets.concat(
						aliveFigures.filter(isUnitInTile(cell)).map(({ id }) => id),
					),
				[] as BattleUnit["id"][],
			)
			.filter((id) => id !== caster.id);

		return Array.from(new Set(hitIds));
	}

	return [];
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

			let totalDamage = 0;
			let totalHealing = 0;
			const newStatuses: Status[] = [];
			const tickVfxTypes: VfxType[] = [];

			// --- A. Evaluate EXISTING Statuses via Registry ---
			for (const status of figure.statuses) {
				const hook = statusRegistry[status.type]?.onTick;
				if (hook) {
					const result = await hook(
						get,
						set,
						isSimulation,
					)({ unit: figure, status });
					if (result) {
						if (result.damageTaken) totalDamage += result.damageTaken;
						if (result.healingReceived) totalHealing += result.healingReceived;
						if (result.newStatuses) newStatuses.push(...result.newStatuses);
						if (result.vfxType) tickVfxTypes.push(result.vfxType);
					}
				}
			}

			// Calculate age-down for durations
			const agedStatuses = figure.statuses
				.map((status) => ({
					...status,
					duration: status.duration === -1 ? -1 : status.duration - 1,
				}))
				.filter((status) => status.duration > 0 || status.duration === -1);

			// --- B. Evaluate Surfaces Under the Unit ---
			const size = figure.size ?? 1;
			const processedSurfaceTypes = new Set<SurfaceType>();

			for (let r = 0; r < size; r++) {
				for (let c = 0; c < size; c++) {
					const cellId = getCellId({
						col: figure.gridPosition.col + c,
						row: figure.gridPosition.row + r,
					});

					const surface = nextSurfaces[cellId];
					if (!surface) continue;

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
			}

			// --- C. Apply the Combined Combat update ---
			if (
				totalDamage > 0 ||
				totalHealing > 0 ||
				newStatuses.length > 0 ||
				figure.statuses.length > 0
			) {
				await applyCombatUpdate(
					get,
					set,
					isSimulation,
				)(figure.id, {
					damageTaken: totalDamage,
					healingReceived: totalHealing,
					newStatuses: newStatuses,
					replaceStatuses: agedStatuses,
				});
			}

			// --- D. Trigger VFX ---
			if (!isSimulation && tickVfxTypes.length > 0) {
				const anchorCellId = getCellId(figure.gridPosition);
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
			if (surface.duration <= 0) {
				delete nextSurfaces[cellId];
			}
		}

		if (!isSimulation) {
			set(() => ({ surfaces: nextSurfaces }));
		}
	};
